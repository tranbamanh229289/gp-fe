import {
    Download,
    Eye,
    X,
    Shield,
    Calendar,
    Check,
    AlertCircle,
    ExternalLink,
    Clock,
    FileText,
    Search,
    Filter,
    ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ProofType, W3CCredential } from "@0xpolygonid/js-sdk";
import { useVerifiableCredential } from "@/store/verifiable_credential.store";
import { IssuerModal } from "@/constants/issuer";
import { formatDate, formatDateTime } from "@/helper/dateTime";
import { proofTypeConfig } from "@/constants/credential_zkproof";
import VerifiableCredentialDetail from "./modal/VerifiableCredentialDetailModal";
import {
    VerifiableCredentialStatus,
    verifiableCredentialStatusConfig,
} from "@/constants/verifiable_credential";

const proofTypes = [
    ProofType.BJJSignature,
    ProofType.Iden3SparseMerkleTreeProof,
];

interface VerifiableCredentialProp {
    showModal: IssuerModal;
    setShowModal: (modal: IssuerModal) => void;
}

export default function VerifiableCredential({
    showModal,
    setShowModal,
}: VerifiableCredentialProp) {
    const [selectedCredential, setSelectedCredential] =
        useState<W3CCredential | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<
        VerifiableCredentialStatus | "all"
    >("all");

    const verifiableCredentials = useVerifiableCredential(
        (state) => state.verifiableCredentials,
    );

    const getAllVerifiableCredentials = useVerifiableCredential(
        (state) => state.getAllVerifiableCredentials,
    );

    const filterCredentials = useMemo(() => {
        return verifiableCredentials.filter((cred) => {
            const matchesSearch = JSON.stringify(cred)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === "all" ||
                VerifiableCredentialStatus.Issued === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [filterStatus, verifiableCredentials, searchTerm]);

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

    useEffect(() => {
        getAllVerifiableCredentials();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Verifiable Credentials
                        </h2>
                        <p className="text-gray-600">
                            View and manage issued credentials
                        </p>
                    </div>
                </div>
                {/* Search & Filter Bar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by holder name or schema..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(
                                        e.target.value as
                                            | VerifiableCredentialStatus
                                            | "all",
                                    )
                                }
                                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-medium"
                            >
                                <option value="all">All Status</option>
                                <option
                                    value={VerifiableCredentialStatus.Issued}
                                >
                                    Issued
                                </option>
                                <option
                                    value={VerifiableCredentialStatus.Revoked}
                                >
                                    Revoked
                                </option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>
                {/* Credentials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterCredentials.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                No Credentials Found
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                                Issued credentials will appear here
                            </p>
                        </motion.div>
                    ) : (
                        filterCredentials.map((vc, index) => {
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
                                                    IssuerModal.VerifiableCredentialDetail,
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
            </motion.div>

            {/* Credential Detail Modal */}
            {showModal === IssuerModal.VerifiableCredentialDetail && (
                <VerifiableCredentialDetail
                    selectedCredential={selectedCredential as W3CCredential}
                    onClose={() => {
                        setShowModal(IssuerModal.Null);
                        setSelectedCredential(null);
                    }}
                />
            )}
        </div>
    );
}
