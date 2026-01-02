import { useState } from "react";
import { motion } from "framer-motion";
import { CircuitID } from "@/constants/credential_zkproof";
import { VerifierModal } from "@/constants/verifier";

interface CreateRequestProp {
    setModal: (modal: VerifierModal) => void;
    getStatusBadge: (status: string) => string;
}

// Operators for query conditions
const OPERATORS = {
    $eq: "Equal to",
    $ne: "Not equal to",
    $lt: "Less than",
    $lte: "Less than or equal",
    $gt: "Greater than",
    $gte: "Greater than or equal",
    $in: "In array",
    $nin: "Not in array",
};

const CIRCUIT_IDS = [
    { value: CircuitID.AuthV3, label: "Auth V3" },
    {
        value: CircuitID.CredentialAtomicQueryV3,
        label: "Credential Atomic Query V3",
    },
];

export default function CreateProofRequestModal({
    setModal,
}: CreateRequestProp) {
    const [formData, setFormData] = useState({
        message: "",
        reason: "",
        circuitId: "credentialAtomicQuerySigV2",
        schemaUrl: "",
        schemaType: "",
        skipClaimRevocationCheck: false,

        // Query builder
        queryField: "birthday",
        queryOperator: "$lt",
        queryValue: "20050101",

        // Optional
        nullifierSessionId: "",
        groupId: "",
    });

    const [queryConditions, setQueryConditions] = useState<any[]>([
        { field: "birthday", operator: "$lt", value: "20050101" },
    ]);

    const addQueryCondition = () => {
        setQueryConditions([
            ...queryConditions,
            {
                field: formData.queryField,
                operator: formData.queryOperator,
                value: formData.queryValue,
            },
        ]);
    };

    const removeQueryCondition = (index: number) => {
        setQueryConditions(queryConditions.filter((_, i) => i !== index));
    };

    const buildQuery = () => {
        const query: any = {
            allowedIssuers: ["*"],
            type: formData.schemaType,
            context: formData.schemaUrl,
            credentialSubject: {},
        };

        queryConditions.forEach((cond) => {
            query.credentialSubject[cond.field] = {
                [cond.operator]: isNaN(Number(cond.value))
                    ? cond.value
                    : Number(cond.value),
            };
        });

        return query;
    };

    const handleSubmit = async () => {
        const query = buildQuery();

        const authRequest = {
            id: crypto.randomUUID(),
            typ: "application/iden3comm-plain-json",
            type: "https://iden3-communication.io/authorization/1.0/request",
            thid: crypto.randomUUID(),
            body: {
                callbackUrl: `${window.location.origin}/api/callback`,
                reason: formData.reason,
                message: formData.message,
                scope: [
                    {
                        id: 1,
                        circuitId: formData.circuitId,
                        query: query,
                        params: {
                            nullifierSessionId:
                                formData.nullifierSessionId || undefined,
                            groupId: formData.groupId || undefined,
                        },
                    },
                ],
            },
            from: "did:polygonid:polygon:mumbai:...", // Verifier DID
        };

        console.log(
            "Authorization Request:",
            JSON.stringify(authRequest, null, 2)
        );

        // TODO: Send to backend or generate QR code
        alert("Proof request created! Check console for details.");
        setModal(VerifierModal.Null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-8"
            >
                <div className="p-8 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Create ZKP Proof Request
                    </h3>
                    <p className="text-gray-600">
                        Create authorization request for credential verification
                    </p>
                </div>

                <div className="p-8 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Basic Information
                        </h4>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Request Message *
                            </label>
                            <input
                                type="text"
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        message: e.target.value,
                                    })
                                }
                                placeholder="Prove you are over 18"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Reason *
                            </label>
                            <input
                                type="text"
                                value={formData.reason}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        reason: e.target.value,
                                    })
                                }
                                placeholder="Age verification for adult content access"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Schema Selection */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Credential Schema
                        </h4>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Schema Type *
                            </label>
                            <input
                                type="text"
                                value={formData.schemaType}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        schemaType: e.target.value,
                                    })
                                }
                                placeholder="KYCAgeCredential"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Schema Context URL *
                            </label>
                            <input
                                type="text"
                                value={formData.schemaUrl}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        schemaUrl: e.target.value,
                                    })
                                }
                                placeholder="https://schema.org/KYCAgeCredential"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Circuit Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Circuit ID *
                        </label>
                        <select
                            value={formData.circuitId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    circuitId: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            {CIRCUIT_IDS.map((circuit) => (
                                <option
                                    key={circuit.value}
                                    value={circuit.value}
                                >
                                    {circuit.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Query Builder */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Query Conditions
                        </h4>

                        {/* Existing Conditions */}
                        <div className="space-y-2">
                            {queryConditions.map((condition, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200"
                                >
                                    <div className="flex-1 grid grid-cols-3 gap-3">
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-700">
                                                Field:
                                            </span>
                                            <p className="text-gray-900">
                                                {condition.field}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-700">
                                                Operator:
                                            </span>
                                            <p className="text-gray-900">
                                                {
                                                    OPERATORS[
                                                        condition.operator as keyof typeof OPERATORS
                                                    ]
                                                }
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-700">
                                                Value:
                                            </span>
                                            <p className="text-gray-900 font-mono">
                                                {condition.value}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            removeQueryCondition(index)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Condition */}
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                            <p className="text-sm font-semibold text-gray-700">
                                Add Condition
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        value={formData.queryField}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                queryField: e.target.value,
                                            })
                                        }
                                        placeholder="Field name"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={formData.queryOperator}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                queryOperator: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        {Object.entries(OPERATORS).map(
                                            ([op, label]) => (
                                                <option key={op} value={op}>
                                                    {label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={formData.queryValue}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                queryValue: e.target.value,
                                            })
                                        }
                                        placeholder="Value"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={addQueryCondition}
                                className="w-full px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm transition-colors"
                            >
                                + Add Condition
                            </button>
                        </div>

                        <div className="p-4 bg-gray-900 rounded-xl">
                            <p className="text-xs text-gray-400 mb-2">
                                Generated Query:
                            </p>
                            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                                {JSON.stringify(buildQuery(), null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Advanced Options
                        </h4>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Nullifier Session ID (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.nullifierSessionId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nullifierSessionId: e.target.value,
                                    })
                                }
                                placeholder="Unique session identifier"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Prevent replay attacks by binding proof to
                                session
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Group ID (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.groupId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        groupId: e.target.value,
                                    })
                                }
                                placeholder="Group identifier"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <input
                                type="checkbox"
                                id="skipRevocation"
                                checked={formData.skipClaimRevocationCheck}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        skipClaimRevocationCheck:
                                            e.target.checked,
                                    })
                                }
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="skipRevocation"
                                className="text-sm text-gray-700"
                            >
                                Skip claim revocation check (not recommended for
                                production)
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setModal(VerifierModal.Null)}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all"
                        >
                            Create Request
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
