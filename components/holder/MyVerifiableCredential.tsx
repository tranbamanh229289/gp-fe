import { Credential } from "@/app/holder/page";
import { HolderModal } from "@/constants/holder";
import { motion } from "framer-motion";
import { Award, LucideProps } from "lucide-react";

interface MyVerifiableCredentialProp {
    credentialTypeConfig: Record<
        string,
        {
            icon: string;
            label: string;
            color: string;
        }
    >;
    setShowModal: (modal: HolderModal) => void;
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

export default function MyVerifiableCredential({
    credentialTypeConfig,
    setShowModal,
}: MyVerifiableCredentialProp) {
    return (
        <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {credentials.map((cred) => {
                    const config = credentialTypeConfig[cred.type];

                    return (
                        <motion.div
                            key={cred.id}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => {
                                setSelectedItem(cred);
                                setShowModal(
                                    HolderModal.CredentialRequestDetail
                                );
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl border border-blue-300 shadow-sm">
                                        {config.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {config.label}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {cred.issuer}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        cred.status === "active"
                                            ? "bg-green-100 text-green-700 border border-green-300"
                                            : cred.status === "expired"
                                            ? "bg-gray-100 text-gray-700 border border-gray-300"
                                            : "bg-red-100 text-red-700 border border-red-300"
                                    }`}
                                >
                                    {cred.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                {Object.entries(cred.data)
                                    .slice(0, 3)
                                    .map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between"
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

                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                                <div className="text-gray-600">
                                    Issued:{" "}
                                    {new Date(
                                        cred.issuedDate
                                    ).toLocaleDateString()}
                                </div>
                                <div className="text-blue-600 font-semibold">
                                    {cred.proofType === "signature"
                                        ? "🔑 Signature"
                                        : "🛡️ MTP"}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {credentials.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No credentials yet</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
