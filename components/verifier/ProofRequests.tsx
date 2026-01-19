import {
    Shield,
    Calendar,
    Timer,
    Users,
    Eye,
    ArrowRight,
    Trash2,
    Building,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCredentialZKProofStore } from "@/store/credential_zkproof.store";
import { useEffect, useState } from "react";
import { ProofRequest } from "@/types/credential_zkproof";
import { VerifierModal } from "@/constants/verifier";
import ProofRequestDetailModal from "./modal/ProofRequestDetailModal";
import {
    ProofRequestStatus,
    proofRequestStatusConfig,
} from "@/constants/credential_zkproof";
import DeleteModal from "./modal/DeleteModal";
import { formatDate, isExpired } from "@/helper/dateTime";

interface ProofRequestsProp {
    modal: VerifierModal;
    setModal: (modal: VerifierModal) => void;
}

export default function ProofRequests({ modal, setModal }: ProofRequestsProp) {
    const proofRequests = useCredentialZKProofStore(
        (state) => state.proofRequests,
    );
    const getAllZkProofRequests = useCredentialZKProofStore(
        (state) => state.getAllZkProofRequests,
    );
    const updateZkProofRequest = useCredentialZKProofStore(
        (state) => state.updateZkProofRequest,
    );

    const [selectedRequest, setSelectedRequest] = useState<ProofRequest | null>(
        null,
    );

    const removeProofRequest = async () => {
        try {
            await updateZkProofRequest(
                selectedRequest?.id ?? "",
                ProofRequestStatus.Cancelled,
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllZkProofRequests();
    }, []);

    return (
        <div>
            <motion.div
                key="requests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {proofRequests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            No Proof Requests
                        </h3>
                        <p className="text-sm text-gray-600">
                            Create a new proof request to get started
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proofRequests.map((request, idx) => {
                            const statusConfig =
                                proofRequestStatusConfig[request.status];
                            const StatusIcon = statusConfig.icon;
                            const expired = isExpired(request.expiresTime);

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{
                                        y: -4,
                                        boxShadow:
                                            "0 12px 24px -8px rgba(0,0,0,0.12)",
                                    }}
                                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col"
                                >
                                    <div className="p-5 flex flex-col flex-1 ">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {request.message ||
                                                        "ZKP Proof Request"}
                                                </h3>

                                                {request.reason && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {request.reason}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusConfig.color} flex items-center gap-1`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {request.status}
                                                </span>

                                                {expired && (
                                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded font-semibold border border-rose-300">
                                                        Expired
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info Section */}
                                        <div className="space-y-2 mb-4 flex-1">
                                            <div className="flex items-start gap-2 text-sm">
                                                <Building className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-700 truncate">
                                                        {request.verifierName ||
                                                            "Unknown Verifier"}
                                                    </div>
                                                    <code className="text-xs font-mono text-gray-500 truncate block">
                                                        {request.verifierDID}
                                                    </code>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded truncate">
                                                    {request.circuitId}
                                                </code>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="space-y-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>
                                                        {formatDate(
                                                            request.createdTime,
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`flex items-center gap-1 ${
                                                        expired
                                                            ? "text-rose-600"
                                                            : ""
                                                    }`}
                                                >
                                                    <Timer className="w-3.5 h-3.5" />
                                                    <span>
                                                        {formatDate(
                                                            request.expiresTime,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setSelectedRequest(
                                                            request,
                                                        );
                                                        setModal(
                                                            VerifierModal.ProofRequestDetail,
                                                        );
                                                    }}
                                                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setSelectedRequest(
                                                            request,
                                                        );
                                                        setModal(
                                                            VerifierModal.DeleteProofRequest,
                                                        );
                                                    }}
                                                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Cancel
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
                {modal == VerifierModal.ProofRequestDetail && (
                    <ProofRequestDetailModal
                        selectedRequest={selectedRequest as ProofRequest}
                        onClose={() => {
                            setModal(VerifierModal.Null);
                            setSelectedRequest(null);
                        }}
                    />
                )}{" "}
                {modal == VerifierModal.DeleteProofRequest && (
                    <DeleteModal
                        onClose={() => {
                            setModal(VerifierModal.Null);
                            setSelectedRequest(null);
                        }}
                        onConfirm={removeProofRequest}
                    />
                )}
            </motion.div>
        </div>
    );
}
