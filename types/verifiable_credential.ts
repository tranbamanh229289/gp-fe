export interface VerifiableCredential {
    id: string;
    holderDID: string;
    issuerDID: string;
    schemaURL: string;
    claimSubject: string;
    claimHi: string;
    claimHv: string;
    revNonce: bigint;
    expirationData: string;
    issuanceDate: string;
    proofType: string;
    issuerState: string;
}
