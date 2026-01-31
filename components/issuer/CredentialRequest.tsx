import {
    CredentialRequestStatus,
    credentialStatusConfig,
} from "@/constants/credential_request";
import { credentialTypeConfig, IssuerModal } from "@/constants/issuer";
import { useCredentialRequestStore } from "@/store/credential_request.store";
import { CredentialRequest } from "@/types/credential_request";
import { motion } from "framer-motion";
import {
    XCircle,
    User,
    Calendar,
    Search,
    Filter,
    ChevronDown,
    AlertCircle,
    Clock,
    ExternalLink,
    Timer,
    EyeIcon,
    FileText,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ReviewCredentialRequestModal } from "./modal/IssueVerifiableCredentialModal";
import { RejectCredentialRequestModal } from "./modal/RejectCredentialRequestModal";
import { formatDate, isExpired } from "@/helper/dateTime";

interface CredentialsRequestsProp {
    showModal: IssuerModal;
    setShowModal: (modal: IssuerModal) => void;
}
export default function CredentialRequests({
    showModal,
    setShowModal,
}: CredentialsRequestsProp) {
    const getCredentialRequests = useCredentialRequestStore(
        (state) => state.getCredentialRequests,
    );

    const credentialRequests = useCredentialRequestStore(
        (state) => state.credentialRequests,
    );
    const updateCredentialRequest = useCredentialRequestStore(
        (state) => state.updateCredentialRequest,
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<
        CredentialRequestStatus | "all"
    >("all");

    const [selectedCredentialRequest, setSelectedCredentialRequest] =
        useState<CredentialRequest | null>(null);

    const filteredRequests = useMemo(() => {
        return credentialRequests.filter((req) => {
            const matchesSearch =
                req.holderName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                req.schemaTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterStatus === "all" || req.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [credentialRequests, searchTerm, filterStatus]);

    const handleReject = async () => {
        try {
            await updateCredentialRequest(
                selectedCredentialRequest?.id ?? "",
                CredentialRequestStatus.Rejected,
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getCredentialRequests();
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
                            Credential Request Management
                        </h2>
                        <p className="text-gray-600">
                            View and manage credential schemas
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
                                            | CredentialRequestStatus
                                            | "all",
                                    )
                                }
                                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-medium"
                            >
                                <option value="all">All Status</option>
                                <option value={CredentialRequestStatus.Pending}>
                                    Pending
                                </option>
                                <option
                                    value={CredentialRequestStatus.Approved}
                                >
                                    Approved
                                </option>
                                <option
                                    value={CredentialRequestStatus.Rejected}
                                >
                                    Rejected
                                </option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                No Requests Found
                            </h3>
                            <p className="text-sm text-gray-600">
                                {searchTerm || filterStatus !== "all"
                                    ? "Try adjusting your filters to see more results"
                                    : "Credential requests will appear here when submitted"}
                            </p>
                        </motion.div>
                    ) : (
                        filteredRequests.map((request, index) => {
                            const config =
                                credentialTypeConfig[request.documentType];
                            const expired = isExpired(request.expiresTime);
                            let statusConfig =
                                credentialStatusConfig[request.status];

                            if (
                                expired &&
                                request.status ===
                                    CredentialRequestStatus.Pending
                            ) {
                                statusConfig =
                                    credentialStatusConfig[
                                        CredentialRequestStatus.Expired
                                    ];
                            }

                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                            >
                                                <config.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {request.holderName}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {config.label}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${statusConfig.color}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {request.status}
                                            </span>
                                            {expired && (
                                                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-bold border border-rose-300">
                                                    Expired
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Fields */}
                                    <div className="space-y-2 mb-4">
                                        {/* Schema */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-purple-600" />
                                                Schema:
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                                                    {request.schemaType}
                                                </code>

                                                <a
                                                    href={request.schemaURL}
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
                                        {/* Valid Until */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                Valid Until:
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900 text-right">
                                                {formatDate(request.expiration)}
                                            </span>
                                        </div>

                                        {/* Created & Expires - Same Row */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            {/* Created - Left */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Created:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatDate(
                                                        request.createdTime,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Expires - Right */}
                                            <div className="flex items-center gap-2">
                                                <Timer
                                                    className={`w-4 h-4 ${
                                                        expired
                                                            ? "text-rose-600"
                                                            : "text-amber-600"
                                                    }`}
                                                />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Expires:
                                                </span>
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        expired
                                                            ? "text-rose-700"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {formatDate(
                                                        request.expiresTime,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {request.status ===
                                        CredentialRequestStatus.Pending &&
                                        !expired && (
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setSelectedCredentialRequest(
                                                            request,
                                                        );
                                                        setShowModal(
                                                            IssuerModal.ReviewCredentialRequest,
                                                        );
                                                    }}
                                                    className="flex-1 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    Review
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setSelectedCredentialRequest(
                                                            request,
                                                        );
                                                        setShowModal(
                                                            IssuerModal.RejectCredentialRequest,
                                                        );
                                                    }}
                                                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        )}
                                </motion.div>
                            );
                        })
                    )}
                </div>
                {showModal === IssuerModal.ReviewCredentialRequest && (
                    <ReviewCredentialRequestModal
                        request={selectedCredentialRequest as CredentialRequest}
                        onClose={() => {
                            setSelectedCredentialRequest(null);
                            setShowModal(IssuerModal.Null);
                        }}
                    />
                )}

                {showModal === IssuerModal.RejectCredentialRequest && (
                    <RejectCredentialRequestModal
                        onClose={() => {
                            setSelectedCredentialRequest(null);
                            setShowModal(IssuerModal.Null);
                        }}
                        onConfirm={handleReject}
                    />
                )}
            </motion.div>
        </div>
    );
}
