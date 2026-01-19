import {
    Download,
    Eye,
    X,
    Shield,
    Calendar,
    Check,
    AlertCircle,
    ChevronDown,
    Copy,
    ExternalLink,
    FileText,
    Hash,
    Key,
    Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ProofType, W3CCredential } from "@0xpolygonid/js-sdk";
import { useVerifiableCredential } from "@/store/verifiable_credential.store";
import { HolderModal } from "@/constants/holder";
import { formatDate, formatDateTime } from "@/helper/dateTime";

interface ExpandedRowState {
    [key: string]: boolean;
}

const getProofTypes = (credential: any): string[] => {
    if (!credential.proof) return [];
    const proofs = Array.isArray(credential.proof)
        ? credential.proof
        : [credential.proof];
    return proofs.map((p: any) => p.type);
};

const getCredentialStatus = (credential: any): string => {
    if (!credential.proof) return "pending";
    const proofs = Array.isArray(credential.proof)
        ? credential.proof
        : [credential.proof];
    const hasIssued = proofs.some(
        (p: any) => p.issuerData?.credentialStatus === "issued",
    );
    return hasIssued ? "active" : "pending";
};

interface MyVerifiableCredential {
    showModal: HolderModal;
    setShowModal: (modal: HolderModal) => void;
}

export default function MyVerifiableCredential({
    showModal,
    setShowModal,
}: MyVerifiableCredential) {
    const [expandedRows, setExpandedRows] = useState<ExpandedRowState>({});
    const [selectedCredential, setSelectedCredential] = useState<W3CCredential>(
        {},
    );

    const verifiableCredentials = useVerifiableCredential(
        (state) => state.verifiableCredentials,
    );

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getAllVerifiableCredentials = useVerifiableCredential(
        (state) => state.getAllVerifiableCredentials,
    );

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

    useEffect(() => {
        getAllVerifiableCredentials();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    My Credential Requests
                </h2>
                <p className="text-sm text-gray-600">
                    Track and manage your credential requests
                </p>
            </div>

            {/* Credentials Table with glassmorphism */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
            >
                <div className="group bg-white rounded-2xl transition-all duration-200 overflow-hidden border-2 border-violet-200">
                    {verifiableCredentials.length > 0 && (
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Schema type
                                        </div>
                                    </th>

                                    <th className="text-left px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="text-left px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        Proof
                                    </th>
                                    <th className="text-left px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Issued
                                        </div>
                                    </th>
                                    <th className="text-left px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Expiration
                                        </div>
                                    </th>
                                    <th className="text-left px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-right px-6 py-5 text-xs font-black text-violet-900 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-violet-100/50">
                                {verifiableCredentials.map((vc, index) => {
                                    const proofTypes = getProofTypes(vc);
                                    const status = getCredentialStatus(vc);

                                    return (
                                        <motion.tr
                                            key={vc.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: index * 0.05,
                                            }}
                                            className="hover:bg-gradient-to-r hover:from-violet-50/50 hover:via-fuchsia-50/50 hover:to-pink-50/50 transition-all duration-300 group"
                                        >
                                            <td className="px-6 py-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-sm font-bold text-slate-900 bg-gradient-to-r from-violet-100 to-fuchsia-100 px-3 py-1.5 rounded-lg border border-violet-200">
                                                            {vc.type[1]}
                                                        </code>
                                                        <a
                                                            href={
                                                                vc[
                                                                    "@context"
                                                                ][2]
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors group"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                        </a>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            toggleRow(vc.id)
                                                        }
                                                        className="flex items-center gap-1 text-xs text-violet-600 hover:text-fuchsia-600 font-bold transition-colors"
                                                    ></button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 flex items-center justify-center`}
                                                    >
                                                        <Shield className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-violet-600 font-semibold">
                                                            W3C Verified
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {proofTypes.map(
                                                        (proofType, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-md ${
                                                                    proofType.includes(
                                                                        ProofType.BJJSignature,
                                                                    )
                                                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                                                        : "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white"
                                                                }`}
                                                            >
                                                                {proofType.includes(
                                                                    ProofType.BJJSignature,
                                                                ) ? (
                                                                    <Key className="w-3 h-3" />
                                                                ) : (
                                                                    <Hash className="w-3 h-3" />
                                                                )}
                                                                {proofType.includes(
                                                                    ProofType.BJJSignature,
                                                                )
                                                                    ? "Signature"
                                                                    : "MTP"}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {formatDateTime(
                                                            vc.issuanceDate as string,
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {formatDateTime(
                                                            vc.expirationDate as string,
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span
                                                    className={`px-4 py-2 rounded-full text-xs font-black shadow-lg inline-flex items-center gap-2 ${
                                                        status === "active"
                                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                                            : status ===
                                                              "revoked"
                                                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                                            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                                    }`}
                                                >
                                                    {status === "active" && (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    {status === "revoked" && (
                                                        <X className="w-4 h-4" />
                                                    )}
                                                    {status === "pending" && (
                                                        <AlertCircle className="w-4 h-4" />
                                                    )}
                                                    {status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                            rotate: 5,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() => {
                                                            setSelectedCredential(
                                                                vc,
                                                            );
                                                            setShowModal(
                                                                HolderModal.VerifiableCredentialDetail,
                                                            );
                                                        }}
                                                        className="p-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white transition-all shadow-lg hover:shadow-xl"
                                                        title="View details"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                            rotate: 5,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        className="p-2.5 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl text-white transition-all shadow-lg hover:shadow-xl"
                                                        title="Download"
                                                        onClick={() => {
                                                            setSelectedCredential(
                                                                vc,
                                                            );
                                                            downloadVerifiableCredential();
                                                        }}
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Empty State */}
                {verifiableCredentials.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                            <Shield className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No verifiable credential yet
                        </h3>
                        <p className="text-slate-600">
                            Your verifiable credential will appear here
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Credential Detail Modal */}
            <AnimatePresence>
                {showModal == HolderModal.VerifiableCredentialDetail && (
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
                                                W3C Verifiable Credential
                                                Standard
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowModal(HolderModal.Null)
                                        }
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
                                                value={
                                                    selectedCredential.type[1]
                                                }
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
                                                    selectedCredential
                                                        .credentialSubject
                                                        .id as string
                                                }
                                                mono
                                                copyable
                                            />
                                            <InfoField
                                                label="Issuer DID"
                                                value={
                                                    selectedCredential.issuer
                                                }
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
                                                                    key !==
                                                                        "id" &&
                                                                    key !==
                                                                        "type",
                                                            )
                                                            .map(
                                                                (
                                                                    [
                                                                        key,
                                                                        value,
                                                                    ],
                                                                    idx,
                                                                ) => (
                                                                    <motion.div
                                                                        key={
                                                                            key
                                                                        }
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
                                                                            {
                                                                                key
                                                                            }
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
                                                ).map(
                                                    (
                                                        proof: any,
                                                        idx: number,
                                                    ) => (
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
                                                                delay:
                                                                    0.4 +
                                                                    idx * 0.1,
                                                            }}
                                                            className="relative group"
                                                        >
                                                            <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 border border-emerald-200/50">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <span
                                                                        className={`px-4 py-2 rounded-xl text-sm font-black shadow-lg ${
                                                                            proof.type.includes(
                                                                                ProofType.BJJSignature,
                                                                            )
                                                                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                                                                                : "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            proof.type
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

                                                                {proof
                                                                    .issuerData
                                                                    ?.state && (
                                                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-teal-200">
                                                                            <span className="font-black text-teal-900 uppercase tracking-wide text-xs">
                                                                                State
                                                                                Value:
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
                                                                                Claims
                                                                                Root:
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
                                                                                Rev
                                                                                Root:
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
                                                    ),
                                                )}
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
                                                                .credentialSchema
                                                                .type
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Context URLs */}
                                    {selectedCredential["@context"] && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                <div className="w-1 h-6 bg-cyan-600 rounded-full"></div>
                                                JSON-LD Context
                                            </h3>

                                            <div className="space-y-2">
                                                {(Array.isArray(
                                                    selectedCredential[
                                                        "@context"
                                                    ],
                                                )
                                                    ? selectedCredential[
                                                          "@context"
                                                      ]
                                                    : [
                                                          selectedCredential[
                                                              "@context"
                                                          ],
                                                      ]
                                                ).map(
                                                    (
                                                        ctx: string,
                                                        idx: number,
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 bg-cyan-50 p-3 rounded-lg border border-cyan-200"
                                                        >
                                                            <FileText className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                                                            <code className="text-xs font-mono text-slate-800 break-all flex-1">
                                                                {ctx}
                                                            </code>
                                                            <a
                                                                href={ctx}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-cyan-600 hover:text-cyan-700"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Raw JSON */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-slate-600 rounded-full"></div>
                                            Raw Credential (JSON)
                                        </h3>

                                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 overflow-x-auto">
                                            <pre className="text-xs text-green-400 font-mono">
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
                )}
            </AnimatePresence>
        </div>
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
