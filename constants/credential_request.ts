import { Clock, XCircle } from "lucide-react";

export enum CredentialRequestStatus {
    Pending = "pending",
    Expired = "expired",
    Approved = "approved",
    Rejected = "rejected",
}

export const credentialStatusConfig = {
    [CredentialRequestStatus.Pending]: {
        icon: Clock,
        color: "bg-amber-100 text-amber-700 border-amber-300",
        dot: "bg-amber-500",
    },
    [CredentialRequestStatus.Expired]: {
        icon: XCircle,
        color: "bg-rose-100 text-rose-700 border-rose-300",
        dot: "bg-rose-500",
    },
    [CredentialRequestStatus.Approved]: {
        icon: XCircle,
        color: "bg-rose-100 text-rose-700 border-rose-300",
        dot: "bg-rose-500",
    },
    [CredentialRequestStatus.Rejected]: {
        icon: XCircle,
        color: "bg-rose-100 text-red-700 border-red-300",
        dot: "bg-rose-500",
    },
};
