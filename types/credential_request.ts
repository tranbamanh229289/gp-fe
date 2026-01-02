import { DocumentType } from "@/constants/document";

export interface IssuedCredential {
    id: number;
    credentialId: string;
    holderName: string;
    holderDID: string;
    type: DocumentType;
    proofType: "signature" | "mtp";
    storageType: "offchain" | "onchain";
    issuedDate: string;
    expiryDate: string | null;
    status: "active" | "revoked" | "expired";
}

export interface CredentialOffer {
    id: number;
    holderId: number;
    holderName: string;
    holderDID: string;
    schemaId: number;
    type: DocumentType;
    providedData: any;
    status: "pending" | "approved" | "rejected" | "issued";
    createdAt: string;
}

export interface Schema {
    id: number;
    name: string;
    type: DocumentType;
    version: string;
    description: string;
    queryFields: QueryField[];
    createdAt: string;
    credentialsIssued: number;
}

export interface QueryField {
    name: string;
    type: "string" | "integer" | "boolean" | "date";
    operators: string[];
}

//
export enum CredentialRequestStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
}

export interface CredentialRequest {
    id: string;
    requestId: string;
    holderDID: string;
    holderName: string;
    issuerDID: string;
    issuerName: string;
    schemaURL: string;
    schemaType: string;
    expiration: number;
    status: CredentialRequestStatus;
}
