import { proofTypeConfig } from "@/constants/credential_zkproof";
import { formatDateTime } from "@/helper/dateTime";
import { ProofType, W3CCredential } from "@0xpolygonid/js-sdk";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Shield, X } from "lucide-react";
import { useState } from "react";

interface VerifiableCredentialDetailProp {
    selectedCredential: W3CCredential;
    onClose: () => void;
}
export default function VerifiableCredentialDetail({
    selectedCredential,
    onClose,
}: VerifiableCredentialDetailProp) {
    const downloadVerifiableCredential = () => {
        const blob = new Blob([JSON.stringify(selectedCredential)], {
            type: "text/plain",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `verifiable credential.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const [copiedField, setCopiedField] = useState<string>("");
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gradient-to-br from-violet-900/50 via-fuchsia-900/50 to-pink-900/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Modal Header with gradient */}
                    <div className="relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-8 text-white overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                        </div>

                        <div className="relative flex items-start justify-between">
                            <div className="flex items-center gap-6">
                                <motion.div
                                    initial={{ rotate: -180, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        duration: 0.6,
                                    }}
                                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30"
                                >
                                    <Shield className="w-8 h-8" />
                                </motion.div>
                                <div>
                                    <h2 className="text-3xl font-black mb-2">
                                        Credential Details
                                    </h2>
                                    <p className="text-violet-100 text-base font-semibold">
                                        W3C Verifiable Credential Standard
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] bg-gradient-to-br from-slate-50 to-violet-50">
                        <div className="space-y-6">
                            {/* Credential Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                        Credential Information
                                    </h3>

                                    <InfoField
                                        label="Credential ID"
                                        value={selectedCredential.id}
                                        mono
                                        copyable
                                    />
                                    <InfoField
                                        label="Type"
                                        value={selectedCredential.type[1]}
                                    />
                                </div>

                                {/* Subject & Issuer */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                                        Subject & Issuer
                                    </h3>

                                    <InfoField
                                        label="Subject DID"
                                        value={
                                            selectedCredential.credentialSubject
                                                .id as string
                                        }
                                        mono
                                        copyable
                                    />
                                    <InfoField
                                        label="Issuer DID"
                                        value={selectedCredential.issuer}
                                        mono
                                        copyable
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoField
                                    label="Issued Date"
                                    value={formatDateTime(
                                        selectedCredential.issuanceDate as string,
                                    )}
                                />
                                {selectedCredential.expirationDate && (
                                    <InfoField
                                        label="Expiration Date"
                                        value={formatDateTime(
                                            selectedCredential.expirationDate as string,
                                        )}
                                    />
                                )}
                            </div>

                            {/* Credential Subject Data */}
                            {selectedCredential.credentialSubject && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text flex items-center gap-3">
                                        <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                                        Credential Subject
                                    </h3>

                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl opacity-50 group-hover:opacity-75 blur transition duration-300"></div>
                                        <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-6 border border-purple-200/50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(
                                                    selectedCredential.credentialSubject,
                                                )
                                                    .filter(
                                                        ([key]) =>
                                                            key !== "id" &&
                                                            key !== "type",
                                                    )
                                                    .map(
                                                        ([key, value], idx) => (
                                                            <motion.div
                                                                key={key}
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.9,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        idx *
                                                                        0.05,
                                                                }}
                                                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 hover:border-pink-300 transition-colors"
                                                            >
                                                                <div className="text-xs font-black text-purple-700 uppercase tracking-wider mb-2">
                                                                    {key}
                                                                </div>
                                                                <div className="text-base font-bold text-slate-900">
                                                                    {typeof value ===
                                                                    "object"
                                                                        ? JSON.stringify(
                                                                              value,
                                                                          )
                                                                        : String(
                                                                              value,
                                                                          )}
                                                                </div>
                                                            </motion.div>
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Proof Information */}
                            {selectedCredential.proof && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text flex items-center gap-3">
                                        <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
                                        Zero knowledge Proofs
                                    </h3>

                                    <div className="space-y-4">
                                        {(Array.isArray(
                                            selectedCredential.proof,
                                        )
                                            ? selectedCredential.proof
                                            : [selectedCredential.proof]
                                        ).map((proof: any, idx: number) => (
                                            <motion.div
                                                key={idx}
                                                initial={{
                                                    opacity: 0,
                                                    x: -20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    delay: 0.4 + idx * 0.1,
                                                }}
                                                className="relative group"
                                            >
                                                <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 border border-emerald-200/50">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span
                                                            className={`px-4 py-2 rounded-xl text-sm font-black shadow-lg ${
                                                                proofTypeConfig[
                                                                    proof.type as ProofType
                                                                ].color
                                                            }`}
                                                        >
                                                            {
                                                                proofTypeConfig[
                                                                    proof.type as ProofType
                                                                ].label
                                                            }
                                                        </span>
                                                        <span className="px-3 py-1 bg-white rounded-lg text-sm">
                                                            Status:{" "}
                                                            <span className="font-black text-emerald-700">
                                                                {
                                                                    proof
                                                                        .issuerData
                                                                        ?.credentialStatus
                                                                }
                                                            </span>
                                                        </span>
                                                    </div>

                                                    {proof.signature && (
                                                        <div className="mt-4">
                                                            <div className="text-sm font-black text-emerald-900 mb-2 uppercase tracking-wide">
                                                                Signature:
                                                            </div>
                                                            <code className="text-xs bg-white/80 backdrop-blur-sm p-4 rounded-xl block break-all font-mono text-slate-800 border border-emerald-200">
                                                                {
                                                                    proof.signature
                                                                }
                                                            </code>
                                                        </div>
                                                    )}

                                                    {proof.issuerData
                                                        ?.state && (
                                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-teal-200">
                                                                <span className="font-black text-teal-900 uppercase tracking-wide text-xs">
                                                                    State Value:
                                                                </span>
                                                                <div className="font-mono text-xs text-slate-800 mt-2 break-all">
                                                                    {
                                                                        proof
                                                                            .issuerData
                                                                            .state
                                                                            .value
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-cyan-200">
                                                                <span className="font-black text-cyan-900 uppercase tracking-wide text-xs">
                                                                    Claims Root:
                                                                </span>
                                                                <div className="font-mono text-xs text-slate-800 mt-2 break-all">
                                                                    {
                                                                        proof
                                                                            .issuerData
                                                                            .state
                                                                            .claimsTreeRoot
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-cyan-200">
                                                                <span className="font-black text-cyan-900 uppercase tracking-wide text-xs">
                                                                    Revocation
                                                                    Root:
                                                                </span>
                                                                <div className="font-mono text-xs text-slate-800 mt-2 break-all">
                                                                    {
                                                                        proof
                                                                            .issuerData
                                                                            .state
                                                                            .revocationTreeRoot
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-cyan-200">
                                                                <span className="font-black text-cyan-900 uppercase tracking-wide text-xs">
                                                                    Rev Root:
                                                                </span>
                                                                <div className="font-mono text-xs text-slate-800 mt-2 break-all">
                                                                    {
                                                                        proof
                                                                            .issuerData
                                                                            .state
                                                                            .rootOfRoots
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Schema Information */}
                            {selectedCredential.credentialSchema && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                                        Credential Schema
                                    </h3>

                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                                        <InfoField
                                            label="Schema ID"
                                            value={
                                                selectedCredential
                                                    .credentialSchema.id
                                            }
                                            mono
                                        />
                                        <div className="mt-3">
                                            <InfoField
                                                label="Schema Type"
                                                value={
                                                    selectedCredential
                                                        .credentialSchema.type
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Raw JSON */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-slate-600 rounded-full"></div>
                                    W3C Credential Data
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
                                                W3CCredential.json
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    JSON.stringify(
                                                        selectedCredential,
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
                                            selectedCredential,
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 pt-6 border-t-2 border-violet-200 p-6">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative flex-1 group overflow-hidden  rounded-2xl"
                                onClick={() => {
                                    downloadVerifiableCredential();
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 transition-all duration-300 group-hover:scale-105"></div>
                                <div className="relative px-8 py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 text-base">
                                    <Download className="w-5 h-5" />
                                    Download Credential
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function InfoField({
    label,
    value,
    mono = false,
    copyable = false,
}: {
    label: string | "";
    value: string | "";
    mono?: boolean | "";
    copyable?: boolean;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {label}
            </label>
            <div className="flex items-center gap-2">
                <div
                    className={`flex-1 text-sm ${
                        mono
                            ? "font-mono bg-slate-100 px-3 py-2 break-all whitespace-normal"
                            : "font-semibold text-slate-900"
                    }`}
                >
                    {value}
                </div>
                {copyable && (
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
