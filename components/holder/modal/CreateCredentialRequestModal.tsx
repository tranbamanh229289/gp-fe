import { DocumentType } from "@/constants/document";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

export default function CreateCredentialRequestModal({
    onClose,
    onSubmit,
}: any) {
    const [selectedType, setSelectedType] = useState<DocumentType>(
        DocumentType.CitizenIdentity
    );
    const [issuerDID, setIssuerDID] = useState("");
    const [formData, setFormData] = useState<any>({});

    const credentialFields: Record<CredentialType, string[]> = {
        CitizenIdentity: [
            "id",
            "name",
            "gender",
            "placeOfBirth",
            "dateOfBirth",
            "issueDate",
            "expiryDate",
        ],
        AcademyDegree: [
            "degreeNumber",
            "degreeType",
            "major",
            "university",
            "cpa",
            "graduateYear",
            "classification",
        ],
        HealthInsurance: [
            "insuranceNumber",
            "insuranceType",
            "hospital",
            "startDate",
            "expiryDate",
        ],
        DriverLicense: [
            "driverNumber",
            "class",
            "point",
            "issueDate",
            "expiryDate",
        ],
        Passport: [
            "passportNumber",
            "nationality",
            "mrz",
            "issueDate",
            "expiryDate",
        ],
    };

    const typeIcons = {
        CitizenIdentity: "🆔",
        AcademyDegree: "🎓",
        HealthInsurance: "🏥",
        DriverLicense: "🚗",
        Passport: "✈️",
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl"
            >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Create Credential Request
                    </h3>
                    <p className="text-sm text-gray-600">
                        Select type and provide issuer information
                    </p>
                </div>

                <div className="p-6">
                    {/* Credential Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Credential Type
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(typeIcons).map(([type, icon]) => (
                                <motion.button
                                    key={type}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setSelectedType(type as CredentialType)
                                    }
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        selectedType === type
                                            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{icon}</div>
                                    <div className="text-xs text-gray-900">
                                        {type}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Issuer DID */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Issuer DID
                        </label>
                        <input
                            type="text"
                            value={issuerDID}
                            onChange={(e) => setIssuerDID(e.target.value)}
                            placeholder="did:polygonid:polygon:mumbai:..."
                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm transition-all"
                        />
                    </div>

                    {/* Credential Data Fields */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Credential Data
                        </label>
                        <div className="space-y-3">
                            {credentialFields[selectedType].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        {field}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData[field] || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [field]: e.target.value,
                                            })
                                        }
                                        placeholder={`Enter ${field}`}
                                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold transition-all"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                                onSubmit({
                                    type: selectedType,
                                    issuerDID,
                                    data: formData,
                                })
                            }
                            className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                        >
                            <Send className="w-5 h-5" />
                            Submit Request
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
