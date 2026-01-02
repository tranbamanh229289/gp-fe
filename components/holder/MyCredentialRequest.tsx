import {
    Award,
    CheckCircle,
    Clock,
    Info,
    LucideProps,
    XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { CredentialRequest } from "@/app/holder/page";

interface MyCredentialRequestsProp {
    credentialTypeConfig: Record<
        string,
        {
            icon: string;
            label: string;
            color: string;
        }
    >;
}

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

export default function MyCredentialRequest({
    credentialTypeConfig,
}: MyCredentialRequestsProp) {
    return (
        <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    My Credential Requests
                </h2>
                <p className="text-sm text-gray-600">
                    Track your credential requests status
                </p>
            </div>

            <div className="space-y-4">
                {requests.map((request) => {
                    const config = credentialTypeConfig[request.type];

                    return (
                        <motion.div
                            key={request.id}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl flex-shrink-0 border border-blue-300 shadow-sm">
                                    {config.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {config.label}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {request.issuer}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Requested:{" "}
                                                {new Date(
                                                    request.requestedDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                request.status === "pending"
                                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                                    : request.status ===
                                                      "approved"
                                                    ? "bg-blue-100 text-blue-700 border-blue-300"
                                                    : request.status ===
                                                      "issued"
                                                    ? "bg-green-100 text-green-700 border-green-300"
                                                    : "bg-red-100 text-red-700 border-red-300"
                                            }`}
                                        >
                                            {request.status === "pending" && (
                                                <Clock className="w-3 h-3 inline mr-1" />
                                            )}
                                            {request.status === "approved" && (
                                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                            )}
                                            {request.status === "issued" && (
                                                <Award className="w-3 h-3 inline mr-1" />
                                            )}
                                            {request.status === "rejected" && (
                                                <XCircle className="w-3 h-3 inline mr-1" />
                                            )}
                                            {request.status}
                                        </span>
                                    </div>

                                    {/* Provided Data */}
                                    <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">
                                            PROVIDED DATA
                                        </p>
                                        <div className="space-y-1">
                                            {Object.entries(
                                                request.providedData
                                            ).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-gray-600">
                                                        {key}:
                                                    </span>
                                                    <span className="text-gray-900 font-semibold">
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {request.message && (
                                        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-700">
                                                    {request.message}
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
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No requests yet</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
