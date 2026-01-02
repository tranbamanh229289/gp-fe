import { MoreVertical, QrCode, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProofRequestsProp {
    getStatusBadge: (status: string) => string;
}

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

export default function ProofRequests({ getStatusBadge }: ProofRequestsProp) {
    return (
        <motion.div
            key="requests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-6"
        >
            {proofRequests.map((request, idx) => (
                <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {request.name}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                        request.status
                                    )}`}
                                >
                                    {request.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                                {request.description}
                            </p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-gray-50">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {request.submissions}
                            </div>
                            <div className="text-xs text-gray-600">
                                Submissions
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {request.verified}
                            </div>
                            <div className="text-xs text-gray-600">
                                Verified
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {Math.round(
                                    (request.verified / request.submissions) *
                                        100
                                )}
                                %
                            </div>
                            <div className="text-xs text-gray-600">Success</div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm flex items-center justify-center gap-2">
                            View Details
                        </button>
                        <button className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm flex items-center justify-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                        <span>
                            Created{" "}
                            {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <span>
                            ID: #{request.id.toString().padStart(4, "0")}
                        </span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
