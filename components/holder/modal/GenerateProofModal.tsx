import { formatDate, formatDateTime } from "@/helper/dateTime";
import { useCredentialZKProofStore } from "@/store/credential_zkproof.store";
import { useVerifiableCredential } from "@/store/verifiable_credential.store";
import { ProofRequest } from "@/types/credential_zkproof";
import { W3CCredential } from "@0xpolygonid/js-sdk";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface GenerateProofModalProp {
    proofRequest: ProofRequest;
    onClose: () => void;
}

export default function GenerateProofModal({
    proofRequest,
    onClose,
}: GenerateProofModalProp) {
    const [verifiableCredentials, setVerifiableCredentials] = useState<
        W3CCredential[]
    >([]);
    const [selectedCredential, setSelectedCredential] = useState<string>("");

    const fetchVerifiableCredentials = useVerifiableCredential(
        (state) => state.fetchVerifiableCredentials,
    );

    const generateCredentialAtomicQueryV3Proof = useCredentialZKProofStore(
        (state) => state.generateCredentialAtomicQueryV3Proof,
    );

    const isGenerating = useCredentialZKProofStore((state) => state.loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const credentials = await fetchVerifiableCredentials();
                setVerifiableCredentials(credentials || []);
            } catch (error) {
                console.error("Failed to fetch credentials:", error);
            }
        };
        fetchData();
    }, []);

    const handleGenerate = async () => {
        if (!selectedCredential) return;

        try {
            await generateCredentialAtomicQueryV3Proof(
                proofRequest.id,
                selectedCredential,
            );
            onClose();
        } catch (error) {
            console.error("Failed to generate proof:", error);
        }
    };

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
                className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 sticky top-0 z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Generate Zero-Knowledge Proof
                    </h3>
                    <p className="text-sm text-gray-600">
                        Select a credential to generate proof for{" "}
                    </p>
                </div>

                <div className="p-6">
                    {/* Requirements Section */}
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm text-gray-900 font-semibold mb-3">
                            Proof Requirements:
                        </p>
                        <div className="space-y-2">
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">Schema:</span>{" "}
                                {proofRequest.type}
                            </div>
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">Context:</span>{" "}
                                <a
                                    href={proofRequest.context}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:underline"
                                >
                                    {proofRequest.context}
                                </a>
                            </div>
                            {proofRequest.credentialSubject && (
                                <div className="mt-2">
                                    <span className="font-medium text-sm text-gray-700">
                                        Conditions:
                                    </span>
                                    <pre className="mt-1 text-xs bg-white p-2 rounded border border-green-200 overflow-x-auto">
                                        {JSON.stringify(
                                            proofRequest.credentialSubject,
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Credentials List */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-900 mb-3">
                            Select a Credential:
                        </p>

                        {verifiableCredentials.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">
                                    No credentials available
                                </p>
                                <p className="text-xs mt-1">
                                    Please add credentials first
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {verifiableCredentials.map((cred) => {
                                    const credType = Array.isArray(cred.type)
                                        ? cred.type.find(
                                              (t) =>
                                                  t !== "VerifiableCredential",
                                          )
                                        : cred.type;

                                    return (
                                        <motion.button
                                            key={cred.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() =>
                                                setSelectedCredential(cred.id)
                                            }
                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                                selectedCredential === cred.id
                                                    ? "border-green-500 bg-green-50 shadow-lg shadow-green-500/20"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {credType}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Issued by: {cred.issuer}
                                                    </div>
                                                    {cred.expirationDate && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Expires:{" "}
                                                            {formatDateTime(
                                                                cred.expirationDate,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {selectedCredential ===
                                                    cred.id && (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            disabled={isGenerating}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale:
                                    selectedCredential && !isGenerating
                                        ? 1.05
                                        : 1,
                            }}
                            whileTap={{
                                scale:
                                    selectedCredential && !isGenerating
                                        ? 0.95
                                        : 1,
                            }}
                            onClick={handleGenerate}
                            className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Generate Proof
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
