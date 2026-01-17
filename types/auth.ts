import { AuthRole } from "@/constants/auth";
import { PublicKey } from "@/helper/babyjub";
import { Merkletree } from "@iden3/js-merkletree";

export interface Identity {
    id: string;
    did: string;
    state: string;
    role: AuthRole;
    name: string;
}

export interface Challenge {
    id: string;
    thid: string;
    typ: string;
    from: string;
    body: {
        callbackUrl: string;
        reason: "string";
        message: string;
        scope: {
            id: string;
            circuitId: string;
            params: {
                challenge: number;
            };
        }[];
    };
}

export interface Claim {
    id: string;
    did: string;
    state: string;
    role: AuthRole;
    name: string;
}

export interface LoginResponse {
    claims: Identity;
    publicKey: PublicKey;
    accessToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

export interface AuthV3CircuitInputs {
    // Identity state
    genesisID: string;
    profileNonce: string;
    state: string;
    claimsTreeRoot: string;
    revTreeRoot: string;
    rootsTreeRoot: string;

    // Auth claim
    authClaim: string[];
    authClaimIncMtp: string[];
    authClaimNonRevMtp: string[];
    authClaimNonRevMtpNoAux: string;
    authClaimNonRevMtpAuxHi: string;
    authClaimNonRevMtpAuxHv: string;

    // Challenge & signature
    challenge: string;
    challengeSignatureR8x: string;
    challengeSignatureR8y: string;
    challengeSignatureS: string;

    // Global state
    gistRoot: string;
    gistMtp: string[];
    gistMtpAuxHi: string;
    gistMtpAuxHv: string;
    gistMtpNoAux: string;
}

export interface IdentityWallet {
    did: string;
    privateKey: string;
    claimTree: Merkletree;
    revocationTree: Merkletree;
    rootsTree: Merkletree;
}
