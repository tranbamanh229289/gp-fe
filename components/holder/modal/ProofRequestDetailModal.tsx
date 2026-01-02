import { CheckCircle, Key, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ProofRequestDetailModal({
    proofRequest,
    onClose,
}: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl"
            >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Proof Request Details
                    </h3>
                    <p className="text-sm text-gray-600">
                        Complete verification information
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Verifier Info */}
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start gap-3 mb-3">
                            <Shield className="w-6 h-6 text-green-600" />
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-900 mb-1">
                                    {proofRequest.verifier}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {proofRequest.requestType}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                    proofRequest.status === "pending"
                                        ? "bg-amber-100 text-amber-700 border-amber-300"
                                        : proofRequest.status === "verified"
                                        ? "bg-green-100 text-green-700 border-green-300"
                                        : "bg-red-100 text-red-700 border-red-300"
                                }`}
                            >
                                {proofRequest.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 font-mono bg-white px-3 py-2 rounded border border-green-200">
                            {proofRequest.verifierDID}
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Request Details
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Requested Date:
                                </span>
                                <span className="text-gray-900 font-semibold">
                                    {new Date(
                                        proofRequest.requestedDate
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Request Type:
                                </span>
                                <span className="text-gray-900 font-semibold">
                                    {proofRequest.requestType}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="text-gray-900 font-semibold capitalize">
                                    {proofRequest.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Verification Requirements
                        </h4>
                        <ul className="space-y-2">
                            {proofRequest.requirements.map(
                                (req: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-900">
                                            {req}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* ZK Proof Info */}
                    {proofRequest.status === "verified" && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Key className="w-4 h-4 text-green-600" />
                                <h4 className="text-sm font-semibold text-green-700">
                                    Zero-Knowledge Proof
                                </h4>
                            </div>
                            <p className="text-xs text-gray-600">
                                This proof was generated using zero-knowledge
                                cryptography. The verifier can confirm the
                                requirements are met without accessing your
                                actual credential data.
                            </p>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all border border-gray-300"
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
