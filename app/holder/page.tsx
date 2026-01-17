"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Shield,
    Clock,
    Copy,
    Fingerprint,
    Award,
    Plus,
    Check,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { HolderActiveTab, HolderModal } from "@/constants/holder";
import { useIdentityStore } from "@/store/identity.store";
import MyVerifiableCredential from "@/components/holder/MyVerifiableCredential";
import MyCredentialRequest from "@/components/holder/MyCredentialRequest";
import MyProofRequests from "@/components/holder/MyProofRequests";
import CreateCredentialRequestModal from "@/components/holder/modal/CreateCredentialRequestModal";
import { useRouter } from "next/navigation";

const dashboard = {
    verifiableCredentials: 0,
    credentialRequests: 0,
    proofsGenerated: 0,
};

export default function HolderDashboard() {
    const [activeTab, setActiveTab] = useState<HolderActiveTab>(
        HolderActiveTab.VerifiableCredentials,
    );

    const [showModal, setShowModal] = useState<HolderModal>(HolderModal.Null);
    const [didCopied, setDIDCopied] = useState<boolean>(false);
    const [stateCopied, setStateCopied] = useState<boolean>(false);
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const identity = useIdentityStore((state) => state.identity);
    const logout = useIdentityStore((state) => state.logout);
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setStateCopied(false);
        setDIDCopied(false);
        if (type === "did") setDIDCopied(true);
        if (type === "state") setStateCopied(true);
    };

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Holder Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Decentralized Identity Management
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
                                                                    "did",
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
                                                                    "state",
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

                    {/* Stats Card - Simplified without DID/State */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
                    >
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200"
                            >
                                <div className="text-2xl font-bold text-blue-700">
                                    {dashboard.verifiableCredentials}
                                </div>
                                <div className="text-xs text-blue-600">
                                    Credentials
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200"
                            >
                                <div className="text-2xl font-bold text-purple-700">
                                    {dashboard.credentialRequests}
                                </div>
                                <div className="text-xs text-purple-600">
                                    Pending
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200"
                            >
                                <div className="text-2xl font-bold text-green-700">
                                    {dashboard.proofsGenerated}
                                </div>
                                <div className="text-xs text-green-600">
                                    Proofs
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                        {[
                            {
                                id: HolderActiveTab.VerifiableCredentials,
                                label: "My Verifiable Credentials",
                                icon: Award,
                            },
                            {
                                id: HolderActiveTab.CredentialRequests,
                                label: "My Credential Requests",
                                icon: Clock,
                            },
                            {
                                id: HolderActiveTab.ProofRequests,
                                label: "Proof Requests",
                                icon: Shield,
                            },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() =>
                                    setActiveTab(tab.id as HolderActiveTab)
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2.5 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                    {/* Request Credential Button - Always visible */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            setShowModal(HolderModal.CreateCredentialRequest)
                        }
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <Plus className="w-5 h-5" />
                        Request Credential
                    </motion.button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {/* My Credentials Tab */}
                    {activeTab === HolderActiveTab.VerifiableCredentials && (
                        <MyVerifiableCredential
                            showModal={showModal}
                            setShowModal={setShowModal}
                        />
                    )}

                    {/* My Requests Tab */}
                    {activeTab === HolderActiveTab.CredentialRequests && (
                        <MyCredentialRequest />
                    )}

                    {/* Proof Requests Tab */}
                    {activeTab === HolderActiveTab.ProofRequests && (
                        <MyProofRequests
                            showModal={showModal}
                            setShowModal={setShowModal}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal === HolderModal.CreateCredentialRequest && (
                    <CreateCredentialRequestModal
                        onClose={() => setShowModal(HolderModal.Null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
