import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    FileText,
    Calendar,
    Search,
    Filter,
    ChevronDown,
    AlertCircle,
    Eye,
    Sparkles,
    Mail,
} from "lucide-react";
import { useState } from "react";

// Types
enum RequestStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
}

interface CredentialRequest {
    id: string;
    holderDID: string;
    holderName: string;
    schemaId: string;
    schemaTitle: string;
    schemaType: string;
    requestedAt: string;
    status: RequestStatus;
    notes?: string;
}

const mockRequests: CredentialRequest[] = [
    {
        id: "req-001",
        holderDID: "did:polygonid:polygon:mumbai:2qH7...",
        holderName: "Nguyen Van A",
        schemaId: "schema-001",
        schemaTitle: "Citizen Identity Card",
        schemaType: "identity",
        requestedAt: "2025-01-02T10:30:00Z",
        status: RequestStatus.Pending,
    },
    {
        id: "req-002",
        holderDID: "did:polygonid:polygon:mumbai:3qH8...",
        holderName: "Tran Thi B",
        schemaId: "schema-002",
        schemaTitle: "University Degree",
        schemaType: "certificate",
        requestedAt: "2025-01-01T14:20:00Z",
        status: RequestStatus.Approved,
    },
    {
        id: "req-003",
        holderDID: "did:polygonid:polygon:mumbai:4qH9...",
        holderName: "Le Van C",
        schemaId: "schema-003",
        schemaTitle: "Driver License",
        schemaType: "license",
        requestedAt: "2024-12-30T09:15:00Z",
        status: RequestStatus.Rejected,
        notes: "Missing required documents",
    },
];

const statusConfig = {
    [RequestStatus.Pending]: {
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        gradient: "from-yellow-400 to-orange-500",
        lightGradient: "from-amber-50 to-orange-50",
    },
    [RequestStatus.Approved]: {
        label: "Approved",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        gradient: "from-green-400 to-emerald-500",
        lightGradient: "from-emerald-50 to-teal-50",
    },
    [RequestStatus.Rejected]: {
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        gradient: "from-red-400 to-rose-500",
        lightGradient: "from-rose-50 to-pink-50",
    },
};

export default function CredentialRequestsTab() {
    const [requests, setRequests] = useState<CredentialRequest[]>(mockRequests);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">(
        "all"
    );
    const [selectedRequest, setSelectedRequest] =
        useState<CredentialRequest | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const filteredRequests = requests.filter((req) => {
        const matchesSearch =
            req.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.schemaTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "all" || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleApprove = (requestId: string) => {
        setRequests(
            requests.map((req) =>
                req.id === requestId
                    ? { ...req, status: RequestStatus.Approved }
                    : req
            )
        );
        setShowDetailModal(false);
    };

    const handleReject = (requestId: string, reason: string) => {
        setRequests(
            requests.map((req) =>
                req.id === requestId
                    ? { ...req, status: RequestStatus.Rejected, notes: reason }
                    : req
            )
        );
        setShowRejectModal(false);
        setShowDetailModal(false);
        setRejectReason("");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusCounts = () => {
        return {
            all: requests.length,
            pending: requests.filter((r) => r.status === RequestStatus.Pending)
                .length,
            approved: requests.filter(
                (r) => r.status === RequestStatus.Approved
            ).length,
            rejected: requests.filter(
                (r) => r.status === RequestStatus.Rejected
            ).length,
        };
    };

    const statusCounts = getStatusCounts();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Credential Request
                        </h2>
                        <p className="text-gray-600">
                            Review credential and issue credential
                        </p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by holder name, email, or schema..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 focus:border-purple-400 outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(
                                        e.target.value as RequestStatus | "all"
                                    )
                                }
                                className="w-full pl-12 pr-10 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 focus:border-purple-400 outline-none transition-all appearance-none bg-white font-medium"
                            >
                                <option value="all">All Status</option>
                                <option value={RequestStatus.Pending}>
                                    Pending
                                </option>
                                <option value={RequestStatus.Approved}>
                                    Approved
                                </option>
                                <option value={RequestStatus.Rejected}>
                                    Rejected
                                </option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-16 text-center shadow-lg border-2 border-dashed border-gray-200"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
                                <AlertCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No requests found
                            </h3>
                            <p className="text-gray-600 text-lg">
                                {searchTerm || filterStatus !== "all"
                                    ? "Try adjusting your filters to see more results"
                                    : "Credential requests from holders will appear here"}
                            </p>
                        </motion.div>
                    ) : (
                        filteredRequests.map((request, index) => {
                            const config = statusConfig[request.status];
                            const StatusIcon = config.icon;

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-purple-200 transition-all duration-300"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left: Status Icon */}
                                        <div
                                            className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${config.lightGradient} border-2 ${config.border} flex items-center justify-center shadow-sm`}
                                        >
                                            <StatusIcon
                                                className={`w-8 h-8 ${config.color}`}
                                            />
                                        </div>

                                        {/* Middle: Content */}
                                        <div className="flex-1 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                <div className="flex-1 min-w-[200px]">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {
                                                                request.schemaTitle
                                                            }
                                                        </h3>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}
                                                        >
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <User className="w-4 h-4" />
                                                            <span className="font-medium">
                                                                {
                                                                    request.holderName
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                {formatDate(
                                                                    request.requestedAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-wrap gap-3">
                                                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                                                    <span className="text-xs font-mono text-purple-900">
                                                        {request.holderDID.substring(
                                                            0,
                                                            50
                                                        )}
                                                        ...
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Notes (if rejected) */}
                                            {request.notes && (
                                                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200">
                                                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="text-xs font-bold text-rose-900 mb-1">
                                                            Rejection Reason
                                                        </div>
                                                        <p className="text-sm text-rose-700 font-medium">
                                                            {request.notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex lg:flex-col gap-3 flex-shrink-0">
                                            {request.status ===
                                                RequestStatus.Pending && (
                                                <>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() =>
                                                            handleApprove(
                                                                request.id
                                                            )
                                                        }
                                                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Approve</span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() => {
                                                            setSelectedRequest(
                                                                request
                                                            );
                                                            setShowRejectModal(
                                                                true
                                                            );
                                                        }}
                                                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        <span>Reject</span>
                                                    </motion.button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </motion.div>

            {/* Reject Modal */}
            <AnimatePresence>
                {showRejectModal && selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowRejectModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 bg-gradient-to-r from-red-500 to-rose-600">
                                <h2 className="text-2xl font-bold text-white">
                                    Reject Request
                                </h2>
                                <p className="text-white/90 mt-1">
                                    Please provide a reason for rejection
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rejection Reason{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) =>
                                            setRejectReason(e.target.value)
                                        }
                                        placeholder="e.g., Missing required documents, Invalid information..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-red-500 focus:ring-opacity-20 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setRejectReason("");
                                        }}
                                        className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{
                                            scale: rejectReason.trim()
                                                ? 1.02
                                                : 1,
                                        }}
                                        whileTap={{
                                            scale: rejectReason.trim()
                                                ? 0.98
                                                : 1,
                                        }}
                                        onClick={() => {
                                            if (rejectReason.trim()) {
                                                handleReject(
                                                    selectedRequest.id,
                                                    rejectReason
                                                );
                                            }
                                        }}
                                        disabled={!rejectReason.trim()}
                                        className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                                            rejectReason.trim()
                                                ? "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg"
                                                : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                    >
                                        Confirm Rejection
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
