import {
    Award,
    Clock,
    FileText,
    Plus,
    Settings,
    TrendingUp,
    Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import {
    IssuerActiveTab,
    IssuerItemSelectedType,
    IssuerModal,
} from "@/constants/issuer";
import { useDocumentStore } from "@/store/document.store";
import { DocumentType } from "@/constants/document";

interface OverviewProp {
    setActiveTab: (activeTab: IssuerActiveTab) => void;
    setShowModal: (modal: IssuerModal) => void;
    setItemSelectedType: (itemSelectedType: IssuerItemSelectedType) => void;
}

export default function Overview({
    setActiveTab,
    setShowModal,
    setItemSelectedType,
}: OverviewProp) {
    // hook
    const { total } = useDocumentStore();

    return (
        <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        >
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Dashboard Overview
                </h2>
                <p className="text-gray-600">
                    Monitor your credential issuance activity
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
                {[
                    {
                        label: "Total Records",
                        value: total(),
                        icon: FileText,
                        gradient: "from-blue-500 to-cyan-500",
                        change: "+12%",
                    },
                    {
                        label: "Active Schemas",
                        value: 0,
                        icon: Settings,
                        gradient: "from-purple-500 to-pink-500",
                        change: "+3%",
                    },
                    {
                        label: "Pending Requests",
                        value: 0,
                        icon: Clock,
                        gradient: "from-amber-500 to-orange-500",
                        change: "-5%",
                    },
                    {
                        label: "Total Issued",
                        value: 0,
                        icon: Award,
                        gradient: "from-emerald-500 to-teal-500",
                        change: "+8%",
                    },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <TrendingUp className="w-3 h-3" />
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-4 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setItemSelectedType(DocumentType.CitizenIdentity);
                            setShowModal(IssuerModal.CreateDocument);
                        }}
                        className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left group shadow-lg"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-base font-bold text-gray-900 mb-2">
                            Add Document Record
                        </div>
                        <div className="text-sm text-gray-600">
                            Register holder information
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setShowModal(IssuerModal.CreateSchema);
                        }}
                        className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-left group shadow-lg"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-base font-bold text-gray-900 mb-2">
                            Create Schema
                        </div>
                        <div className="text-sm text-gray-600">
                            Build credential template
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                            setActiveTab(IssuerActiveTab.CredentialRequest)
                        }
                        className="p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-left group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-base font-bold mb-2">
                            Review Requests
                        </div>
                        <div className="text-sm text-white/90">
                            {1} pending requests
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                            setActiveTab(IssuerActiveTab.VerifiableCredential)
                        }
                        className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-left group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-base font-bold mb-2">
                            Issued Credential
                        </div>
                        <div className="text-sm text-white/90">
                            {1} Issued Credential
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        Recent Activity
                    </h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        View all →
                    </button>
                </div>
                <div className="space-y-3">
                    {[
                        {
                            action: "Issued credential",
                            name: "Alice Johnson",
                            type: "Citizen Identity",
                            time: "2 hours ago",
                        },
                        {
                            action: "Created schema",
                            name: "Driver License v2",
                            type: "Schema",
                            time: "5 hours ago",
                        },
                        {
                            action: "Reviewed request",
                            name: "Bob Smith",
                            type: "Academic Degree",
                            time: "1 day ago",
                        },
                    ].map((activity, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {activity.action} • {activity.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {activity.type}
                                </p>
                            </div>
                            <div className="text-xs text-gray-500">
                                {activity.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
