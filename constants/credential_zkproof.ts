import { Operators } from "@0xpolygonid/js-sdk";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export enum ProofRequestStatus {
    Active = "active",
    Expired = "expired",
    Cancelled = "cancelled",
}

export const OperatorOptions = {
    [Operators.NOOP]: { value: "$noop", label: "Noop" },
    [Operators.EQ]: { value: "$eq", label: "Equal" },
    [Operators.LT]: { value: "$lt", label: "Less than" },
    [Operators.GT]: { value: "$gt", label: "Greater than" },
    [Operators.IN]: { value: "$in", label: "In" },
    [Operators.NIN]: { value: "$nin", label: "Not in" },
    [Operators.NE]: { value: "$ne", label: "Not Equal" },
    [Operators.LTE]: { value: "$lte", label: "Less than or equal" },
    [Operators.GTE]: { value: "$gte", label: "Greater than or equal" },
    [Operators.BETWEEN]: { value: "$between", label: "Between" },
    [Operators.NONBETWEEN]: { value: "$nonbetween", label: "Non Between" },
    [Operators.EXISTS]: { value: "$exists", label: "Exists" },
    [Operators.SD]: { value: "$sd", label: "Sd" },
    [Operators.NULLIFY]: { value: "$nullify", label: "Nullify" },
};

export const proofRequestStatusConfig = {
    [ProofRequestStatus.Active]: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-300",
        icon: CheckCircle,
    },
    [ProofRequestStatus.Expired]: {
        color: "bg-rose-100 text-rose-700 border-rose-300",
        icon: XCircle,
    },
    [ProofRequestStatus.Cancelled]: {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: AlertCircle,
    },
};
