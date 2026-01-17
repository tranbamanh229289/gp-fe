"use client";

import {
    getPublicKey,
    PublicKey,
    BabyJubWallet,
    getWalletFromPrivateKey,
    signPoseidon,
    verifyPoseidon,
} from "@/helper/babyjub";
import { AuthV3CircuitInputs } from "@/types/auth";
import { Poseidon } from "@iden3/js-crypto";
import {
    Blockchain,
    buildDIDType,
    Claim,
    ClaimOptions,
    DID,
    DidMethod,
    Id,
    NetworkId,
    SchemaHash,
} from "@iden3/js-iden3-core";
import { Hash, InMemoryDB, Merkletree, str2Bytes } from "@iden3/js-merkletree";
import { Signature } from "@zk-kit/eddsa-poseidon";
import { StateService } from "./state.service";
import * as snarkjs from "snarkjs";
import { MerkleTreeProof } from "@/types/auth_zkproof";
import { VerifiableCredential } from "@/types/verifiable_credential";

class MTService {
    private wallet: BabyJubWallet;
    private did: DID;
    private claimsTree: Merkletree;
    private revTree: Merkletree;
    private rootsTree: Merkletree;
    private stateService: StateService;
    private MTLevel: number;
    private authV3WasmPath: string;
    private authV3ZkeyPath: string;
    private initialized = false;

    constructor(privateKey: string) {
        this.wallet = getWalletFromPrivateKey(privateKey);
        this.did = new DID();
        this.MTLevel = Number(process.env.NEXT_PUBLIC_MT_LEVEL) || 40;
        this.authV3WasmPath =
            process.env.NEXT_PUBLIC_AUTH_V3_WASM_PATH ||
            "./circuits/authV3/circuit.wasm";
        this.authV3ZkeyPath =
            process.env.NEXT_PUBLIC_AUTH_V3_ZKEY_PATH ||
            "./circuits/authV3/circuit_final.zkey";

        // ✅ Create separate DB for each tree!
        this.claimsTree = new Merkletree(
            new InMemoryDB(str2Bytes("")),
            true,
            this.MTLevel,
        );

        this.revTree = new Merkletree(
            new InMemoryDB(str2Bytes("")),
            true,
            this.MTLevel,
        );

        this.rootsTree = new Merkletree(
            new InMemoryDB(str2Bytes("")),
            true,
            this.MTLevel,
        );

        this.stateService = new StateService();
    }

    async initialize(): Promise<void> {
        const authClaim = await this.getAuthClaim();
        await this.addClaim(authClaim);
        const typ = buildDIDType(
            DidMethod.PolygonId,
            Blockchain.Polygon,
            NetworkId.Amoy,
        );
        const state = await this.getState();
        this.did = DID.newFromIdenState(typ, state);
        this.initialized = true;
    }

    private async updateRootsTree(): Promise<void> {
        const claimsRoot = await this.claimsTree.root();
        await this.rootsTree.add(claimsRoot.bigInt(), BigInt(1));
    }

    signClaim(claim: Claim): Signature {
        const hiHv = claim.hiHv();
        const messageHash = Poseidon.hash([hiHv.hi, hiHv.hv]);
        return signPoseidon(messageHash, this.wallet.privateKey);
    }

    signPoseidon(message: bigint): Signature {
        return signPoseidon(message, this.wallet.privateKey);
    }

    verifyPoseidon(message: bigint, signature: Signature): boolean {
        return verifyPoseidon(message, signature, this.wallet.publicKey);
    }

    async revokeClaim(claim: Claim): Promise<void> {
        const revNonce = claim.getRevocationNonce();
        await this.revTree.add(revNonce, BigInt(0));
    }

    async addClaim(claim: Claim): Promise<void> {
        const hihv = claim.hiHv();
        await this.claimsTree.add(hihv.hi, hihv.hv);
        await this.updateRootsTree();
    }

    getAuthClaim(): Claim {
        const schemaHash = SchemaHash.authSchemaHash;
        const publicKey = getPublicKey(this.wallet.privateKey);

        const claim = Claim.newClaim(
            schemaHash,
            ClaimOptions.withIndexDataInts(
                BigInt(publicKey.x),
                BigInt(publicKey.y),
            ),
            ClaimOptions.withRevocationNonce(BigInt(1)),
        );
        return claim;
    }

    async getProof(claim: Claim, tree: Merkletree): Promise<MerkleTreeProof> {
        const hihv = claim.hiHv();
        const root = await tree.root();
        const { proof, value } = await tree.generateProof(hihv.hi, root);
        let siblings = proof.allSiblings().map((s) => s.bigInt().toString());
        if (siblings.length === 0 || siblings.length < this.MTLevel) {
            siblings = [
                ...siblings,
                ...Array(this.MTLevel - siblings.length).fill("0"),
            ];
        }
        return {
            siblings,
            auxHi: proof.nodeAux?.key.bigInt().toString() || "0",
            auxHv: proof.nodeAux?.value.bigInt().toString() || "0",
            noAux: proof.nodeAux ? "0" : "1",
        };
    }

    async getState(): Promise<bigint> {
        const claimsRoot = await this.claimsTree.root();
        const revRoot = await this.revTree.root();
        const rootsRoot = await this.rootsTree.root();
        const state = Poseidon.hash([
            claimsRoot.bigInt(),
            revRoot.bigInt(),
            rootsRoot.bigInt(),
        ]);
        return state;
    }

    static async calculateState(
        claimsRoot: Hash,
        revRoot: Hash,
        rootsRoot: Hash,
    ): Promise<bigint> {
        const state = Poseidon.hash([
            claimsRoot.bigInt(),
            revRoot.bigInt(),
            rootsRoot.bigInt(),
        ]);

        return state;
    }

    getID(): Id {
        const did = this.did;
        const id = DID.idFromDID(did);
        return id;
    }

    getDID(): DID {
        return this.did;
    }

    async getAuthV3CircuitInput(
        challenge: bigint,
    ): Promise<AuthV3CircuitInputs> {
        if (!this.initialized) {
            throw new Error("Circuit service must be initialized first!");
        }
        const claimsRoot = await this.claimsTree.root();
        const revRoot = await this.revTree.root();
        const rootsRoot = await this.rootsTree.root();

        const state = await MTService.calculateState(
            claimsRoot,
            revRoot,
            rootsRoot,
        );

        const id = this.getID();
        const genesisID = id.bigInt();

        const authClaim = this.getAuthClaim();
        const authClaimProof = await this.getProof(authClaim, this.claimsTree);
        const authClaimNonRevProof = await this.getProof(
            authClaim,
            this.revTree,
        );

        const signature = this.signPoseidon(challenge);
        const gistRoot = await this.stateService.getGISTRoot();
        const gistProof: MerkleTreeProof =
            await this.stateService.getGISTProofById(id.bigInt());

        const gistMtp = gistProof?.siblings || Array(64).fill("0");

        const inputs: AuthV3CircuitInputs = {
            genesisID: genesisID.toString(),
            profileNonce: "0",
            state: state.toString(),
            claimsTreeRoot: claimsRoot.bigInt().toString(),
            revTreeRoot: revRoot.bigInt().toString(),
            rootsTreeRoot: rootsRoot.bigInt().toString(),
            authClaim: authClaim.marshalJson().map((v) => v.toString()),
            authClaimIncMtp: authClaimProof.siblings,
            authClaimNonRevMtp: authClaimNonRevProof.siblings,
            authClaimNonRevMtpAuxHi: authClaimNonRevProof.auxHi,
            authClaimNonRevMtpAuxHv: authClaimNonRevProof.auxHv,
            authClaimNonRevMtpNoAux: authClaimNonRevProof.noAux,
            challenge: challenge.toString(),
            challengeSignatureR8x: signature.R8[0].toString(),
            challengeSignatureR8y: signature.R8[1].toString(),
            challengeSignatureS: signature.S.toString(),
            gistRoot: gistRoot,
            gistMtp: gistMtp,
            gistMtpAuxHi: gistProof?.auxHi || "0",
            gistMtpAuxHv: gistProof?.auxHv || "0",
            gistMtpNoAux: gistProof?.noAux || "1",
        };

        return inputs;
    }

    async credentialAtomicQueryV3OffchainInput(vc: VerifiableCredential) {}

    async generateZKProof(inputs: snarkjs.CircuitSignals): Promise<{
        proof: snarkjs.Groth16Proof;
        publicSignals: snarkjs.PublicSignals;
    }> {
        if (!this.authV3WasmPath || !this.authV3ZkeyPath) {
            throw new Error(
                "AUTH_V3_WASM_PATH and AUTH_V3_ZKEY_PATH environment variables must be set",
            );
        }

        try {
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                inputs,
                this.authV3WasmPath,
                this.authV3ZkeyPath,
            );

            return { proof, publicSignals };
        } catch (error) {
            throw new Error(
                `Failed to generate proof: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }
    }

    /**
     * Get the current state and ID of the identity
     */
    async getIdentityInfo(): Promise<{
        state: bigint;
        id: Id;
        did: DID;
    }> {
        const state = await this.getState();
        const id = this.getID();
        const did = this.getDID();
        return {
            state,
            id,
            did,
        };
    }

    /**
     * Get wallet public key
     */
    getPublicKey(): PublicKey {
        return this.wallet.publicKey;
    }

    /**
     * Check if a claim exists in the claims tree
     */
    async isClaimExists(claim: Claim): Promise<boolean> {
        const hihv = claim.hiHv();
        const root = await this.claimsTree.root();
        const { proof } = await this.claimsTree.generateProof(hihv.hi, root);
        return proof.existence;
    }

    /**
     * Check if a claim is revoked
     */
    async isClaimRevoked(claim: Claim): Promise<boolean> {
        const revNonce = claim.getRevocationNonce();
        const root = await this.revTree.root();
        const { proof } = await this.revTree.generateProof(revNonce, root);
        return proof.existence;
    }

    /**
     * Get tree roots
     */
    async getTreeRoots(): Promise<{
        claimsRoot: Hash;
        revRoot: Hash;
        rootsRoot: Hash;
    }> {
        return {
            claimsRoot: await this.claimsTree.root(),
            revRoot: await this.revTree.root(),
            rootsRoot: await this.rootsTree.root(),
        };
    }
}

export async function createMTService(privateKey: string): Promise<MTService> {
    const mtService = new MTService(privateKey);
    await mtService.initialize();
    return mtService;
}
