import {
    CredentialRequestStatus,
    credentialStatusConfig,
} from "@/constants/credential_request";
import { credentialTypeConfig, IssuerModal } from "@/constants/issuer";
import { useCredentialRequestStore } from "@/store/credential_request.store";
import { CredentialRequest } from "@/types/credential_request";
import { motion } from "framer-motion";
import {
    CheckCircle,
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { ReviewCredentialRequestModal } from "./modal/IssueVerifiableCredentialModal";
import { RejectCredentialRequestModal } from "./modal/RejectCredentialRequestModal";

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
    const [selectedCredentialRequest, setSelectedCredentialRequest] =
        useState<CredentialRequest | null>(null);
    const [filterStatus, setFilterStatus] = useState<
        CredentialRequestStatus | "all"
    >("all");
    const filteredRequests = credentialRequests.filter((req) => {
        const matchesSearch =
            req.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.schemaTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "all" || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (date: number) => {
        return new Date(date * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (duration: number) => {
        return new Date(duration * 1000).getDate();
    };

    const isExpired = (expiresTime: number) => {
        const nowInSeconds = () => Math.floor(Date.now() / 1000);
        return expiresTime < nowInSeconds();
    };

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
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by holder name or schema..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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

                {/* Requests List */}
                <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                No Requests Found
                            </h3>
                            <p className="text-sm text-gray-600">
                                {searchTerm || filterStatus !== "all"
                                    ? "Try adjusting your filters"
                                    : "Credential requests will appear here"}
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
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{
                                        y: -2,
                                        boxShadow:
                                            "0 12px 24px -8px rgba(0,0,0,0.12)",
                                    }}
                                    className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        {/* Top Row: Icon, Title, Status */}
                                        <div className="flex items-start gap-5 mb-5">
                                            {/* Icon */}
                                            <div
                                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
                                            >
                                                <config.icon className="w-7 h-7 text-white" />
                                            </div>

                                            {/* Title & Badges */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {config.label}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${statusConfig.color} flex items-center gap-1.5`}
                                                    >
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {request.status}
                                                    </span>

                                                    {expired && (
                                                        <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-lg font-bold border border-rose-300">
                                                            Expired
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Holder Info */}
                                                <div className="flex items-center gap-2 text-sm flex-wrap">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span className="font-semibold text-gray-700">
                                                        {request.holderName}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        •
                                                    </span>
                                                    <code className="text-xs font-mono text-slate-500 max-w-md">
                                                        {request.issuerDID}
                                                    </code>
                                                </div>
                                            </div>

                                            {/* Actions - Desktop */}
                                            {request.status ===
                                                CredentialRequestStatus.Pending && (
                                                <div className=" flex flex gap-2 flex-shrink-0">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() => {
                                                            setSelectedCredentialRequest(
                                                                request,
                                                            );
                                                            setShowModal(
                                                                IssuerModal.ReviewCredentialRequest,
                                                            );
                                                        }}
                                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                        Review
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() => {
                                                            setSelectedCredentialRequest(
                                                                request,
                                                            );
                                                            setShowModal(
                                                                IssuerModal.RejectCredentialRequest,
                                                            );
                                                        }}
                                                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Reject
                                                    </motion.button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Schema Info */}
                                        <div className="mb-5 p-4 rounded-xl bg-purple-50 border border-purple-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                                                    Schema
                                                </span>
                                                <a
                                                    href={request.schemaURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors group"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    View Details
                                                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </a>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sx font-semibold text-slate-900 mb-1">
                                                    {request.schemaTitle}
                                                </p>
                                                <code className="text-sx font-mono text-purple-700 bg-white px-2 py-1 rounded border border-purple-300 inline-block">
                                                    {request.schemaType}
                                                </code>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Created */}
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                                                        Created
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {formatDate(
                                                        request.createdTime,
                                                    )}
                                                </p>
                                            </div>

                                            {/* Expires */}
                                            <div
                                                className={`p-3 rounded-xl border ${
                                                    expired
                                                        ? "bg-rose-50 border-rose-200"
                                                        : "bg-slate-50 border-slate-200"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Timer className="w-4 h-4 text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                                                        Expires
                                                    </span>
                                                </div>
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        expired
                                                            ? "text-rose-700"
                                                            : "text-slate-900"
                                                    }`}
                                                >
                                                    {formatDate(
                                                        request.expiresTime,
                                                    )}
                                                </p>
                                            </div>

                                            {/* Validity */}
                                            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                        Validity
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {formatDuration(
                                                        request.expiration,
                                                    )}{" "}
                                                    days
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
