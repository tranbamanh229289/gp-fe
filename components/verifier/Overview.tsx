import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { VerifierActiveTab, VerifierModal } from "@/constants/verifier";

interface OverviewProp {
    setActiveTab: (activeTab: VerifierActiveTab) => void;
    setModal: (modal: VerifierModal) => void;
    getStatusBadge: (status: string) => string;
}
const submissions = [
    {
        id: 1,
        holder: "0x742d...89A3",
        holder_name: "Alice Johnson",
        request_name: "Age Verification 18+",
        status: "pending",
        timestamp: "2 minutes ago",
    },
];

const proofRequests = [
    {
        id: 1,
        name: "Age Verification 18+",
        description: "Verify user is 18 years or older",
        submissions: 523,
        verified: 498,
        created_at: "2024-11-15",
        status: "active",
    },
];

export default function Overview({
    setActiveTab,
    setModal,
    getStatusBadge,
}: OverviewProp) {
    return (
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
                                        sub.status === "verified"
                                            ? "bg-emerald-50"
                                            : sub.status === "pending"
                                            ? "bg-amber-50"
                                            : "bg-red-50"
                                    } flex items-center justify-center`}
                                >
                                    {sub.status === "verified" ? (
                                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                                    ) : sub.status === "pending" ? (
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
                        {proofRequests.slice(0, 3).map((req, idx) => (
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
                                            {req.submissions} submissions
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-600 font-semibold">
                                        {Math.round(
                                            (req.verified / req.submissions) *
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
                        Create custom proof requests to verify user credentials
                        with zero-knowledge proofs.
                    </p>
                    <button
                        onClick={() => {
                            setActiveTab(VerifierActiveTab.ProofRequests);
                            setModal(VerifierModal.CreateRequest);
                        }}
                        className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                    >
                        Create Proof Request
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
