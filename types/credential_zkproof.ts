export interface ProofRequest {
    id: string;
    threadId: string;
    verifierDID: string;
    callbackURL: string;
    reason: string;
    message: string;
    scopeID: number;
    allowedIssuers: string[];
    status: string;
    expiresTime: bigint;
    createdTime: bigint;
}

export interface ProofResponse {
    requestId: string;
    threadId: string;
    holderDID: string;
    verifiedAt: string;
}
