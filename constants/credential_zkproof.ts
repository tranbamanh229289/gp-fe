import { ProofType } from "@0xpolygonid/js-sdk";
import {
    AlertCircle,
    CheckCircle,
    CheckCircle2,
    Clock,
    Key,
    Network,
    XCircle,
} from "lucide-react";

export enum ProofRequestStatus {
    Active = "active",
    Cancelled = "cancelled",
    Expired = "expired",
}

export enum ProofSubmissionStatus {
    Pending = "pending",
    Success = "success",
    Failed = "failed",
    Expired = "expired",
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
    [ProofRequestStatus.Cancelled]: {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: AlertCircle,
    },
    [ProofRequestStatus.Expired]: {
        color: "bg-rose-100 text-rose-700 border-rose-300",
        icon: XCircle,
    },
};

export const proofSubmissionStatusConfig = {
    [ProofSubmissionStatus.Success]: {
        icon: CheckCircle,
        color: "text-emerald-700",
        bg: "bg-emerald-100",
        border: "border-emerald-300",
        label: "Success",
    },
    [ProofSubmissionStatus.Failed]: {
        icon: XCircle,
        color: "text-red-700",
        bg: "bg-red-100",
        border: "border-red-300",
        label: "Failed",
    },
    [ProofSubmissionStatus.Pending]: {
        icon: Clock,
        color: "text-amber-700",
        bg: "bg-amber-100",
        border: "border-amber-300",
        label: "Pending",
    },
    [ProofSubmissionStatus.Expired]: {
        icon: Clock,
        color: "text-rose-700",
        bg: "bg-rose-100",
        border: "border-rose-300",
        label: "Expired",
    },
};

export const proofTypeConfig = {
    [ProofType.BJJSignature]: {
        label: "Signature",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
        icon: Key,
    },
    [ProofType.Iden3SparseMerkleTreeProof]: {
        label: "MTP",
        color: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white",
        icon: Network,
    },
};
