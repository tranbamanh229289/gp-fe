import { proofSubmissionStatusConfig } from "@/constants/credential_zkproof";
import { formatDate } from "@/helper/dateTime";
import { ProofSubmission } from "@/types/credential_proof";
import { AnimatePresence, motion } from "framer-motion";
import {
    Building2,
    Calendar,
    Check,
    Code2,
    Copy,
    FileCheck,
    Timer,
    X,
} from "lucide-react";
import { useState } from "react";

interface ProofSubmissionModalProp {
    selectedSubmission: ProofSubmission | null;
    onClose: () => void;
}

export default function ProofSubmissionDetailModal({
    selectedSubmission,
    onClose,
}: ProofSubmissionModalProp) {
    const [copiedField, setCopiedField] = useState<string>("");
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    };

    return (
        <AnimatePresence>
            {selectedSubmission && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-500 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <FileCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            Proof Submission Details
                                        </h2>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoField
                                            label="Verifier Name"
                                            value={
                                                selectedSubmission.verifierName
                                            }
                                        />
                                        <InfoField
                                            label="Circuit ID"
                                            value={selectedSubmission.circuitId}
                                            onCopy={() =>
                                                copyToClipboard(
                                                    selectedSubmission.circuitId,
                                                    "circuitId",
                                                )
                                            }
                                            isCopied={
                                                copiedField === "circuitId"
                                            }
                                            mono
                                        />
                                    </div>

                                    <InfoField
                                        label="Verifier DID"
                                        value={selectedSubmission.verifierDID}
                                        onCopy={() =>
                                            copyToClipboard(
                                                selectedSubmission.verifierDID,
                                                "verifierDID",
                                            )
                                        }
                                        isCopied={copiedField === "verifierDID"}
                                        mono
                                    />

                                    {selectedSubmission.message && (
                                        <InfoField
                                            label="Message"
                                            value={selectedSubmission.message}
                                        />
                                    )}
                                </div>
                                {/* Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm font-semibold">
                                                Created
                                            </span>
                                        </div>
                                        <p className="text-blue-900 font-medium">
                                            {formatDate(
                                                selectedSubmission.createdTime,
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                        <div className="flex items-center gap-2 text-orange-700 mb-2">
                                            <Timer className="w-4 h-4" />
                                            <span className="text-sm font-semibold">
                                                Expires
                                            </span>
                                        </div>
                                        <p className="text-orange-900 font-medium">
                                            {formatDate(
                                                selectedSubmission.expiresTime,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* ZK Proof */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-purple-600" />
                                        Zero-Knowledge Proof Data
                                    </h3>

                                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                                        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <span className="text-sm text-gray-400 ml-2">
                                                    zkProof.json
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        JSON.stringify(
                                                            selectedSubmission.zkProof,
                                                            null,
                                                            2,
                                                        ),
                                                        "zkProof",
                                                    )
                                                }
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                                            >
                                                {copiedField === "zkProof" ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-green-400" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>Copy JSON</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <pre className="p-4 overflow-x-auto text-xs text-gray-300 font-mono max-h-96 overflow-y-auto">
                                            {JSON.stringify(
                                                selectedSubmission.zkProof,
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Reusable InfoField Component
function InfoField({
    label,
    value,
    onCopy,
    isCopied,
    mono = false,
}: {
    label: string;
    value: string;
    onCopy?: () => void;
    isCopied?: boolean;
    mono?: boolean;
}) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                {label}
            </label>
            <div className="flex items-start gap-2">
                <p
                    className={`text-sm text-gray-900 flex-1 break-all ${
                        mono ? "font-mono" : ""
                    }`}
                >
                    {value}
                </p>
                {onCopy && (
                    <button
                        onClick={onCopy}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    >
                        {isCopied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
