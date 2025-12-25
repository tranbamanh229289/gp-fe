"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Eye,
    CheckCircle,
    Clock,
    AlertTriangle,
    Plus,
    QrCode,
    TrendingUp,
    Users,
    FileCheck,
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    Zap,
} from "lucide-react";

interface ProofRequest {
    id: number;
    name: string;
    description: string;
    submissions: number;
    verified: number;
    created_at: string;
    status: "active" | "paused";
}

interface Submission {
    id: number;
    holder: string;
    holder_name: string;
    request_name: string;
    status: "pending" | "verified" | "failed";
    timestamp: string;
    data?: any;
}

export default function VerifierDashboard() {
    const [activeTab, setActiveTab] = useState<
        "overview" | "requests" | "submissions"
    >("overview");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ProofRequest | null>(
        null
    );

    const [stats] = useState({
        totalRequests: 12,
        totalSubmissions: 1247,
        verifiedProofs: 1189,
        successRate: 95.3,
    });

    const [proofRequests] = useState<ProofRequest[]>([
        {
            id: 1,
            name: "Age Verification 18+",
            description: "Verify user is 18 years or older",
            submissions: 523,
            verified: 498,
            created_at: "2024-11-15",
            status: "active",
        },
        {
            id: 2,
            name: "KYC Level 2",
            description: "Know Your Customer level 2 verification",
            submissions: 412,
            verified: 401,
            created_at: "2024-11-20",
            status: "active",
        },
        {
            id: 3,
            name: "Accredited Investor",
            description: "Verify accredited investor status",
            submissions: 189,
            verified: 182,
            created_at: "2024-12-01",
            status: "active",
        },
        {
            id: 4,
            name: "Country Verification",
            description: "Verify user country of residence",
            submissions: 123,
            verified: 108,
            created_at: "2024-12-10",
            status: "paused",
        },
    ]);

    const [submissions] = useState<Submission[]>([
        {
            id: 1,
            holder: "0x742d...89A3",
            holder_name: "Alice Johnson",
            request_name: "Age Verification 18+",
            status: "pending",
            timestamp: "2 minutes ago",
        },
        {
            id: 2,
            holder: "0x8B3C...4F2D",
            holder_name: "Bob Smith",
            request_name: "KYC Level 2",
            status: "pending",
            timestamp: "5 minutes ago",
        },
        {
            id: 3,
            holder: "0x1A9F...7E6B",
            holder_name: "Carol White",
            request_name: "Age Verification 18+",
            status: "verified",
            timestamp: "12 minutes ago",
        },
        {
            id: 4,
            holder: "0x5E2C...3D8A",
            holder_name: "David Brown",
            request_name: "Accredited Investor",
            status: "verified",
            timestamp: "1 hour ago",
        },
        {
            id: 5,
            holder: "0x9F4A...7B2E",
            holder_name: "Eve Davis",
            request_name: "KYC Level 2",
            status: "failed",
            timestamp: "2 hours ago",
        },
    ]);

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
            failed: "bg-red-100 text-red-700 border-red-200",
            active: "bg-green-100 text-green-700 border-green-200",
            paused: "bg-gray-100 text-gray-700 border-gray-200",
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Verifier Dashboard
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Zero-Knowledge Proof Verification
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-green-700">
                                    System Active
                                </span>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            label: "Proof Requests",
                            value: stats.totalRequests,
                            icon: FileCheck,
                            color: "blue",
                            change: "+3 this week",
                        },
                        {
                            label: "Total Submissions",
                            value: stats.totalSubmissions.toLocaleString(),
                            icon: Users,
                            color: "purple",
                            change: "+124 today",
                        },
                        {
                            label: "Verified Proofs",
                            value: stats.verifiedProofs.toLocaleString(),
                            icon: CheckCircle,
                            color: "emerald",
                            change: "+98 today",
                        },
                        {
                            label: "Success Rate",
                            value: stats.successRate + "%",
                            icon: TrendingUp,
                            color: "amber",
                            change: "+2.3%",
                        },
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 text-${stat.color}-600`}
                                    />
                                </div>
                                <span className="text-emerald-600 text-sm font-semibold">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                        {[
                            { id: "overview", label: "Overview", icon: Eye },
                            {
                                id: "requests",
                                label: "Proof Requests",
                                icon: FileCheck,
                            },
                            {
                                id: "submissions",
                                label: "Submissions",
                                icon: Clock,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2.5 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "requests" && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Request
                        </motion.button>
                    )}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {/* Overview */}
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">
                                    Recent Verification Activity
                                </h3>
                                <div className="space-y-4">
                                    {submissions.slice(0, 5).map((sub, idx) => (
                                        <motion.div
                                            key={sub.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-12 h-12 rounded-xl ${
                                                        sub.status ===
                                                        "verified"
                                                            ? "bg-emerald-50"
                                                            : sub.status ===
                                                              "pending"
                                                            ? "bg-amber-50"
                                                            : "bg-red-50"
                                                    } flex items-center justify-center`}
                                                >
                                                    {sub.status ===
                                                    "verified" ? (
                                                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                                                    ) : sub.status ===
                                                      "pending" ? (
                                                        <Clock className="w-6 h-6 text-amber-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {sub.holder_name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {sub.request_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">
                                                    {sub.timestamp}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                                        sub.status
                                                    )}`}
                                                >
                                                    {sub.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Performing Requests */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                                        Top Performing Requests
                                    </h3>
                                    <div className="space-y-4">
                                        {proofRequests
                                            .slice(0, 3)
                                            .map((req, idx) => (
                                                <div
                                                    key={req.id}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {req.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {
                                                                    req.submissions
                                                                }{" "}
                                                                submissions
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-emerald-600 font-semibold">
                                                            {Math.round(
                                                                (req.verified /
                                                                    req.submissions) *
                                                                    100
                                                            )}
                                                            %
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            success
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                                    <Zap className="w-12 h-12 mb-4 opacity-80" />
                                    <h3 className="text-2xl font-bold mb-2">
                                        Ready to Verify?
                                    </h3>
                                    <p className="text-blue-100 mb-6">
                                        Create custom proof requests to verify
                                        user credentials with zero-knowledge
                                        proofs.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setActiveTab("requests");
                                            setShowCreateModal(true);
                                        }}
                                        className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        Create Proof Request
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Proof Requests */}
                    {activeTab === "requests" && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {proofRequests.map((request, idx) => (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {request.name}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                                        request.status
                                                    )}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                {request.description}
                                            </p>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreVertical className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-gray-50">
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {request.submissions}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Submissions
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-emerald-600">
                                                {request.verified}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Verified
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {Math.round(
                                                    (request.verified /
                                                        request.submissions) *
                                                        100
                                                )}
                                                %
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Success
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors text-sm">
                                            View Details
                                        </button>
                                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm flex items-center justify-center gap-2">
                                            <QrCode className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            Created{" "}
                                            {new Date(
                                                request.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                        <span>
                                            ID: #
                                            {request.id
                                                .toString()
                                                .padStart(4, "0")}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Submissions */}
                    {activeTab === "submissions" && (
                        <motion.div
                            key="submissions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            All Submissions
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                                                <Filter className="w-4 h-4" />
                                                Filter
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {submissions.map((sub, idx) => (
                                        <motion.div
                                            key={sub.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div
                                                        className={`w-12 h-12 rounded-xl ${
                                                            sub.status ===
                                                            "verified"
                                                                ? "bg-emerald-50"
                                                                : sub.status ===
                                                                  "pending"
                                                                ? "bg-amber-50"
                                                                : "bg-red-50"
                                                        } flex items-center justify-center`}
                                                    >
                                                        {sub.status ===
                                                        "verified" ? (
                                                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                                                        ) : sub.status ===
                                                          "pending" ? (
                                                            <Clock className="w-6 h-6 text-amber-600" />
                                                        ) : (
                                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <div className="font-semibold text-gray-900">
                                                                {
                                                                    sub.holder_name
                                                                }
                                                            </div>
                                                            <div className="font-mono text-xs text-gray-500">
                                                                {sub.holder}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {sub.request_name}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-900 font-medium">
                                                            {sub.timestamp}
                                                        </div>
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                                                sub.status
                                                            )} mt-1`}
                                                        >
                                                            {sub.status}
                                                        </span>
                                                    </div>

                                                    {sub.status ===
                                                        "pending" && (
                                                        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                                                            Verify
                                                        </button>
                                                    )}
                                                    {sub.status !==
                                                        "pending" && (
                                                        <button className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors flex items-center gap-2">
                                                            Details
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={() => setShowCreateModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl"
                    >
                        <div className="p-8 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Create Proof Request
                            </h3>
                            <p className="text-gray-600">
                                Define verification requirements for credential
                                holders
                            </p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Request Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Age Verification 21+"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="Verify user is 21 years or older"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Circuit ID
                                </label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                    <option>credentialAtomicQuerySigV2</option>
                                    <option>credentialAtomicQueryMTPV2</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Query (JSON)
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder='{"credentialSubject": {"birthDate": {"$lt": 20031220}}}'
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all"
                                >
                                    Create Request
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
