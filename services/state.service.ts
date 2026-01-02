import { ethers } from "ethers";
import abi from "../abi/stateABI.json";
import { Wallet } from "ethers";
import { MerkleTreeProof } from "@/types/auth_zkproof";

export class StateService {
    private provider: ethers.Provider;
    private stateContract: ethers.Contract;

    constructor() {
        const RPC =
            process.env.NEXT_PUBLIC_RPC_URL || "https://polygon-amoy.drpc.org";
        const STATE_CONTRACT =
            process.env.NEXT_PUBLIC_STATE_CONTRACT ||
            "0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124";
        this.provider = new ethers.JsonRpcProvider(RPC);
        this.stateContract = new ethers.Contract(
            STATE_CONTRACT,
            abi,
            this.provider
        );
    }

    async transitState(privateKey: string) {
        const wallet = new Wallet(privateKey);
        this.stateContract.connect(wallet);
    }

    async getGISTRoot(): Promise<string> {
        try {
            const gistRoot = await this.stateContract.getGISTRoot();
            return gistRoot.toString();
        } catch (error) {
            throw new Error(
                `Failed to get GIST root: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getGISTProofById(id: bigint): Promise<MerkleTreeProof> {
        try {
            const proof = await this.stateContract.getGISTProof(id);
            return {
                siblings: proof.siblings.map((s: any) => s.toString()),
                auxHi: proof.auxIndex.toString(),
                auxHv: proof.auxValue.toString(),
                noAux: proof.auxExistence ? "0" : "1",
            };
        } catch (error) {
            throw new Error(
                `Failed to get GIST proof for id ${id}: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    async getStateInfoById(id: bigint): Promise<{
        id: bigint;
        state: bigint;
        replacedByState: bigint;
        createdAtTimestamp: bigint;
        replacedAtTimestamp: bigint;
        createdAtBlock: bigint;
        replacedAtBlock: bigint;
    }> {
        try {
            const info = await this.stateContract.getStateInfoById(id);
            return {
                id: BigInt(info.id.toString()),
                state: BigInt(info.state.toString()),
                replacedByState: BigInt(info.replacedByState.toString()),
                createdAtTimestamp: BigInt(info.createdAtTimestamp.toString()),
                replacedAtTimestamp: BigInt(
                    info.replacedAtTimestamp.toString()
                ),
                createdAtBlock: BigInt(info.createdAtBlock.toString()),
                replacedAtBlock: BigInt(info.replacedAtBlock.toString()),
            };
        } catch (error) {
            throw new Error(
                `Failed to get state info: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
}
