export enum VerifiableCredentialStatus {
    Issued = "issued",
    Revoked = "revoked",
    Expired = "expired",
}

export const verifiableCredentialStatusConfig = {
    [VerifiableCredentialStatus.Issued]: {
        color: "bg-emerald-100 text-emerald-700  border-emerald-300",
    },
    [VerifiableCredentialStatus.Revoked]: {
        color: "bg-red-100 text-red-700 border-red-300",
    },
    [VerifiableCredentialStatus.Expired]: {
        color: "bg-rose-100 text-rose-700 border-rose-300",
    },
};
