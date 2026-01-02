"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Building2,
    FileText,
    Award,
    Settings,
    Shield,
    Clock,
    Fingerprint,
    GraduationCap,
    Heart,
    Car,
    Plane,
    Copy,
    LogOut,
    User,
    CheckCircle,
    Bell,
    Search,
    ChevronDown,
} from "lucide-react";
import Overview from "@/components/issuer/Overview";
import {
    IssuerActiveTab,
    IssuerItemSelectedType,
    IssuerModal,
    IssuerNullType,
} from "@/constants/issuer";
import { IssuerItemSelected } from "@/types/issuer";
import Schemas from "@/components/issuer/Schema";
import Documents from "@/components/issuer/Document";
import { DocumentType } from "@/constants/document";
import { useIdentityStore } from "@/store/identity.store";
import { useRouter } from "next/navigation";
import CredentialRequest from "@/components/issuer/CredentialRequest";
import VerifiableCredential from "@/components/issuer/VerifiableCredential";
import SaveDocumentModal from "@/components/issuer/modal/SaveDocumentModal";
import SaveSchemaModal from "@/components/issuer/modal/SaveSchemaModal";

const credentialTypeConfig = {
    [DocumentType.CitizenIdentity]: {
        icon: Fingerprint,
        label: "Citizen Identity",
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
    },
    [DocumentType.AcademicDegree]: {
        icon: GraduationCap,
        label: "Academic Degree",
        color: "purple",
        gradient: "from-purple-500 to-pink-500",
    },
    [DocumentType.HealthInsurance]: {
        icon: Heart,
        label: "Health Insurance",
        color: "rose",
        gradient: "from-rose-500 to-orange-500",
    },
    [DocumentType.DriverLicense]: {
        icon: Car,
        label: "Driver License",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
    },
    [DocumentType.Passport]: {
        icon: Plane,
        label: "Passport",
        color: "amber",
        gradient: "from-amber-500 to-yellow-500",
    },
};

const navigationItems = [
    {
        id: "overview",
        tab: IssuerActiveTab.Overview,
        label: "Overview",
        icon: Shield,
    },
    {
        id: "documents",
        tab: IssuerActiveTab.Documents,
        label: "Documents",
        icon: FileText,
    },
    {
        id: "schemas",
        tab: IssuerActiveTab.Schemas,
        label: "Schemas",
        icon: Settings,
    },
    {
        id: "credential_offer",
        tab: IssuerActiveTab.CredentialRequest,
        label: "Credential Request",
        icon: Clock,
        badge: 1,
    },
    {
        id: "verifiable_credential",
        tab: IssuerActiveTab.VerifiableCredential,
        label: "Verifiable Credential",
        icon: Award,
    },
];

export default function IssuerDashboard() {
    const [activeTab, setActiveTab] = useState<IssuerActiveTab>(
        IssuerActiveTab.Overview
    );
    const [showModal, setShowModal] = useState<IssuerModal>(IssuerModal.Null);
    const [copiedDID, setCopiedDID] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [itemSelected, setItemSelected] = useState<IssuerItemSelected>(
        {} as IssuerItemSelected
    );

    const [itemSelectedType, setItemSelectedType] =
        useState<IssuerItemSelectedType>(IssuerNullType.Null);

    // hook
    const router = useRouter();
    const { name, did, logout } = useIdentityStore();

    const handleLogout = () => {
        logout();
        router.push("/auth");
    };
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedDID(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Top Header Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
                <div className="h-full px-6 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                GovPortal
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Issuer Platform
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search credentials, holders..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                                <p className="text-xs text-emerald-600 font-medium">
                                    Issued:{" "}
                                    <span className="font-bold">127</span>
                                </p>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs text-amber-600 font-medium">
                                    Pending:{" "}
                                    <span className="font-bold">5</span>
                                </p>
                            </div>
                        </div>

                        {/* Notifications */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </motion.button>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                    setShowProfileMenu(!showProfileMenu)
                                }
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 transition-colors"
                            >
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                        {name?.charAt(0).toUpperCase() || "A"}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-gray-900">
                                        {name || "Admin User"}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Issuer
                                    </p>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-600 transition-transform ${
                                        showProfileMenu ? "rotate-180" : ""
                                    }`}
                                />
                            </motion.button>

                            {/* Profile Dropdown Menu */}
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() =>
                                                setShowProfileMenu(false)
                                            }
                                        />

                                        {/* Dropdown */}
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.95,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                                        >
                                            {/* Profile Header */}
                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                                                            {name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "A"}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-lg font-bold text-white mb-1">
                                                            {name ||
                                                                "Admin User"}
                                                        </p>
                                                        <p className="text-sm text-blue-100 flex items-center gap-1">
                                                            <Shield className="w-4 h-4" />
                                                            Premium Issuer
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DID Section */}
                                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-blue-700 uppercase">
                                                        Issuer DID
                                                    </span>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                did || ""
                                                            )
                                                        }
                                                        className="px-2 py-1 rounded-lg bg-white hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
                                                    >
                                                        {copiedDID ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                                <span className="text-xs font-medium text-emerald-600">
                                                                    Copied!
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4 text-blue-600" />
                                                                <span className="text-xs font-medium text-blue-600">
                                                                    Copy
                                                                </span>
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                                {did ? (
                                                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                        <p className="text-xs font-mono text-gray-800 break-all leading-relaxed">
                                                            {did}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                        <p className="text-xs text-gray-500 italic text-center">
                                                            No DID found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="p-4 space-y-2">
                                                <button className="w-full px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    View Profile
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-red-200"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="pt-16 flex">
                {/* Sidebar */}
                <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {navigationItems.map((item, idx) => {
                            const isActive = activeTab === item.tab;
                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(item.tab)}
                                    className={`w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold flex items-center justify-between group ${
                                        isActive
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon
                                            className={`w-5 h-5 ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-gray-500 group-hover:text-gray-700"
                                            }`}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && item.badge > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                                            {item.badge}
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Info Card at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <p className="text-xs font-bold text-blue-700 mb-2">
                                Need Help?
                            </p>
                            <p className="text-xs text-gray-600 mb-3">
                                Contact support for assistance
                            </p>
                            <button className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 ml-64 p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === IssuerActiveTab.Overview && (
                            <Overview
                                setItemSelectedType={setItemSelectedType}
                                setActiveTab={setActiveTab}
                                setShowModal={setShowModal}
                            />
                        )}
                        {activeTab === IssuerActiveTab.Documents && (
                            <Documents
                                showModal={showModal}
                                itemSelected={itemSelected}
                                credentialTypeConfig={credentialTypeConfig}
                                setItemSelected={setItemSelected}
                                setItemSelectedType={setItemSelectedType}
                                setShowModal={setShowModal}
                            />
                        )}
                        {activeTab === IssuerActiveTab.Schemas && (
                            <Schemas
                                showModal={showModal}
                                credentialTypeConfig={credentialTypeConfig}
                                setShowModal={setShowModal}
                            />
                        )}
                        {activeTab === IssuerActiveTab.CredentialRequest && (
                            <CredentialRequest
                                credentialTypeConfig={credentialTypeConfig}
                                setShowModal={setShowModal}
                            />
                        )}
                        {activeTab === IssuerActiveTab.VerifiableCredential && (
                            <VerifiableCredential
                                credentialTypeConfig={credentialTypeConfig}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    {(showModal === IssuerModal.CreateDocument ||
                        showModal === IssuerModal.EditDocument) && (
                        <SaveDocumentModal
                            itemSelected={itemSelected}
                            itemSelectedType={itemSelectedType}
                            showModal={showModal}
                            setShowModal={setShowModal}
                        />
                    )}
                    {(showModal === IssuerModal.CreateSchema ||
                        showModal === IssuerModal.EditSchema) && (
                        <SaveSchemaModal
                            showModal={showModal}
                            setShowModal={setShowModal}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
