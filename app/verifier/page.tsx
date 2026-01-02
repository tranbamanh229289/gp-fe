"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Eye,
    CheckCircle,
    Clock,
    Plus,
    TrendingUp,
    Users,
    FileCheck,
    Search,
} from "lucide-react";
import { VerifierActiveTab, VerifierModal } from "@/constants/verifier";
import Overview from "@/components/verifier/Overview";
import ProofRequests from "@/components/verifier/ProofRequests";
import Submissions from "@/components/verifier/Submissions";
import CreateProofRequestModal from "@/components/verifier/modal/CreateProofRequestModal";

export default function VerifierDashboard() {
    const [activeTab, setActiveTab] = useState<VerifierActiveTab>(
        VerifierActiveTab.Overview
    );
    const [modal, setModal] = useState<VerifierModal>(VerifierModal.Null);

    const [stats] = useState({
        totalRequests: 12,
        totalSubmissions: 1247,
        verifiedProofs: 1189,
        successRate: 95.3,
    });

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
                            {
                                id: VerifierActiveTab.Overview,
                                label: "Overview",
                                icon: Eye,
                            },
                            {
                                id: VerifierActiveTab.ProofRequests,
                                label: "Proof Requests",
                                icon: FileCheck,
                            },
                            {
                                id: VerifierActiveTab.Submissions,
                                label: "Submissions",
                                icon: Clock,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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

                    {activeTab === VerifierActiveTab.ProofRequests && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() =>
                                setModal(VerifierModal.CreateRequest)
                            }
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
                    {activeTab === VerifierActiveTab.Overview && (
                        <Overview
                            setActiveTab={setActiveTab}
                            setModal={setModal}
                            getStatusBadge={getStatusBadge}
                        />
                    )}
                    {/* Proof Requests */}
                    {activeTab === VerifierActiveTab.ProofRequests && (
                        <ProofRequests getStatusBadge={getStatusBadge} />
                    )}
                    {/* Submissions */}
                    {activeTab === VerifierActiveTab.Submissions && (
                        <Submissions getStatusBadge={getStatusBadge} />
                    )}
                </AnimatePresence>
            </div>

            {/* Create Modal */}
            {modal == VerifierModal.CreateRequest && (
                <CreateProofRequestModal
                    setModal={setModal}
                    getStatusBadge={getStatusBadge}
                />
            )}
        </div>
    );
}
