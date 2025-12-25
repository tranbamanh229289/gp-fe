"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Shield,
    FileText,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    Copy,
    Download,
    Eye,
    EyeOff,
    Fingerprint,
    Key,
    Award,
    Plus,
    Search,
    Filter,
    ChevronRight,
    AlertCircle,
    Info,
} from "lucide-react";
import { HolderTabMode } from "@/constants/holder";

// ==================== TYPES ====================

type CredentialType =
    | "CitizenIdentity"
    | "AcademyDegree"
    | "HealthInsurance"
    | "DriverLicense"
    | "Passport";

interface Credential {
    id: number;
    type: CredentialType;
    issuer: string;
    issuerDID: string;
    issuedDate: string;
    expiryDate: string | null;
    status: "active" | "expired" | "revoked";
    data: any;
    proofType: "signature" | "mtp";
}

interface CredentialRequest {
    id: number;
    type: CredentialType;
    issuer: string;
    issuerDID: string;
    status: "pending" | "approved" | "rejected" | "issued";
    requestedDate: string;
    providedData: any;
    message?: string;
}

interface ProofRequest {
    id: number;
    verifier: string;
    verifierDID: string;
    requestType: string;
    requirements: string[];
    status: "pending" | "verified" | "failed";
    requestedDate: string;
}

interface AvailableSchema {
    id: number;
    name: string;
    type: CredentialType;
    issuer: string;
    issuerDID: string;
    description: string;
    requiredFields: string[];
}

// ==================== MAIN COMPONENT ====================

export default function HolderDashboard() {
    const [activeTab, setActiveTab] = useState<HolderTabMode>(
        HolderTabMode.Wallet
    );
    const [showModal, setShowModal] = useState<
        "request" | "proof" | "detail" | null
    >(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    // Mock Holder Identity
    const holderIdentity = {
        did: "did:polygonid:polygon:mumbai:2qCU58EJgrELNZCDkSU23dQHZsBgAFWLNpNezo1Y6N",
        privateKey: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        name: "Alice Johnson",
        stateHash: "0x2f8a..e9c3",
        credentialsCount: 3,
        pendingRequests: 2,
        proofsGenerated: 5,
    };

    // Mock Credentials
    const [credentials] = useState<Credential[]>([
        {
            id: 1,
            type: "CitizenIdentity",
            issuer: "National ID Authority",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qH7XAwYQzCp9VfhpNgeLtK2iCehDDrfMWUCEg5ig5",
            issuedDate: "2024-01-15",
            expiryDate: "2030-01-15",
            status: "active",
            proofType: "signature",
            data: {
                id: "VN001234567",
                name: "Alice Johnson",
                gender: "Female",
                dateOfBirth: "1990-05-15",
                placeOfBirth: "Hanoi, Vietnam",
            },
        },
        {
            id: 2,
            type: "DriverLicense",
            issuer: "Transport Department",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qLPqPWH4hGF7vjM3MqvKQMNjW8JF4eP9XBg6zY3U9",
            issuedDate: "2024-02-20",
            expiryDate: "2032-02-20",
            status: "active",
            proofType: "mtp",
            data: {
                driverNumber: "DL123456789",
                class: "B2",
                point: 12,
            },
        },
        {
            id: 3,
            type: "AcademyDegree",
            issuer: "MIT University",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qJ8KXZnQhPKgVpDxkQwq5NmW9kBEr2PqhL7fY6T8R",
            issuedDate: "2024-06-15",
            expiryDate: null,
            status: "active",
            proofType: "signature",
            data: {
                degreeNumber: "MIT2024001",
                degreeType: "Bachelor",
                major: "Computer Science",
                university: "MIT",
                graduateYear: 2024,
            },
        },
    ]);

    // Mock Credential Requests
    const [requests, setRequests] = useState<CredentialRequest[]>([
        {
            id: 1,
            type: "HealthInsurance",
            issuer: "Health Insurance Corp",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qN9MpVxYkFp5TmRqhL3vQw8JzXnBgE4rD6fG7hY2K",
            status: "pending",
            requestedDate: "2024-12-18",
            providedData: {
                insuranceNumber: "INS987654321",
                insuranceType: "Premium",
                hospital: "Central Hospital",
            },
        },
        {
            id: 2,
            type: "Passport",
            issuer: "Immigration Department",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qP7QwRzXjGl4UhSpmN2xDv9KyYoBfT5nE8fH6jZ3M",
            status: "approved",
            requestedDate: "2024-12-15",
            providedData: {
                passportNumber: "PP12345678",
                nationality: "Vietnam",
                mrz: "P<VNMJOHNSON<<ALICE<<<<<<<<<<<<<<<<<<<<<<<",
            },
            message:
                "Your passport credential has been approved. It will be issued shortly.",
        },
    ]);

    // Mock Proof Requests
    const [proofRequests] = useState<ProofRequest[]>([
        {
            id: 1,
            verifier: "Online Banking Service",
            verifierDID:
                "did:polygonid:polygon:mumbai:2qR8TxWzYkHm5VjTrnO3yEx0LzZpCgU6oF9gI7kA4N",
            requestType: "Age Verification",
            requirements: ["dateOfBirth > 18 years old"],
            status: "pending",
            requestedDate: "2024-12-20",
        },
        {
            id: 2,
            verifier: "Car Rental Company",
            verifierDID:
                "did:polygonid:polygon:mumbai:2qS9UyXzZlIn6WkUsoP4zFy1M0AqDhV7pH0hJ8lB5O",
            requestType: "Driver License Verification",
            requirements: ["Valid driver license", "Class B2"],
            status: "verified",
            requestedDate: "2024-12-19",
        },
    ]);

    // Available schemas to request
    const [availableSchemas] = useState<AvailableSchema[]>([
        {
            id: 1,
            name: "Citizen Identity Card",
            type: "CitizenIdentity",
            issuer: "National ID Authority",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qH7XAwYQzCp9VfhpNgeLtK2iCehDDrfMWUCEg5ig5",
            description: "National citizen identification card",
            requiredFields: [
                "id",
                "name",
                "gender",
                "dateOfBirth",
                "placeOfBirth",
            ],
        },
        {
            id: 2,
            name: "Health Insurance",
            type: "HealthInsurance",
            issuer: "Health Insurance Corp",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qN9MpVxYkFp5TmRqhL3vQw8JzXnBgE4rD6fG7hY2K",
            description: "Health insurance coverage credential",
            requiredFields: [
                "insuranceNumber",
                "insuranceType",
                "hospital",
                "startDate",
                "expiryDate",
            ],
        },
        {
            id: 3,
            name: "Passport",
            type: "Passport",
            issuer: "Immigration Department",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qP7QwRzXjGl4UhSpmN2xDv9KyYoBfT5nE8fH6jZ3M",
            description: "International passport credential",
            requiredFields: [
                "passportNumber",
                "nationality",
                "mrz",
                "issueDate",
                "expiryDate",
            ],
        },
        {
            id: 4,
            name: "University Degree",
            type: "AcademyDegree",
            issuer: "MIT University",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qJ8KXZnQhPKgVpDxkQwq5NmW9kBEr2PqhL7fY6T8R",
            description: "Academic degree certificate",
            requiredFields: [
                "degreeNumber",
                "degreeType",
                "major",
                "university",
                "cpa",
                "graduateYear",
            ],
        },
        {
            id: 5,
            name: "Driver License",
            type: "DriverLicense",
            issuer: "Transport Department",
            issuerDID:
                "did:polygonid:polygon:mumbai:2qLPqPWH4hGF7vjM3MqvKQMNjW8JF4eP9XBg6zY3U9",
            description: "Official driver license credential",
            requiredFields: [
                "driverNumber",
                "class",
                "point",
                "issueDate",
                "expireDate",
            ],
        },
    ]);

    const credentialTypeConfig = {
        CitizenIdentity: {
            icon: "🆔",
            label: "Citizen Identity",
            color: "blue",
        },
        AcademyDegree: { icon: "🎓", label: "Academy Degree", color: "purple" },
        HealthInsurance: {
            icon: "🏥",
            label: "Health Insurance",
            color: "rose",
        },
        DriverLicense: {
            icon: "🚗",
            label: "Driver License",
            color: "emerald",
        },
        Passport: { icon: "✈️", label: "Passport", color: "amber" },
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
                <div
                    className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Polygon ID Wallet
                                </h1>
                                <p className="text-sm text-purple-200">
                                    Decentralized Identity Management
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold transition-all border border-white/20">
                            <Download className="w-4 h-4 inline mr-2" />
                            Export Wallet
                        </button>
                    </div>

                    {/* Wallet Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Fingerprint className="w-5 h-5 text-purple-300" />
                                    <span className="text-sm font-semibold text-purple-200">
                                        Decentralized Identifier
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <code className="text-sm text-white font-mono bg-black/20 px-3 py-1 rounded">
                                        {holderIdentity.did.substring(0, 50)}...
                                    </code>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(holderIdentity.did)
                                        }
                                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    >
                                        <Copy className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Key className="w-4 h-4 text-pink-300" />
                                    <span className="text-xs font-semibold text-pink-200">
                                        Private Key
                                    </span>
                                    <button
                                        onClick={() =>
                                            setShowPrivateKey(!showPrivateKey)
                                        }
                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                    >
                                        {showPrivateKey ? (
                                            <EyeOff className="w-3 h-3 text-white" />
                                        ) : (
                                            <Eye className="w-3 h-3 text-white" />
                                        )}
                                    </button>
                                </div>
                                {showPrivateKey && (
                                    <code className="text-xs text-white font-mono bg-black/20 px-3 py-1 rounded inline-block mt-1">
                                        {holderIdentity.privateKey}
                                    </code>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-purple-200 mb-1">
                                    State Hash
                                </div>
                                <div className="text-sm text-white font-mono">
                                    {holderIdentity.stateHash}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-white">
                                    {holderIdentity.credentialsCount}
                                </div>
                                <div className="text-xs text-purple-200">
                                    Credentials
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-white">
                                    {holderIdentity.pendingRequests}
                                </div>
                                <div className="text-xs text-purple-200">
                                    Pending
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-white">
                                    {holderIdentity.proofsGenerated}
                                </div>
                                <div className="text-xs text-purple-200">
                                    Proofs
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        {
                            id: HolderTabMode.Wallet,
                            label: "My Credentials",
                            icon: Award,
                        },
                        {
                            id: HolderTabMode.Credentials,
                            label: "Request Credential",
                            icon: Plus,
                        },
                        {
                            id: HolderTabMode.Requests,
                            label: "My Requests",
                            icon: Clock,
                            badge: requests.filter(
                                (r) => r.status === "pending"
                            ).length,
                        },
                        {
                            id: HolderTabMode.Proofs,
                            label: "Proof Requests",
                            icon: Shield,
                            badge: proofRequests.filter(
                                (p) => p.status === "pending"
                            ).length,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                activeTab === tab.id
                                    ? "bg-white text-purple-900"
                                    : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.badge && tab.badge > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {/* My Credentials Tab */}
                    {activeTab === HolderTabMode.Wallet && (
                        <motion.div
                            key="wallet"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {credentials.map((cred) => {
                                    const config =
                                        credentialTypeConfig[cred.type];

                                    return (
                                        <motion.div
                                            key={cred.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:border-white/40 transition-all cursor-pointer"
                                            onClick={() => {
                                                setSelectedItem(cred);
                                                setShowModal("detail");
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-12 h-12 rounded-xl bg-${config.color}-500/20 flex items-center justify-center text-2xl`}
                                                    >
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white">
                                                            {config.label}
                                                        </h3>
                                                        <p className="text-xs text-purple-200">
                                                            {cred.issuer}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        cred.status === "active"
                                                            ? "bg-emerald-500/20 text-emerald-300"
                                                            : cred.status ===
                                                              "expired"
                                                            ? "bg-gray-500/20 text-gray-300"
                                                            : "bg-red-500/20 text-red-300"
                                                    }`}
                                                >
                                                    {cred.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                {Object.entries(cred.data)
                                                    .slice(0, 3)
                                                    .map(([key, value]) => (
                                                        <div
                                                            key={key}
                                                            className="flex justify-between"
                                                        >
                                                            <span className="text-purple-300">
                                                                {key}:
                                                            </span>
                                                            <span className="text-white font-semibold">
                                                                {String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                                                <div className="text-purple-200">
                                                    Issued:{" "}
                                                    {new Date(
                                                        cred.issuedDate
                                                    ).toLocaleDateString()}
                                                </div>
                                                <div className="text-pink-300">
                                                    {cred.proofType ===
                                                    "signature"
                                                        ? "🔑 Signature"
                                                        : "🛡️ MTP"}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {credentials.length === 0 && (
                                    <div className="col-span-full text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                        <Award className="w-16 h-16 text-white/20 mx-auto mb-3" />
                                        <p className="text-white/60">
                                            No credentials yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Request Credential Tab - Simplified */}
                    {activeTab === HolderTabMode.Credentials && (
                        <motion.div
                            key="credentials"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Request New Credential
                                </h2>
                                <p className="text-sm text-purple-200">
                                    Request credentials from issuers
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal("request")}
                                className="w-full p-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all border-2 border-dashed border-white/30 hover:border-white/50"
                            >
                                <Plus className="w-12 h-12 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">
                                    Create Credential Request
                                </h3>
                                <p className="text-sm text-white/80">
                                    Click to request a new credential from an
                                    issuer
                                </p>
                            </button>
                        </motion.div>
                    )}

                    {/* My Requests Tab */}
                    {activeTab === HolderTabMode.Requests && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    My Credential Requests
                                </h2>
                                <p className="text-sm text-purple-200">
                                    Track your credential requests status
                                </p>
                            </div>

                            <div className="space-y-4">
                                {requests.map((request) => {
                                    const config =
                                        credentialTypeConfig[request.type];

                                    return (
                                        <motion.div
                                            key={request.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`w-14 h-14 rounded-xl bg-${config.color}-500/20 flex items-center justify-center text-2xl flex-shrink-0`}
                                                >
                                                    {config.icon}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white">
                                                                {config.label}
                                                            </h3>
                                                            <p className="text-sm text-purple-200">
                                                                {request.issuer}
                                                            </p>
                                                            <p className="text-xs text-purple-300 mt-1">
                                                                Requested:{" "}
                                                                {new Date(
                                                                    request.requestedDate
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                request.status ===
                                                                "pending"
                                                                    ? "bg-amber-500/20 text-amber-300"
                                                                    : request.status ===
                                                                      "approved"
                                                                    ? "bg-blue-500/20 text-blue-300"
                                                                    : request.status ===
                                                                      "issued"
                                                                    ? "bg-emerald-500/20 text-emerald-300"
                                                                    : "bg-red-500/20 text-red-300"
                                                            }`}
                                                        >
                                                            {request.status ===
                                                                "pending" && (
                                                                <Clock className="w-3 h-3 inline mr-1" />
                                                            )}
                                                            {request.status ===
                                                                "approved" && (
                                                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                                            )}
                                                            {request.status ===
                                                                "issued" && (
                                                                <Award className="w-3 h-3 inline mr-1" />
                                                            )}
                                                            {request.status ===
                                                                "rejected" && (
                                                                <XCircle className="w-3 h-3 inline mr-1" />
                                                            )}
                                                            {request.status}
                                                        </span>
                                                    </div>

                                                    {/* Provided Data */}
                                                    <div className="mt-3 p-3 rounded-lg bg-white/5">
                                                        <p className="text-xs font-semibold text-purple-300 mb-2">
                                                            PROVIDED DATA
                                                        </p>
                                                        <div className="space-y-1">
                                                            {Object.entries(
                                                                request.providedData
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    value,
                                                                ]) => (
                                                                    <div
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="flex justify-between text-sm"
                                                                    >
                                                                        <span className="text-purple-300">
                                                                            {
                                                                                key
                                                                            }
                                                                            :
                                                                        </span>
                                                                        <span className="text-white font-semibold">
                                                                            {String(
                                                                                value
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {request.message && (
                                                        <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                            <div className="flex items-start gap-2">
                                                                <Info className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                                                                <p className="text-sm text-blue-200">
                                                                    {
                                                                        request.message
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {requests.length === 0 && (
                                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                        <Clock className="w-16 h-16 text-white/20 mx-auto mb-3" />
                                        <p className="text-white/60">
                                            No requests yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Proof Requests Tab */}
                    {activeTab === HolderTabMode.Proofs && (
                        <motion.div
                            key="proofs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Proof Requests
                                </h2>
                                <p className="text-sm text-purple-200">
                                    Generate zero-knowledge proofs for verifiers
                                </p>
                            </div>

                            <div className="space-y-4">
                                {proofRequests.map((proof) => (
                                    <motion.div
                                        key={proof.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {proof.verifier}
                                                </h3>
                                                <p className="text-sm text-purple-200">
                                                    {proof.requestType}
                                                </p>
                                                <p className="text-xs text-purple-300 mt-1">
                                                    {new Date(
                                                        proof.requestedDate
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    proof.status === "pending"
                                                        ? "bg-amber-500/20 text-amber-300"
                                                        : proof.status ===
                                                          "verified"
                                                        ? "bg-emerald-500/20 text-emerald-300"
                                                        : "bg-red-500/20 text-red-300"
                                                }`}
                                            >
                                                {proof.status}
                                            </span>
                                        </div>

                                        <div className="mb-3 p-3 rounded-lg bg-white/5">
                                            <p className="text-xs font-semibold text-purple-300 mb-2">
                                                REQUIREMENTS
                                            </p>
                                            <ul className="space-y-1">
                                                {proof.requirements.map(
                                                    (req, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="text-sm text-white flex items-center gap-2"
                                                        >
                                                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                            {req}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(proof);
                                                    setShowModal("proofDetail");
                                                }}
                                                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                            {proof.status === "pending" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(proof);
                                                        setShowModal("proof");
                                                    }}
                                                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                    Generate Proof
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal === "request" && (
                    <SimpleRequestModal
                        onClose={() => setShowModal(null)}
                        onSubmit={(data) => {
                            console.log("Submit request:", data);
                            setShowModal(null);
                        }}
                    />
                )}

                {showModal === "proof" && selectedItem && (
                    <GenerateProofModal
                        proofRequest={selectedItem}
                        credentials={credentials}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                        onGenerate={(proof) => {
                            console.log("Generate proof:", proof);
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showModal === "proofDetail" && selectedItem && (
                    <ProofDetailModal
                        proofRequest={selectedItem}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showModal === "detail" && selectedItem && (
                    <CredentialDetailModal
                        credential={selectedItem}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ==================== MODALS ====================

function SimpleRequestModal({ onClose, onSubmit }: any) {
    const [selectedType, setSelectedType] =
        useState<CredentialType>("CitizenIdentity");
    const [issuerDID, setIssuerDID] = useState("");
    const [formData, setFormData] = useState<any>({});

    const credentialFields: Record<CredentialType, string[]> = {
        CitizenIdentity: [
            "id",
            "name",
            "gender",
            "placeOfBirth",
            "dateOfBirth",
            "issueDate",
            "expireDate",
        ],
        AcademyDegree: [
            "degreeNumber",
            "degreeType",
            "major",
            "university",
            "cpa",
            "graduateYear",
            "classification",
        ],
        HealthInsurance: [
            "insuranceNumber",
            "insuranceType",
            "hospital",
            "startDate",
            "expiryDate",
        ],
        DriverLicense: [
            "driverNumber",
            "class",
            "point",
            "issueDate",
            "expireDate",
        ],
        Passport: [
            "passportNumber",
            "nationality",
            "mrz",
            "issueDate",
            "expiryDate",
        ],
    };

    const typeIcons = {
        CitizenIdentity: "🆔",
        AcademyDegree: "🎓",
        HealthInsurance: "🏥",
        DriverLicense: "🚗",
        Passport: "✈️",
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
            >
                <div className="p-6 border-b border-purple-500/30">
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Create Credential Request
                    </h3>
                    <p className="text-sm text-purple-300">
                        Select type and provide issuer information
                    </p>
                </div>

                <div className="p-6">
                    {/* Credential Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-white mb-3">
                            Credential Type
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(typeIcons).map(([type, icon]) => (
                                <button
                                    key={type}
                                    onClick={() =>
                                        setSelectedType(type as CredentialType)
                                    }
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        selectedType === type
                                            ? "border-purple-500 bg-purple-500/20"
                                            : "border-white/10 hover:border-white/20 bg-white/5"
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{icon}</div>
                                    <div className="text-xs text-white">
                                        {type}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Issuer DID */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-white mb-2">
                            Issuer DID
                        </label>
                        <input
                            type="text"
                            value={issuerDID}
                            onChange={(e) => setIssuerDID(e.target.value)}
                            placeholder="did:polygonid:polygon:mumbai:..."
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                        />
                    </div>

                    {/* Credential Data Fields */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-white mb-3">
                            Credential Data
                        </label>
                        <div className="space-y-3">
                            {credentialFields[selectedType].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs text-purple-300 mb-1">
                                        {field}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[field] || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [field]: e.target.value,
                                            })
                                        }
                                        placeholder={`Enter ${field}`}
                                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-white/20 hover:bg-white/5 text-white font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() =>
                                onSubmit({
                                    type: selectedType,
                                    issuerDID,
                                    data: formData,
                                })
                            }
                            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Submit Request
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ProofDetailModal({ proofRequest, onClose }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-emerald-500/30"
            >
                <div className="p-6 border-b border-emerald-500/30">
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Proof Request Details
                    </h3>
                    <p className="text-sm text-emerald-300">
                        Complete verification information
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Verifier Info */}
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="flex items-start gap-3 mb-3">
                            <Shield className="w-6 h-6 text-emerald-400" />
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-white mb-1">
                                    {proofRequest.verifier}
                                </h4>
                                <p className="text-sm text-emerald-300">
                                    {proofRequest.requestType}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    proofRequest.status === "pending"
                                        ? "bg-amber-500/20 text-amber-300"
                                        : proofRequest.status === "verified"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-red-500/20 text-red-300"
                                }`}
                            >
                                {proofRequest.status}
                            </span>
                        </div>
                        <div className="text-xs text-emerald-300 font-mono bg-black/20 px-3 py-2 rounded">
                            {proofRequest.verifierDID}
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="p-4 rounded-lg bg-white/5">
                        <h4 className="text-sm font-semibold text-white mb-3">
                            Request Details
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-purple-300">
                                    Requested Date:
                                </span>
                                <span className="text-white font-semibold">
                                    {new Date(
                                        proofRequest.requestedDate
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-purple-300">
                                    Request Type:
                                </span>
                                <span className="text-white font-semibold">
                                    {proofRequest.requestType}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-purple-300">Status:</span>
                                <span className="text-white font-semibold capitalize">
                                    {proofRequest.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="p-4 rounded-lg bg-white/5">
                        <h4 className="text-sm font-semibold text-white mb-3">
                            Verification Requirements
                        </h4>
                        <ul className="space-y-2">
                            {proofRequest.requirements.map(
                                (req: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">
                                            {req}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* ZK Proof Info */}
                    {proofRequest.status === "verified" && (
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Key className="w-4 h-4 text-emerald-400" />
                                <h4 className="text-sm font-semibold text-emerald-300">
                                    Zero-Knowledge Proof
                                </h4>
                            </div>
                            <p className="text-xs text-emerald-200">
                                This proof was generated using zero-knowledge
                                cryptography. The verifier can confirm the
                                requirements are met without accessing your
                                actual credential data.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function GenerateProofModal({
    proofRequest,
    credentials,
    onClose,
    onGenerate,
}: any) {
    const [selectedCredential, setSelectedCredential] = useState<number | null>(
        null
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-emerald-500/30"
            >
                <div className="p-6 border-b border-emerald-500/30">
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Generate Zero-Knowledge Proof
                    </h3>
                    <p className="text-sm text-emerald-300">
                        Select a credential to generate proof for{" "}
                        {proofRequest.verifier}
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm text-white font-semibold mb-2">
                            Requirements:
                        </p>
                        <ul className="space-y-1">
                            {proofRequest.requirements.map(
                                (req: string, idx: number) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-emerald-200 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {req}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="space-y-3 mb-6">
                        {credentials.map((cred: any) => (
                            <button
                                key={cred.id}
                                onClick={() => setSelectedCredential(cred.id)}
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                    selectedCredential === cred.id
                                        ? "border-emerald-500 bg-emerald-500/10"
                                        : "border-white/10 hover:border-white/20 bg-white/5"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">
                                        {cred.type === "CitizenIdentity"
                                            ? "🆔"
                                            : cred.type === "DriverLicense"
                                            ? "🚗"
                                            : "🎓"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-white">
                                            {cred.type}
                                        </div>
                                        <div className="text-xs text-purple-300">
                                            {cred.issuer}
                                        </div>
                                    </div>
                                    {selectedCredential === cred.id && (
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-white/20 hover:bg-white/5 text-white font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() =>
                                onGenerate({ credentialId: selectedCredential })
                            }
                            disabled={!selectedCredential}
                            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Shield className="w-5 h-5" />
                            Generate Proof
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function CredentialDetailModal({ credential, onClose }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-blue-500/30"
            >
                <div className="p-6 border-b border-blue-500/30">
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Credential Details
                    </h3>
                    <p className="text-sm text-blue-300">{credential.type}</p>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-300 mb-1">Issuer</p>
                            <p className="text-sm text-white font-semibold">
                                {credential.issuer}
                            </p>
                            <p className="text-xs text-blue-300 font-mono mt-1">
                                {credential.issuerDID}
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5">
                            <p className="text-xs text-purple-300 font-semibold mb-3">
                                CREDENTIAL DATA
                            </p>
                            <div className="space-y-2">
                                {Object.entries(credential.data).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-purple-300">
                                                {key}:
                                            </span>
                                            <span className="text-white font-semibold">
                                                {String(value)}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-white/5">
                                <p className="text-xs text-purple-300 mb-1">
                                    Issued Date
                                </p>
                                <p className="text-sm text-white font-semibold">
                                    {new Date(
                                        credential.issuedDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5">
                                <p className="text-xs text-purple-300 mb-1">
                                    Expiry Date
                                </p>
                                <p className="text-sm text-white font-semibold">
                                    {credential.expiryDate
                                        ? new Date(
                                              credential.expiryDate
                                          ).toLocaleDateString()
                                        : "Never"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
