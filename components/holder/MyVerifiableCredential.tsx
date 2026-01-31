import {
    Download,
    Eye,
    Shield,
    Calendar,
    ExternalLink,
    FileText,
    Clock,
    AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ProofType, W3CCredential } from "@0xpolygonid/js-sdk";
import { useVerifiableCredential } from "@/store/verifiable_credential.store";
import { HolderModal } from "@/constants/holder";
import { formatDateTime } from "@/helper/dateTime";
import { proofTypeConfig } from "@/constants/credential_zkproof";
import VerifiableCredentialDetail from "./modal/VerifiableCredentialDetailModal";
import {
    VerifiableCredentialStatus,
    verifiableCredentialStatusConfig,
} from "@/constants/verifiable_credential";

interface ExpandedRowState {
    [key: string]: boolean;
}

const proofTypes = [
    ProofType.BJJSignature,
    ProofType.Iden3SparseMerkleTreeProof,
];

interface MyVerifiableCredential {
    showModal: HolderModal;
    setShowModal: (modal: HolderModal) => void;
}

export default function MyVerifiableCredential({
    showModal,
    setShowModal,
}: MyVerifiableCredential) {
    const [expandedRows, setExpandedRows] = useState<ExpandedRowState>({});
    const [selectedCredential, setSelectedCredential] =
        useState<W3CCredential | null>(null);

    const verifiableCredentials = useVerifiableCredential(
        (state) => state.verifiableCredentials,
    );

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const downloadVerifiableCredential = () => {
        const blob = new Blob([JSON.stringify(selectedCredential, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `verifiable-credential-${selectedCredential?.id?.slice(
            -8,
        )}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getAllVerifiableCredentials = useVerifiableCredential(
        (state) => state.getAllVerifiableCredentials,
    );

    useEffect(() => {
        getAllVerifiableCredentials();
    }, []);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        My Verifiable Credentials
                    </h2>
                    <p className="text-sm text-gray-600">
                        Track and manage your verifiable credentials
                    </p>
                </div>

                {/* Credentials Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {verifiableCredentials.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                No Verifiable Credentials Found
                            </h3>
                            <p className="text-gray-600 font-medium">
                                Issued credentials will appear here
                            </p>
                        </motion.div>
                    ) : (
                        verifiableCredentials.map((vc, index) => {
                            return (
                                <motion.div
                                    key={vc.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {vc.type[1]}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    W3C Verified Credential
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                verifiableCredentialStatusConfig[
                                                    VerifiableCredentialStatus
                                                        .Issued
                                                ].color
                                            }`}
                                        >
                                            {VerifiableCredentialStatus.Issued}
                                        </span>
                                    </div>

                                    {/* Info Fields */}
                                    <div className="space-y-2 mb-4">
                                        {/* Credential ID */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium">
                                                ID:
                                            </span>
                                            <code className="text-xs font-mono text-gray-900 text-right max-w-[60%] truncate">
                                                {vc.id}
                                            </code>
                                        </div>

                                        {/* Schema */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-purple-600" />
                                                Schema:
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                                                    {vc.credentialSchema
                                                        ?.type ||
                                                        "JsonSchema2023"}
                                                </code>

                                                <a
                                                    href={vc["@context"][2]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-purple-600 hover:text-purple-800"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Proof Methods */}
                                        <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium mb-2 block">
                                                Proof Methods:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {proofTypes.map(
                                                    (proofType, idx) => {
                                                        const Icon =
                                                            proofTypeConfig[
                                                                proofType
                                                            ].icon;
                                                        return (
                                                            <span
                                                                key={idx}
                                                                className={`px-2 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${proofTypeConfig[proofType].color}`}
                                                            >
                                                                <Icon className="w-3 h-3" />
                                                                {
                                                                    proofTypeConfig[
                                                                        proofType
                                                                    ].label
                                                                }
                                                            </span>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>

                                        {/* Issued & Expires - Same Row */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                            {/* Issued - Left */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Issued:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatDateTime(
                                                        vc.issuanceDate as string,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Expires - Right */}
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-600" />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Expires:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatDateTime(
                                                        vc.expirationDate as string,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedCredential(vc);
                                                setShowModal(
                                                    HolderModal.VerifiableCredentialDetail,
                                                );
                                            }}
                                            className="flex-1 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedCredential(vc);
                                                downloadVerifiableCredential();
                                            }}
                                            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
            {showModal == HolderModal.VerifiableCredentialDetail && (
                <VerifiableCredentialDetail
                    selectedCredential={selectedCredential as W3CCredential}
                    onClose={() => {
                        setShowModal(HolderModal.Null);
                        setSelectedCredential(null);
                    }}
                />
            )}
        </>
    );
}
