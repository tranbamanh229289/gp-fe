import { motion } from "framer-motion";
import { CheckCircle, Shield } from "lucide-react";
import { useState } from "react";

export default function GenerateProofModal({
    proofRequest,
    credentials,
    onClose,
    onGenerate,
}: any) {
    const [selectedCredential, setSelectedCredential] = useState<number | null>(
        null
    );

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
                        Generate Zero-Knowledge Proof
                    </h3>
                    <p className="text-sm text-gray-600">
                        Select a credential to generate proof for{" "}
                        {proofRequest.verifier}
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm text-gray-900 font-semibold mb-2">
                            Requirements:
                        </p>
                        <ul className="space-y-1">
                            {proofRequest.requirements.map(
                                (req: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-gray-700 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        {req}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="space-y-3 mb-6">
                        {credentials.map((cred: any) => (
                            <motion.button
                                key={cred.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCredential(cred.id)}
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                    selectedCredential === cred.id
                                        ? "border-green-500 bg-green-50 shadow-lg shadow-green-500/20"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">
                                        {cred.type === "CitizenIdentity"
                                            ? "🆔"
                                            : cred.type === "DriverLicense"
                                            ? "🚗"
                                            : "🎓"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {cred.type}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {cred.issuer}
                                        </div>
                                    </div>
                                    {selectedCredential === cred.id && (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold transition-all"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                                onGenerate({ credentialId: selectedCredential })
                            }
                            disabled={!selectedCredential}
                            className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                        >
                            <Shield className="w-5 h-5" />
                            Generate Proof
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
