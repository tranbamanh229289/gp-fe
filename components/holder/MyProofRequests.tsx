import { CheckCircle, Eye, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { ProofRequest } from "@/app/holder/page";
import { HolderModal } from "@/constants/holder";

interface MyProofRequestsProp {
    setShowModal: (modal: HolderModal) => void;
}

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

export default function MyProofRequests({ setShowModal }: MyProofRequestsProp) {
    return (
        <motion.div
            key="proofs"
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

            <div className="space-y-4">
                {proofRequests.map((proof) => (
                    <motion.div
                        key={proof.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-xl p-5 border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {proof.verifier}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {proof.requestType}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                        proof.requestedDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                    proof.status === "pending"
                                        ? "bg-amber-100 text-amber-700 border-amber-300"
                                        : proof.status === "verified"
                                        ? "bg-green-100 text-green-700 border-green-300"
                                        : "bg-red-100 text-red-700 border-red-300"
                                }`}
                            >
                                {proof.status}
                            </span>
                        </div>

                        <div className="mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                                REQUIREMENTS
                            </p>
                            <ul className="space-y-1">
                                {proof.requirements.map((req, idx) => (
                                    <li
                                        key={idx}
                                        className="text-sm text-gray-900 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedItem(proof);
                                    setShowModal(
                                        HolderModal.ProofRequestDetail
                                    );
                                }}
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all flex items-center justify-center gap-2 border border-gray-300"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </motion.button>
                            {proof.status === "pending" && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedItem(proof);
                                        setShowModal(
                                            HolderModal.ProofRequestDetail
                                        );
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                                >
                                    <Shield className="w-4 h-4" />
                                    Generate Proof
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
