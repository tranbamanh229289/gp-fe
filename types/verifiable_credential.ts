import { DocumentType } from "@/constants/document";
import {
    Iden3SparseMerkleTreeProof,
    ProofType,
    W3CCredential,
} from "@0xpolygonid/js-sdk";
import { DocumentData } from "./document";
import { Proof } from "@iden3/js-merkletree";

// export interface VerifiableCredential {
//     id: string;
//     holderDID: string;
//     holderName: string;
//     issuerDID: string;
//     issuerName: string;
//     schemaId: string;
//     schemaURL: string;
//     contextURL: string;
//     schemaType: string;
//     documentType: DocumentType;
//     credentialSubject: Record<string, Partial<DocumentData>>;
//     claimSubject: string;
//     claimHi: string;
//     claimHv: string;
//     claimHex: string;
//     claimMtp: Proof;
//     revNonce: number;
//     authClaimHex: string;
//     authClaimMTP: Proof;
//     signature: Signature;
//     issuerState: string;
//     claimsTreeRoot: string;
//     revTreeRoot: string;
//     rootsTreeRoot: string;
//     issuanceDate: string;
//     expirationDate: string;
//     status: string;
// }

export interface Signature {
    signatureS: string;
    signatureR8X: string;
    signatureR8Y: string;
}

export interface VerifiableCredential extends W3CCredential {}

Iden3SparseMerkleTreeProof;
