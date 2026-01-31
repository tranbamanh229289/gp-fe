"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    FileCheck,
    Calendar,
    CheckCircle2,
    XCircle,
    Shield,
    Timer,
    Building,
    Eye,
    Filter,
    Search,
    AlertCircle,
} from "lucide-react";
import { useCredentialZKProofStore } from "@/store/credential_zkproof.store";
import {
    ProofSubmissionStatus,
    proofSubmissionStatusConfig,
} from "@/constants/credential_zkproof";
import { formatDate, isExpired } from "@/helper/dateTime";
import { ProofSubmission } from "@/types/credential_proof";
import ProofSubmissionDetailModal from "./modal/ProofSubmissionDetailModal";
import { HolderModal } from "@/constants/holder";

interface MyProofSubmissionProp {
    showModal: HolderModal;
    setShowModal: (modal: HolderModal) => void;
}

export default function MyProofSubmissions({
    showModal,
    setShowModal,
}: MyProofSubmissionProp) {
    const [selectedSubmission, setSelectedSubmission] =
        useState<ProofSubmission | null>(null);
    const [selectedProofRequestId, setSelectedProofRequestId] =
        useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const getAllZkProofSubmissions = useCredentialZKProofStore(
        (state) => state.getAllZkProofSubmissions,
    );
    const proofSubmissions = useCredentialZKProofStore(
        (state) => state.proofSubmissions,
    );
    const proofRequests = useCredentialZKProofStore(
        (state) => state.proofRequests,
    );

    useEffect(() => {
        getAllZkProofSubmissions();
    }, []);

    // Get unique proof request IDs from submissions
    const proofRequestOptions = Array.from(
        new Set(proofSubmissions.map((s) => s.requestId)),
    ).map((requestId) => {
        const request = proofRequests.find((r) => r.id === requestId);
        return {
            id: requestId,
            label: request?.message || `Request ${requestId.slice(0, 8)}...`,
        };
    });

    // Filter submissions based on selected proof request and search query
    const filteredSubmissions = useMemo(
        () =>
            proofSubmissions.filter((submission) => {
                // Filter by proof request
                const matchesProofRequest =
                    selectedProofRequestId === "all" ||
                    submission.requestId === selectedProofRequestId;

                // Filter by search query
                const matchesSearch = JSON.stringify(submission)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

                return matchesProofRequest && matchesSearch;
            }),
        [proofSubmissions, selectedProofRequestId, searchQuery],
    );

    return (
        <motion.div
            key="proof-submissions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Proof Submissions
                        </h2>
                        <p className="text-sm text-gray-600">
                            Track status and verification results of all your
                            submissions
                        </p>
                    </div>
                </div>

                {/* Search and Filter by Proof Request */}
                {proofSubmissions.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by message, verifier, circuit ID..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                <select
                                    value={selectedProofRequestId}
                                    onChange={(e) =>
                                        setSelectedProofRequestId(
                                            e.target.value,
                                        )
                                    }
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white font-medium"
                                >
                                    <option value="all">
                                        All Proof Requests
                                    </option>
                                    {proofRequestOptions.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {filteredSubmissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredSubmissions.map((submission, idx) => {
                            const statusConfig =
                                proofSubmissionStatusConfig[submission.status];
                            const StatusIcon = statusConfig.icon;
                            const expired = isExpired(submission.expiresTime);
                            const relatedRequest = proofRequests.find(
                                (r) => r.id === submission.requestId,
                            );

                            return (
                                <motion.div
                                    key={submission.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                            >
                                                <StatusIcon
                                                    className={`w-6 h-6 ${statusConfig.color}`}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">
                                                    {submission.message ||
                                                        "Proof Submission"}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Zero-Knowledge Proof
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-end">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
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
                                        {/* Related Proof Request */}
                                        {relatedRequest && (
                                            <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                                <span className="text-sm text-gray-600 font-medium flex items-center gap-2 mb-1.5">
                                                    <FileCheck className="w-4 h-4 text-purple-600" />
                                                    Related Request:
                                                </span>
                                                <div className="text-sm text-gray-900 font-semibold line-clamp-1">
                                                    {relatedRequest.message ||
                                                        "Proof Request"}
                                                </div>
                                            </div>
                                        )}

                                        {/* Verifier */}
                                        <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2 mb-1.5">
                                                <Building className="w-4 h-4 text-indigo-600" />
                                                Verifier:
                                            </span>
                                            <div className="font-semibold text-gray-900 text-sm mb-1">
                                                {submission.verifierName ||
                                                    "Unknown Verifier"}
                                            </div>
                                            <code className="text-xs font-mono text-gray-500 block truncate">
                                                {submission.verifierDID}
                                            </code>
                                        </div>

                                        {/* Circuit ID */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-blue-600" />
                                                Circuit:
                                            </span>
                                            <code className="text-xs font-mono text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200 truncate max-w-[60%]">
                                                {submission.circuitId}
                                            </code>
                                        </div>

                                        {/* Created & Expires - Same Row */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            {/* Created - Left */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Submitted:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatDate(
                                                        submission.createdTime,
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
                                                        submission.expiresTime,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Verification Status */}
                                        {submission.status ===
                                            ProofSubmissionStatus.Success &&
                                            submission.verifiedDate && (
                                                <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                    <div className="flex items-center gap-2 text-sm text-green-700">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            Verified on{" "}
                                                            {
                                                                submission.verifiedDate
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                        {submission.status ===
                                            ProofSubmissionStatus.Failed && (
                                            <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center gap-2 text-sm text-red-700">
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        Verification failed
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setShowModal(
                                                    HolderModal.ProofSubmissionDetail,
                                                );
                                                setSelectedSubmission(
                                                    submission,
                                                );
                                            }}
                                            className="flex-1 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {proofSubmissions.length === 0
                                ? "No Proof Submissions Yet"
                                : "No Submissions Found"}
                        </h3>
                        <p className="text-gray-600 font-medium">
                            {proofSubmissions.length === 0
                                ? "When you submit proofs to verifiers, they will appear here"
                                : "No submissions match your search criteria"}
                        </p>
                    </div>
                )}
            </div>

            {showModal === HolderModal.ProofSubmissionDetail && (
                <ProofSubmissionDetailModal
                    selectedSubmission={selectedSubmission}
                    onClose={() => {
                        setShowModal(HolderModal.Null);
                        setSelectedSubmission(null);
                    }}
                />
            )}
        </motion.div>
    );
}
