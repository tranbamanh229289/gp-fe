import { CredentialRequestStatus } from "@/constants/credential_request";
import { DocumentType } from "@/constants/document";
import { ProofType } from "@0xpolygonid/js-sdk";

export interface CredentialRequest {
    id: string;
    threadID: string;
    holderDID: string;
    holderName: string;
    issuerDID: string;
    issuerName: string;
    schemaId: string;
    schemaTitle: string;
    schemaHash: string;
    schemaURL: string;
    contextURL: string;
    schemaType: string;
    isMerklized: boolean;
    expiration: number;
    createdTime: number;
    expiresTime: number;
    status: CredentialRequestStatus;
    documentType: DocumentType;
}

export interface CredentialIssuanceRequest {
    schemaHash: string;
    schemaURL: string;
    schemaType: string;
    holderDID: string;
    issuerDID: string;
    expiration: number;
    createdTime: number;
    expiresTime: number;
}
