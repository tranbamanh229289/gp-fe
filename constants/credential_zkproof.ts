import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export enum ProofRequestStatus {
    Active = "active",
    Expired = "expired",
    Cancelled = "cancelled",
}

export enum Operator {
    $noop = "$noop",
    $eq = "$eq",
    $lt = "$lt",
    $gt = "$gt",
    $in = "$in",
    $nin = "$nin",
    $ne = "$ne",
    $lte = "$lte",
    $gte = "$gte",
    $between = "$between",
    $nonbetween = "$nonbetween",
    $exists = "$exists",
    $sd = "$sd",
    $nullify = "$nullify",
}

export const OperatorOptions = {
    [Operator.$noop]: "Noop",
    [Operator.$eq]: "Equal",
    [Operator.$lt]: "Less than",
    [Operator.$gt]: "Greater than",
    [Operator.$in]: "In",
    [Operator.$nin]: "Not in",
    [Operator.$ne]: "Not Equal",
    [Operator.$lte]: "Less than or equal",
    [Operator.$gte]: "Greater than or equal",
    [Operator.$between]: "Between",
    [Operator.$nonbetween]: "Non Between",
    [Operator.$exists]: "Exists",
    [Operator.$sd]: "Sd",
    [Operator.$nullify]: "Nullify",
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
