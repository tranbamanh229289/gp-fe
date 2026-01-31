import {
    Operator,
    ProofRequestStatus,
    ProofSubmissionStatus,
} from "@/constants/credential_zkproof";
import {
    CircuitId,
    JsonDocumentObject,
    ProofType,
    ZeroKnowledgeProofQuery,
} from "@0xpolygonid/js-sdk";
import { ZKProof } from "./zkproof";

export interface ProofRequest {
    id: string;
    threadId: string;
    verifierDID: string;
    verifierName: string;
    schemaId: string;
    callbackURL: string;
    reason: string;
    message: string;
    circuitId: string;
    scopeId: number;
    allowedIssuers: string[];
    credentialSubject: JsonDocumentObject;
    context: string;
    type: string;
    proofType: ProofType;
    skipClaimRevocationCheck: boolean;
    groupId: number;
    nullifierSession: string;
    status: ProofRequestStatus;
    expiresTime: number;
    createdTime: number;
}

export interface ProofSubmission {
    id: string;
    threadId: string;
    requestId: string;
    holderDID: string;
    holderName: string;
    verifierDID: string;
    verifierName: string;
    circuitId: string;
    scopeId: string;
    message: string;
    zkProof: ZKProof;
    createdTime: number;
    expiresTime: number;
    status: ProofSubmissionStatus;
    verifiedDate: string;
}

export interface AuthorizationRequest {
    verifierDID: string;
    callback: string;
    reason: string;
    message: string;
    circuitId: CircuitId;
    query: ZeroKnowledgeProofQuery;
    params: {
        nullifierSessionId?: string | number;
    };
    expiresTime: number;
    createdTime: number;
}

export interface QueryCondition {
    field: string;
    operator: Operator;
    value: number;
}
