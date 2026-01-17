import {
    AlertTriangle,
    ArrowUpRight,
    CheckCircle,
    Clock,
    Filter,
} from "lucide-react";
import { motion } from "framer-motion";

interface SubmissionsProp {}
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

export default function Submissions({}: SubmissionsProp) {
    return (
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
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="font-semibold text-gray-900">
                                                {sub.holder_name}
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
                                        {/* <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                                sub.status
                                            )} mt-1`}
                                        >
                                            {sub.status}
                                        </span> */}
                                    </div>

                                    {sub.status === "pending" && (
                                        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                                            Verify
                                        </button>
                                    )}
                                    {sub.status !== "pending" && (
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
    );
}
