"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Users,
    FileText,
    Award,
    Settings,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Check,
    X,
    MoreVertical,
    Upload,
    Download,
    Shield,
    Key,
    Clock,
    AlertCircle,
    ChevronRight,
    Copy,
    Fingerprint,
    Calendar,
    MapPin,
    GraduationCap,
    Heart,
    Car,
    Plane,
} from "lucide-react";

// ==================== TYPES ====================

type CredentialType =
    | "CitizenIdentity"
    | "AcademyDegree"
    | "HealthInsurance"
    | "DriverLicense"
    | "Passport";

interface CitizenIdentity {
    id: string;
    name: string;
    gender: "Male" | "Female" | "Other";
    placeOfBirth: string;
    dateOfBirth: string;
    status: "Active" | "Expired" | "Revoked";
    issueDate: string;
    expireDate: string;
}

interface AcademyDegree {
    degreeNumber: string;
    degreeType: "Bachelor" | "Master" | "PhD" | "Associate";
    major: string;
    university: string;
    cpa: string;
    graduateYear: number;
    classification: "Excellent" | "Good" | "Fair" | "Pass";
    status: "Valid" | "Revoked";
}

interface HealthInsurance {
    insuranceNumber: string;
    insuranceType: "Basic" | "Premium" | "VIP";
    hospital: string;
    status: "Active" | "Expired" | "Suspended";
    startDate: string;
    expiryDate: string;
}

interface DriverLicense {
    driverNumber: string;
    class: string;
    point: number;
    status: "Active" | "Suspended" | "Revoked";
    issueDate: string;
    expireDate: string;
}

interface Passport {
    passportNumber: string;
    nationality: string;
    mrz: string;
    status: "Active" | "Expired" | "Revoked";
    issueDate: string;
    expiryDate: string;
}

interface HolderCredential {
    id: number;
    holderId: number;
    holderName: string;
    holderDID: string;
    type: CredentialType;
    data:
        | CitizenIdentity
        | AcademyDegree
        | HealthInsurance
        | DriverLicense
        | Passport;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Schema {
    id: number;
    name: string;
    type: CredentialType;
    version: string;
    description: string;
    queryFields: QueryField[];
    createdAt: string;
    credentialsIssued: number;
}

interface QueryField {
    name: string;
    type: "string" | "integer" | "boolean" | "date";
    operators: string[];
}

interface CredentialOffer {
    id: number;
    holderId: number;
    holderName: string;
    holderDID: string;
    schemaId: number;
    type: CredentialType;
    providedData: any;
    status: "pending" | "approved" | "rejected" | "issued";
    createdAt: string;
}

interface IssuedCredential {
    id: number;
    credentialId: string;
    holderName: string;
    holderDID: string;
    type: CredentialType;
    proofType: "signature" | "mtp";
    storageType: "offchain" | "onchain";
    issuedDate: string;
    expiryDate: string | null;
    status: "active" | "revoked" | "expired";
}

// ==================== MAIN COMPONENT ====================

export default function IssuerDashboard() {
    const [activeTab, setActiveTab] = useState<
        "overview" | "credentials" | "schemas" | "offers" | "issued"
    >("overview");
    const [showModal, setShowModal] = useState<
        "credential" | "schema" | "issue" | "queryBuilder" | null
    >(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<CredentialType | "all">("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Mock Data
    const [credentials, setCredentials] = useState<HolderCredential[]>([
        {
            id: 1,
            holderId: 1,
            holderName: "Alice Johnson",
            holderDID:
                "did:polygonid:polygon:mumbai:2qCU58EJgrELNZCDkSU23dQHZsBgAFWLNpNezo1Y6N",
            type: "CitizenIdentity",
            data: {
                id: "VN001234567",
                name: "Alice Johnson",
                gender: "Female",
                placeOfBirth: "Hanoi, Vietnam",
                dateOfBirth: "1990-05-15",
                status: "Active",
                issueDate: "2020-01-15",
                expireDate: "2030-01-15",
            } as CitizenIdentity,
            verified: true,
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
        },
        {
            id: 2,
            holderId: 1,
            holderName: "Alice Johnson",
            holderDID:
                "did:polygonid:polygon:mumbai:2qCU58EJgrELNZCDkSU23dQHZsBgAFWLNpNezo1Y6N",
            type: "DriverLicense",
            data: {
                driverNumber: "DL123456789",
                class: "B2",
                point: 12,
                status: "Active",
                issueDate: "2022-03-20",
                expireDate: "2032-03-20",
            } as DriverLicense,
            verified: true,
            createdAt: "2024-02-20",
            updatedAt: "2024-02-20",
        },
        {
            id: 3,
            holderId: 2,
            holderName: "Bob Smith",
            holderDID:
                "did:polygonid:polygon:mumbai:2qH7XAwYQzCp9VfhpNgeLtK2iCehDDrfMWUCEg5ig5",
            type: "AcademyDegree",
            data: {
                degreeNumber: "DEG2020001",
                degreeType: "Bachelor",
                major: "Computer Science",
                university: "MIT",
                cpa: "3.8",
                graduateYear: 2020,
                classification: "Excellent",
                status: "Valid",
            } as AcademyDegree,
            verified: true,
            createdAt: "2024-03-10",
            updatedAt: "2024-03-10",
        },
    ]);

    const [schemas, setSchemas] = useState<Schema[]>([
        {
            id: 1,
            name: "Citizen Identity Card",
            type: "CitizenIdentity",
            version: "1.0.0",
            description: "National citizen identification card schema",
            queryFields: [
                {
                    name: "dateOfBirth",
                    type: "date",
                    operators: ["$lt", "$lte", "$gt", "$gte"],
                },
                { name: "gender", type: "string", operators: ["$eq", "$ne"] },
                {
                    name: "placeOfBirth",
                    type: "string",
                    operators: ["$eq", "$ne", "$in"],
                },
            ],
            createdAt: "2023-06-15",
            credentialsIssued: 523,
        },
        {
            id: 2,
            name: "Driver License",
            type: "DriverLicense",
            version: "1.0.0",
            description: "Official driver license credential",
            queryFields: [
                { name: "class", type: "string", operators: ["$eq", "$in"] },
                { name: "point", type: "integer", operators: ["$gte", "$lte"] },
                { name: "expireDate", type: "date", operators: ["$gt"] },
            ],
            createdAt: "2023-07-20",
            credentialsIssued: 412,
        },
    ]);

    const [offers, setOffers] = useState<CredentialOffer[]>([
        {
            id: 1,
            holderId: 3,
            holderName: "Carol White",
            holderDID:
                "did:polygonid:polygon:mumbai:2qLPqPWH4hGF7vjM3MqvKQMNjW8JF4eP9XBg6zY3U9",
            schemaId: 1,
            type: "CitizenIdentity",
            providedData: {
                id: "VN987654321",
                name: "Carol White",
                gender: "Female",
                placeOfBirth: "Ho Chi Minh, Vietnam",
                dateOfBirth: "1985-08-22",
                issueDate: "2024-01-01",
                expireDate: "2034-01-01",
            },
            status: "pending",
            createdAt: "2024-12-18",
        },
    ]);

    const [issuedCredentials] = useState<IssuedCredential[]>([
        {
            id: 1,
            credentialId: "CRED-000001",
            holderName: "Alice Johnson",
            holderDID:
                "did:polygonid:polygon:mumbai:2qCU58EJgrELNZCDkSU23dQHZsBgAFWLNpNezo1Y6N",
            type: "CitizenIdentity",
            proofType: "signature",
            storageType: "offchain",
            issuedDate: "2024-01-15",
            expiryDate: "2030-01-15",
            status: "active",
        },
        {
            id: 2,
            credentialId: "CRED-000002",
            holderName: "Bob Smith",
            holderDID:
                "did:polygonid:polygon:mumbai:2qH7XAwYQzCp9VfhpNgeLtK2iCehDDrfMWUCEg5ig5",
            type: "DriverLicense",
            proofType: "mtp",
            storageType: "onchain",
            issuedDate: "2024-02-20",
            expiryDate: "2032-02-20",
            status: "active",
        },
    ]);

    const credentialTypeConfig = {
        CitizenIdentity: {
            icon: "🆔",
            label: "Citizen Identity",
            color: "blue",
        },
        AcademyDegree: {
            icon: "🎓",
            label: "Academy Degree",
            color: "purple",
        },
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
        Passport: {
            icon: "✈️",
            label: "Passport",
            color: "amber",
        },
    };

    // Filter credentials
    const filteredCredentials = credentials.filter((cred) => {
        const matchesSearch =
            cred.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            JSON.stringify(cred.data)
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || cred.type === filterType;
        const matchesStatus =
            filterStatus === "all" ||
            (cred.data as any).status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    // CRUD Operations
    const deleteCredential = (id: number) => {
        if (confirm("Are you sure you want to delete this credential?")) {
            setCredentials(credentials.filter((c) => c.id !== id));
        }
    };

    const deleteSchema = (id: number) => {
        if (confirm("Are you sure you want to delete this schema?")) {
            setSchemas(schemas.filter((s) => s.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">
                                GovPortal
                            </h1>
                            <p className="text-xs text-gray-500">
                                Issuer Platform
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {[
                        { id: "overview", label: "Overview", icon: Shield },
                        {
                            id: "credentials",
                            label: "Credential Records",
                            icon: FileText,
                        },
                        {
                            id: "schemas",
                            label: "Schema Builder",
                            icon: Settings,
                        },
                        {
                            id: "offers",
                            label: "Pending Requests",
                            icon: Clock,
                            badge: offers.filter((o) => o.status === "pending")
                                .length,
                        },
                        {
                            id: "issued",
                            label: "Issued Credentials",
                            icon: Award,
                        },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                                activeTab === item.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && item.badge > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-6">
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Dashboard Overview
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Monitor your credential issuance activity
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {[
                                    {
                                        label: "Total Records",
                                        value: credentials.length,
                                        icon: FileText,
                                        color: "blue",
                                    },
                                    {
                                        label: "Active Schemas",
                                        value: schemas.length,
                                        icon: Settings,
                                        color: "purple",
                                    },
                                    {
                                        label: "Pending Requests",
                                        value: offers.filter(
                                            (o) => o.status === "pending"
                                        ).length,
                                        icon: Clock,
                                        color: "amber",
                                    },
                                    {
                                        label: "Total Issued",
                                        value: issuedCredentials.length,
                                        icon: Award,
                                        color: "emerald",
                                    },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="bg-white rounded-lg p-3 border border-gray-200"
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-lg bg-${stat.color}-50 flex items-center justify-center mb-2`}
                                        >
                                            <stat.icon
                                                className={`w-4 h-4 text-${stat.color}-600`}
                                            />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedItem(null);
                                        setShowModal("credential");
                                    }}
                                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                >
                                    <Plus className="w-6 h-6 text-gray-400 mb-2" />
                                    <div className="text-sm font-semibold text-gray-900">
                                        Add Credential Record
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Register holder information
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedItem(null);
                                        setShowModal("schema");
                                    }}
                                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                                >
                                    <Plus className="w-6 h-6 text-gray-400 mb-2" />
                                    <div className="text-sm font-semibold text-gray-900">
                                        Create Schema
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Build credential template
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveTab("offers")}
                                    className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-lg transition-all text-left"
                                >
                                    <Clock className="w-6 h-6 text-amber-600 mb-2" />
                                    <div className="text-sm font-semibold text-gray-900">
                                        Review Requests
                                    </div>
                                    <div className="text-xs text-amber-700">
                                        {
                                            offers.filter(
                                                (o) => o.status === "pending"
                                            ).length
                                        }{" "}
                                        pending
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Credential Records Tab */}
                    {activeTab === "credentials" && (
                        <motion.div
                            key="credentials"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Credential Records
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Manage holder credential information for
                                        verification
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedItem(null);
                                        setShowModal("credential");
                                    }}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Record
                                </button>
                            </div>

                            {/* Search and Filters */}
                            <div className="mb-4 grid grid-cols-4 gap-3">
                                <div className="col-span-2 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, ID, or any field..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(e.target.value as any)
                                    }
                                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                >
                                    <option value="all">All Types</option>
                                    {Object.keys(credentialTypeConfig).map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {
                                                    credentialTypeConfig[
                                                        type as CredentialType
                                                    ].label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Valid">Valid</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Revoked">Revoked</option>
                                </select>
                            </div>

                            {/* Credentials Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCredentials.map((cred) => {
                                    const config =
                                        credentialTypeConfig[cred.type];
                                    const data = cred.data as any;

                                    return (
                                        <div
                                            key={cred.id}
                                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg bg-${config.color}-50 flex items-center justify-center text-xl`}
                                                    >
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-sm">
                                                            {cred.holderName}
                                                        </h3>
                                                        <p className="text-xs text-gray-600">
                                                            {config.label}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        data.status ===
                                                            "Active" ||
                                                        data.status === "Valid"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : data.status ===
                                                              "Expired"
                                                            ? "bg-gray-100 text-gray-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {data.status}
                                                </span>
                                            </div>

                                            {/* Display key fields based on type */}
                                            <div className="space-y-1 mb-3 text-xs">
                                                {Object.entries(data)
                                                    .slice(0, 3)
                                                    .map(([key, value]) => (
                                                        <div
                                                            key={key}
                                                            className="flex justify-between"
                                                        >
                                                            <span className="text-gray-600">
                                                                {key}:
                                                            </span>
                                                            <span className="font-semibold text-gray-900 truncate ml-2">
                                                                {String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(cred);
                                                        setShowModal(
                                                            "credential"
                                                        );
                                                    }}
                                                    className="flex-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors text-xs flex items-center justify-center gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteCredential(
                                                            cred.id
                                                        )
                                                    }
                                                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors text-xs"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredCredentials.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600 text-sm">
                                        No credentials found
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Schema Builder Tab */}
                    {activeTab === "schemas" && (
                        <motion.div
                            key="schemas"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Schema Builder
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Create and manage schemas like
                                        Privado.id
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedItem(null);
                                        setShowModal("schema");
                                    }}
                                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Schema
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search schemas..."
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                />
                            </div>

                            {/* Schemas Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {schemas.map((schema) => {
                                    const config =
                                        credentialTypeConfig[schema.type];

                                    return (
                                        <div
                                            key={schema.id}
                                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-11 h-11 rounded-lg bg-${config.color}-50 flex items-center justify-center text-2xl`}
                                                    >
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-900">
                                                            {schema.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-600">
                                                            v{schema.version} •{" "}
                                                            {config.label}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-xs mb-3">
                                                {schema.description}
                                            </p>

                                            {/* Query Fields */}
                                            <div className="mb-3 p-3 rounded-lg bg-gray-50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-semibold text-gray-700">
                                                        QUERYABLE FIELDS
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(
                                                                schema
                                                            );
                                                            setShowModal(
                                                                "queryBuilder"
                                                            );
                                                        }}
                                                        className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                                                    >
                                                        Query Builder →
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    {schema.queryFields.map(
                                                        (field, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between text-xs"
                                                            >
                                                                <span className="font-mono text-gray-900">
                                                                    {field.name}
                                                                </span>
                                                                <div className="flex gap-1">
                                                                    {field.operators
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                op
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        op
                                                                                    }
                                                                                    className="px-1.5 py-0.5 rounded bg-white text-gray-600 text-xs"
                                                                                >
                                                                                    {
                                                                                        op
                                                                                    }
                                                                                </span>
                                                                            )
                                                                        )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-purple-50">
                                                <span className="text-xs text-gray-600">
                                                    Credentials Issued
                                                </span>
                                                <span className="text-lg font-bold text-purple-600">
                                                    {schema.credentialsIssued}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(schema);
                                                        setShowModal("schema");
                                                    }}
                                                    className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(schema);
                                                        setShowModal(
                                                            "queryBuilder"
                                                        );
                                                    }}
                                                    className="flex-1 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-colors text-xs"
                                                >
                                                    Query
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteSchema(schema.id)
                                                    }
                                                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors text-xs"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Pending Offers Tab */}
                    {activeTab === "offers" && (
                        <motion.div
                            key="offers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Pending Credential Requests
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Review, verify, and issue credentials
                                </p>
                            </div>

                            <div className="space-y-4">
                                {offers
                                    .filter((o) => o.status === "pending")
                                    .map((offer) => {
                                        const config =
                                            credentialTypeConfig[offer.type];
                                        const matchingCred = credentials.find(
                                            (c) =>
                                                c.holderId === offer.holderId &&
                                                c.type === offer.type
                                        );

                                        return (
                                            <div
                                                key={offer.id}
                                                className="bg-white rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`w-12 h-12 rounded-lg bg-${config.color}-50 flex items-center justify-center text-2xl flex-shrink-0`}
                                                    >
                                                        {config.icon}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="text-base font-bold text-gray-900">
                                                                    {
                                                                        offer.holderName
                                                                    }
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    Requesting{" "}
                                                                    {
                                                                        config.label
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500 font-mono mt-1">
                                                                    {offer.holderDID.substring(
                                                                        0,
                                                                        40
                                                                    )}
                                                                    ...
                                                                </p>
                                                            </div>
                                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                                                                Pending
                                                            </span>
                                                        </div>

                                                        {/* Data Comparison */}
                                                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                                                            {/* Provided Data */}
                                                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                                                <p className="text-xs font-semibold text-blue-900 mb-2">
                                                                    📤 PROVIDED
                                                                    DATA
                                                                </p>
                                                                <div className="space-y-1">
                                                                    {Object.entries(
                                                                        offer.providedData
                                                                    )
                                                                        .slice(
                                                                            0,
                                                                            5
                                                                        )
                                                                        .map(
                                                                            ([
                                                                                key,
                                                                                value,
                                                                            ]) => (
                                                                                <div
                                                                                    key={
                                                                                        key
                                                                                    }
                                                                                    className="flex justify-between text-xs"
                                                                                >
                                                                                    <span className="text-blue-700">
                                                                                        {
                                                                                            key
                                                                                        }
                                                                                        :
                                                                                    </span>
                                                                                    <span className="font-semibold text-blue-900">
                                                                                        {String(
                                                                                            value
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                </div>
                                                            </div>

                                                            {/* Stored Record */}
                                                            {matchingCred ? (
                                                                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                                                    <p className="text-xs font-semibold text-emerald-900 mb-2">
                                                                        ✅
                                                                        STORED
                                                                        RECORD
                                                                    </p>
                                                                    <div className="space-y-1">
                                                                        {Object.entries(
                                                                            matchingCred.data
                                                                        )
                                                                            .slice(
                                                                                0,
                                                                                5
                                                                            )
                                                                            .map(
                                                                                ([
                                                                                    key,
                                                                                    value,
                                                                                ]) => (
                                                                                    <div
                                                                                        key={
                                                                                            key
                                                                                        }
                                                                                        className="flex justify-between text-xs"
                                                                                    >
                                                                                        <span className="text-emerald-700">
                                                                                            {
                                                                                                key
                                                                                            }
                                                                                            :
                                                                                        </span>
                                                                                        <span
                                                                                            className={`font-semibold ${
                                                                                                offer
                                                                                                    .providedData[
                                                                                                    key
                                                                                                ] ===
                                                                                                value
                                                                                                    ? "text-emerald-900"
                                                                                                    : "text-red-600"
                                                                                            }`}
                                                                                        >
                                                                                            {String(
                                                                                                value
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                                                        <p className="text-xs text-gray-600">
                                                                            No
                                                                            stored
                                                                            record
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            Manual
                                                                            verification
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItem(
                                                                        offer
                                                                    );
                                                                    setShowModal(
                                                                        "issue"
                                                                    );
                                                                }}
                                                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-2 text-sm"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                Issue Credential
                                                            </button>
                                                            <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors flex items-center gap-2 text-sm">
                                                                <X className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {offers.filter((o) => o.status === "pending")
                                .length === 0 && (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600 text-sm">
                                        No pending requests
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Issued Credentials Tab */}
                    {activeTab === "issued" && (
                        <motion.div
                            key="issued"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Issued Credentials
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        View and manage all issued credentials
                                    </p>
                                </div>
                                <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Credential
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Holder
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Type
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Proof
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Storage
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Issued
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {issuedCredentials.map((issued) => {
                                            const config =
                                                credentialTypeConfig[
                                                    issued.type
                                                ];

                                            return (
                                                <tr
                                                    key={issued.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="font-mono text-xs text-gray-900">
                                                            {
                                                                issued.credentialId
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {issued.holderName}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono">
                                                            {issued.holderDID.substring(
                                                                0,
                                                                20
                                                            )}
                                                            ...
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base">
                                                                {config.icon}
                                                            </span>
                                                            <span className="text-xs font-medium text-gray-900">
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-gray-900">
                                                            {issued.proofType ===
                                                            "signature"
                                                                ? "🔑 Signature"
                                                                : "🛡️ MTP"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                issued.storageType ===
                                                                "onchain"
                                                                    ? "bg-purple-100 text-purple-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                            }`}
                                                        >
                                                            {issued.storageType}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-600">
                                                        {new Date(
                                                            issued.issuedDate
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                issued.status ===
                                                                "active"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : issued.status ===
                                                                      "revoked"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {issued.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            {issued.status ===
                                                                "active" && (
                                                                <button className="p-1.5 hover:bg-red-50 rounded text-red-600">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal === "credential" && (
                    <CredentialModal
                        credential={selectedItem}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                        onSave={(data) => {
                            console.log("Save credential:", data);
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showModal === "schema" && (
                    <SchemaModal
                        schema={selectedItem}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                        onSave={(data) => {
                            console.log("Save schema:", data);
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showModal === "queryBuilder" && selectedItem && (
                    <QueryBuilderModal
                        schema={selectedItem}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                    />
                )}

                {showModal === "issue" && selectedItem && (
                    <IssueCredentialModal
                        offer={selectedItem}
                        onClose={() => {
                            setShowModal(null);
                            setSelectedItem(null);
                        }}
                        onIssue={(options) => {
                            console.log("Issue credential:", options);
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

function CredentialModal({ credential, onClose, onSave }: any) {
    const [selectedType, setSelectedType] = useState<CredentialType>(
        credential?.type || "CitizenIdentity"
    );
    const [formData, setFormData] = useState<any>(credential?.data || {});

    const types = [
        "CitizenIdentity",
        "AcademyDegree",
        "HealthInsurance",
        "DriverLicense",
        "Passport",
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                        {credential ? "Edit" : "Add"} Credential Record
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Enter holder credential information
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Credential Type
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {types.map((type) => (
                                <button
                                    key={type}
                                    onClick={() =>
                                        setSelectedType(type as CredentialType)
                                    }
                                    className={`p-3 rounded-lg border-2 transition-all text-xs ${
                                        selectedType === type
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {type === "CitizenIdentity" && "🆔"}
                                    {type === "AcademyDegree" && "🎓"}
                                    {type === "HealthInsurance" && "🏥"}
                                    {type === "DriverLicense" && "🚗"}
                                    {type === "Passport" && "✈️"}
                                    <div className="mt-1 font-medium">
                                        {type}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                        Selected:{" "}
                        <span className="font-semibold">{selectedType}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() =>
                                onSave({ type: selectedType, data: formData })
                            }
                            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Save Record
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function SchemaModal({ schema, onClose, onSave }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-2xl w-full"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                        {schema ? "Edit" : "Create"} Schema
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Build credential schema template
                    </p>
                </div>

                <div className="p-6">
                    <div className="text-sm text-gray-600 mb-4">
                        Schema builder interface here...
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave({})}
                            className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        >
                            Save Schema
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function QueryBuilderModal({ schema, onClose }: any) {
    const [queryRules, setQueryRules] = useState<any[]>([
        { field: "", operator: "", value: "" },
    ]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                        Query Builder
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Build verification queries for {schema.name}
                    </p>
                </div>

                <div className="p-6">
                    <div className="space-y-3">
                        {queryRules.map((rule, idx) => (
                            <div
                                key={idx}
                                className="flex gap-3 p-3 rounded-lg bg-gray-50"
                            >
                                <select
                                    value={rule.field}
                                    onChange={(e) => {
                                        const newRules = [...queryRules];
                                        newRules[idx].field = e.target.value;
                                        setQueryRules(newRules);
                                    }}
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                >
                                    <option value="">Select Field</option>
                                    {schema.queryFields.map((field: any) => (
                                        <option
                                            key={field.name}
                                            value={field.name}
                                        >
                                            {field.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={rule.operator}
                                    onChange={(e) => {
                                        const newRules = [...queryRules];
                                        newRules[idx].operator = e.target.value;
                                        setQueryRules(newRules);
                                    }}
                                    className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                >
                                    <option value="">Operator</option>
                                    <option value="$eq">Equal</option>
                                    <option value="$ne">Not Equal</option>
                                    <option value="$lt">Less Than</option>
                                    <option value="$gt">Greater Than</option>
                                    <option value="$gte">
                                        Greater or Equal
                                    </option>
                                    <option value="$lte">Less or Equal</option>
                                </select>

                                <input
                                    type="text"
                                    value={rule.value}
                                    onChange={(e) => {
                                        const newRules = [...queryRules];
                                        newRules[idx].value = e.target.value;
                                        setQueryRules(newRules);
                                    }}
                                    placeholder="Value"
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                />

                                <button
                                    onClick={() =>
                                        setQueryRules(
                                            queryRules.filter(
                                                (_, i) => i !== idx
                                            )
                                        )
                                    }
                                    className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() =>
                            setQueryRules([
                                ...queryRules,
                                { field: "", operator: "", value: "" },
                            ])
                        }
                        className="mt-3 px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Rule
                    </button>

                    {/* Generated Query Preview */}
                    <div className="mt-4 p-4 rounded-lg bg-gray-900 text-white">
                        <p className="text-xs text-gray-400 mb-2">
                            Generated Query JSON:
                        </p>
                        <pre className="text-xs font-mono overflow-x-auto">
                            {JSON.stringify(
                                {
                                    credentialSubject: queryRules.reduce(
                                        (acc, rule) => {
                                            if (rule.field && rule.operator) {
                                                acc[rule.field] = {
                                                    [rule.operator]: rule.value,
                                                };
                                            }
                                            return acc;
                                        },
                                        {}
                                    ),
                                },
                                null,
                                2
                            )}
                        </pre>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold"
                        >
                            Close
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        >
                            Save Query
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function IssueCredentialModal({ offer, onClose, onIssue }: any) {
    const [options, setOptions] = useState({
        proofType: "signature" as "signature" | "mtp",
        storageType: "offchain" as "offchain" | "onchain",
        expirationDate: "",
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-2xl w-full"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">
                        Issue Verifiable Credential
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Configure issuance options for {offer.holderName}
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Proof Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Proof Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() =>
                                    setOptions({
                                        ...options,
                                        proofType: "signature",
                                    })
                                }
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    options.proofType === "signature"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Key className="w-5 h-5 text-blue-600" />
                                    <h4 className="font-bold text-gray-900 text-sm">
                                        Signature-Based
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Sign with issuer's private key
                                </p>
                            </button>
                            <button
                                onClick={() =>
                                    setOptions({ ...options, proofType: "mtp" })
                                }
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    options.proofType === "mtp"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    <h4 className="font-bold text-gray-900 text-sm">
                                        MTP-Based
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Merkle tree proof with state
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Storage Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Storage Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() =>
                                    setOptions({
                                        ...options,
                                        storageType: "offchain",
                                    })
                                }
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    options.storageType === "offchain"
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <h4 className="font-bold text-gray-900 text-sm mb-1">
                                    Off-Chain
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Store in database (faster, cheaper)
                                </p>
                            </button>
                            <button
                                onClick={() =>
                                    setOptions({
                                        ...options,
                                        storageType: "onchain",
                                    })
                                }
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    options.storageType === "onchain"
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <h4 className="font-bold text-gray-900 text-sm mb-1">
                                    On-Chain
                                </h4>
                                <p className="text-xs text-gray-600">
                                    Store on blockchain (more secure)
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Expiration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Expiration Date (Optional)
                        </label>
                        <input
                            type="date"
                            value={options.expirationDate}
                            onChange={(e) =>
                                setOptions({
                                    ...options,
                                    expirationDate: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>

                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm">
                            Issuance Summary
                        </h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Proof Type:
                                </span>
                                <span className="font-semibold text-gray-900">
                                    {options.proofType === "signature"
                                        ? "Signature-Based"
                                        : "MTP-Based"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Storage:</span>
                                <span className="font-semibold text-gray-900">
                                    {options.storageType === "offchain"
                                        ? "Off-Chain"
                                        : "On-Chain"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Expires:</span>
                                <span className="font-semibold text-gray-900">
                                    {options.expirationDate || "Never"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onIssue(options)}
                            className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            <Award className="w-4 h-4" />
                            Issue Credential
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
