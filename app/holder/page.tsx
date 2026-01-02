"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Shield,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    Copy,
    Eye,
    EyeOff,
    Fingerprint,
    Key,
    Award,
    Plus,
    Info,
} from "lucide-react";
import { HolderActiveTab, HolderModal } from "@/constants/holder";
import { useIdentityStore } from "@/store/identity.store";
import MyVerifiableCredential from "@/components/holder/MyVerifiableCredential";
import MyCredentialRequest from "@/components/holder/MyCredentialRequest";
import MyProofRequests from "@/components/holder/MyProofRequests";
import CreateCredentialRequestModal from "@/components/holder/modal/CreateCredentialRequestModal";
import GenerateProofModal from "@/components/holder/modal/GenerateProofModal";
import ProofRequestDetailModal from "@/components/holder/modal/ProofRequestDetailModal";
import CredentialRequestDetailModal from "@/components/holder/modal/CredentialRequestDetailModal";

// ==================== TYPES ====================

type CredentialType =
    | "CitizenIdentity"
    | "AcademyDegree"
    | "HealthInsurance"
    | "DriverLicense"
    | "Passport";

export interface Credential {
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

export interface CredentialRequest {
    id: number;
    type: CredentialType;
    issuer: string;
    issuerDID: string;
    status: "pending" | "approved" | "rejected" | "issued";
    requestedDate: string;
    providedData: any;
    message?: string;
}

export interface ProofRequest {
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

// Mock Credentials
const credentials: Credential[] = [
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
];

// Mock Credential Requests
const requests: CredentialRequest[] = [
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
];

// Mock Proof Requests
const proofRequests: ProofRequest[] = [
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
];
// Available schemas to request
const availableSchemas: AvailableSchema[] = [
    {
        id: 1,
        name: "Citizen Identity Card",
        type: "CitizenIdentity",
        issuer: "National ID Authority",
        issuerDID:
            "did:polygonid:polygon:mumbai:2qH7XAwYQzCp9VfhpNgeLtK2iCehDDrfMWUCEg5ig5",
        description: "National citizen identification card",
        requiredFields: ["id", "name", "gender", "dateOfBirth", "placeOfBirth"],
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
            "expiryDate",
        ],
    },
];

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
        color: "pink",
    },
    DriverLicense: {
        icon: "🚗",
        label: "Driver License",
        color: "teal",
    },
    Passport: { icon: "✈️", label: "Passport", color: "orange" },
};

// Mock Holder Identity
const dashboard = {
    credentialsCount: 3,
    pendingRequests: 2,
    proofsGenerated: 5,
};

// ==================== MAIN COMPONENT ====================

export default function HolderDashboard() {
    const [activeTab, setActiveTab] = useState<HolderActiveTab>(
        HolderActiveTab.VerifiableCredentials
    );

    const [showModal, setShowModal] = useState<HolderModal>(HolderModal.Null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { did, name, state } = useIdentityStore();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    // method modal
    const onClose = () => {
        setShowModal(HolderModal.Null);
        setSelectedItem(null);
    };

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
                    </div>

                    {/* Wallet Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Fingerprint className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">
                                        Decentralized Identifier
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <code className="text-sm text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded border border-gray-200">
                                        {did.substring(0, 50)}...
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(did)}
                                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <Copy className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-600 mb-1">
                                    State Hash
                                </div>
                                <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                    {state}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200"
                            >
                                <div className="text-2xl font-bold text-blue-700">
                                    {dashboard.credentialsCount}
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
                                    {dashboard.pendingRequests}
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
                                label: "My Credentials",
                                icon: Award,
                            },
                            {
                                id: HolderActiveTab.CredentialRequests,
                                label: "My Credential Requests",
                                icon: Clock,
                                badge: requests.filter(
                                    (r) => r.status === "pending"
                                ).length,
                            },
                            {
                                id: HolderActiveTab.ProofRequests,
                                label: "Proof Requests",
                                icon: Shield,
                                badge: proofRequests.filter(
                                    (p) => p.status === "pending"
                                ).length,
                            },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
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
                                {tab.badge && tab.badge > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                                        {tab.badge}
                                    </span>
                                )}
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
                            credentialTypeConfig={credentialTypeConfig}
                            setShowModal={setShowModal}
                        />
                    )}

                    {/* My Requests Tab */}
                    {activeTab === HolderActiveTab.CredentialRequests && (
                        <MyCredentialRequest
                            credentialTypeConfig={credentialTypeConfig}
                        />
                    )}

                    {/* Proof Requests Tab */}
                    {activeTab === HolderActiveTab.ProofRequests && (
                        <MyProofRequests setShowModal={setShowModal} />
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal === HolderModal.CreateCredentialRequest && (
                    <CreateCredentialRequestModal
                        onClose={() => setShowModal(HolderModal.Null)}
                        onSubmit={(data) => {
                            setShowModal(HolderModal.Null);
                        }}
                    />
                )}

                {showModal === HolderModal.CredentialRequestDetail &&
                    selectedItem && (
                        <CredentialRequestDetailModal
                            credential={selectedItem}
                            onClose={() => {
                                setShowModal(HolderModal.Null);
                                setSelectedItem(null);
                            }}
                        />
                    )}

                {showModal === HolderModal.GenerateProof && selectedItem && (
                    <GenerateProofModal
                        proofRequest={selectedItem}
                        credentials={credentials}
                        onClose={() => {
                            setShowModal(HolderModal.Null);
                            setSelectedItem(null);
                        }}
                        onGenerate={(proof) => {
                            setShowModal(HolderModal.Null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showModal === HolderModal.ProofRequestDetail &&
                    selectedItem && (
                        <ProofRequestDetailModal
                            proofRequest={selectedItem}
                            onClose={() => {
                                setShowModal(HolderModal.Null);
                                setSelectedItem(null);
                            }}
                        />
                    )}
            </AnimatePresence>
        </div>
    );
}

// ==================== MODALS ====================
