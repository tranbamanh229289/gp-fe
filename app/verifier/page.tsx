"use client";

import { useEffect, useRef, useState } from "react";
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
    LogOut,
    Check,
    Copy,
    Fingerprint,
    ChevronDown,
} from "lucide-react";
import { VerifierActiveTab, VerifierModal } from "@/constants/verifier";

import ProofRequests from "@/components/verifier/ProofRequests";
import Submissions from "@/components/verifier/Submissions";
import CreateProofRequestModal from "@/components/verifier/modal/CreateProofRequestModal";
import { useIdentityStore } from "@/store/identity.store";
import { useRouter } from "next/navigation";

export default function VerifierDashboard() {
    const [activeTab, setActiveTab] = useState<VerifierActiveTab>(
        VerifierActiveTab.ProofRequests
    );
    const [modal, setModal] = useState<VerifierModal>(VerifierModal.Null);
    const router = useRouter();
    const [stats] = useState({
        totalRequests: 0,
        totalSubmissions: 0,
        verifiedProofs: 0,
        successRate: 0,
    });
    const [didCopied, setDIDCopied] = useState<boolean>(false);
    const [stateCopied, setStateCopied] = useState<boolean>(false);
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setStateCopied(false);
        setDIDCopied(false);
        if (type === "did") setDIDCopied(true);
        if (type === "state") setStateCopied(true);
    };

    const identity = useIdentityStore((state) => state.identity);
    const logout = useIdentityStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/auth");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 lg:px-8 py-6">
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

                        {/* Profile Menu */}
                        <div className="relative" ref={profileMenuRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                    setShowProfileMenu(!showProfileMenu)
                                }
                                className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {identity?.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </span>
                                </div>

                                {/* User Info */}
                                <div className="text-left hidden sm:block">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {identity?.name}
                                    </div>
                                </div>

                                {/* Dropdown Icon */}
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-500 transition-transform ${
                                        showProfileMenu ? "rotate-180" : ""
                                    }`}
                                />
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50"
                                    >
                                        {/* User Info in Dropdown */}
                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {identity?.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-gray-900 truncate">
                                                        {identity?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Holder Account
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DID Section */}
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                                                        <span className="text-xs font-semibold text-gray-700">
                                                            DID
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white rounded-lg p-2 border border-gray-200">
                                                        <code className="text-xs text-gray-900 font-mono flex-1 truncate">
                                                            {identity?.did}
                                                        </code>
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    identity?.did as string,
                                                                    "did"
                                                                )
                                                            }
                                                            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                        >
                                                            {didCopied ? (
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5 text-gray-600" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* State Hash Section */}
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                                                        <span className="text-xs font-semibold text-gray-700">
                                                            State Hash
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white rounded-lg p-2 border border-gray-200">
                                                        <code className="text-xs text-gray-900 font-mono flex-1 truncate">
                                                            {identity?.state}
                                                        </code>
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    identity?.state as string,
                                                                    "state"
                                                                )
                                                            }
                                                            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                        >
                                                            {stateCopied ? (
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5 text-gray-600" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                                    <LogOut className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-red-600">
                                                        Logout
                                                    </div>
                                                    <div className="text-xs text-red-500">
                                                        Sign out of your account
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className={`w-11 h-11 rounded-lg bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}
                                >
                                    <stat.icon
                                        className={`w-5 h-5 text-${stat.color}-600`}
                                    />
                                </div>
                                <span className="text-emerald-600 text-xs font-semibold">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                        {[
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
                                className={`px-5 py-2.5 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
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
                                setModal(VerifierModal.CreateProofRequest)
                            }
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Request
                        </motion.button>
                    )}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {/* Proof Requests */}
                    {activeTab === VerifierActiveTab.ProofRequests && (
                        <ProofRequests modal={modal} setModal={setModal} />
                    )}
                    {/* Submissions */}
                    {activeTab === VerifierActiveTab.Submissions && (
                        <Submissions />
                    )}
                </AnimatePresence>
            </div>

            {/* Create Modal */}
            {modal == VerifierModal.CreateProofRequest && (
                <CreateProofRequestModal setModal={setModal} />
            )}
        </div>
    );
}
