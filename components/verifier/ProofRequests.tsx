import {
    Shield,
    Calendar,
    Timer,
    Eye,
    Trash2,
    Building,
    FileText,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCredentialZKProofStore } from "@/store/credential_zkproof.store";
import { useEffect, useState } from "react";
import { ProofRequest } from "@/types/credential_proof";
import { VerifierModal } from "@/constants/verifier";
import ProofRequestDetailModal from "./modal/ProofRequestDetailModal";
import {
    ProofRequestStatus,
    proofRequestStatusConfig,
    proofTypeConfig,
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
                key="proofs-requests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Proof Requests
                    </h2>
                    <p className="text-sm text-gray-600">
                        Generate zero-knowledge proofs for verifiers
                    </p>
                </div>

                {proofRequests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            No Proof Requests
                        </h3>
                        <p className="text-gray-600 font-medium">
                            Create a new proof request to get started
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {proofRequests.map((request, idx) => {
                            const statusConfig =
                                proofRequestStatusConfig[request.status];

                            const StatusIcon = statusConfig.icon;
                            const ProofTypeIcon =
                                proofTypeConfig[request.proofType].icon;
                            const expired = isExpired(request.expiresTime);

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">
                                                    {request.message ||
                                                        "ZKP Proof Request"}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Zero-Knowledge Proof
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-end">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${statusConfig.color}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {request.status}
                                            </span>
                                            {expired && (
                                                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-bold border border-rose-300">
                                                    Expired
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Fields */}
                                    <div className="space-y-2 mb-4">
                                        {/* Reason */}
                                        {request.reason && (
                                            <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                                <span className="text-sm text-gray-600 font-medium mb-1 block">
                                                    Reason:
                                                </span>
                                                <p className="text-sm text-gray-900 line-clamp-2">
                                                    {request.reason}
                                                </p>
                                            </div>
                                        )}

                                        {/* Verifier */}
                                        <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2 mb-1.5">
                                                <Building className="w-4 h-4 text-indigo-600" />
                                                Verifier:
                                            </span>
                                            <div className="font-semibold text-gray-900 text-sm mb-1">
                                                {request.verifierName ||
                                                    "Unknown Verifier"}
                                            </div>
                                            <code className="text-xs font-mono text-gray-500 block truncate">
                                                {request.verifierDID}
                                            </code>
                                        </div>

                                        {/* Circuit ID */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-blue-600" />
                                                Circuit:
                                            </span>
                                            <code className="text-xs font-mono text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200 truncate max-w-[60%]">
                                                {request.circuitId}
                                            </code>
                                        </div>

                                        {/* Proof Type */}
                                        <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                            <span className="text-sm text-gray-600 font-medium mb-2 block">
                                                Proof Type:
                                            </span>
                                            <span
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 ${
                                                    proofTypeConfig[
                                                        request.proofType
                                                    ].color
                                                }`}
                                            >
                                                <ProofTypeIcon className="w-4 h-4" />
                                                {request.proofType}
                                            </span>
                                        </div>

                                        {/* Created & Expires - Same Row */}
                                        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                            {/* Created - Left */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Created:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatDate(
                                                        request.createdTime,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Expires - Right */}
                                            <div className="flex items-center gap-2">
                                                <Timer
                                                    className={`w-4 h-4 ${
                                                        expired
                                                            ? "text-rose-600"
                                                            : "text-amber-600"
                                                    }`}
                                                />
                                                <span className="text-sm text-gray-600 font-medium">
                                                    Expires:
                                                </span>
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        expired
                                                            ? "text-rose-700"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {formatDate(
                                                        request.expiresTime,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setModal(
                                                    VerifierModal.ProofRequestDetail,
                                                );
                                            }}
                                            className="flex-1 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setModal(
                                                    VerifierModal.DeleteProofRequest,
                                                );
                                            }}
                                            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Modals */}
                {modal === VerifierModal.ProofRequestDetail && (
                    <ProofRequestDetailModal
                        selectedRequest={selectedRequest as ProofRequest}
                        onClose={() => {
                            setModal(VerifierModal.Null);
                            setSelectedRequest(null);
                        }}
                    />
                )}

                {modal === VerifierModal.DeleteProofRequest && (
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
