import { Car, Download, Eye, LucideProps, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { DocumentType } from "@/constants/document";
import { IssuedCredential } from "@/types/credential_request";

interface VerifiableCredentialProp {
    credentialTypeConfig: Record<
        string,
        {
            icon: React.ComponentType<LucideProps>;
            label: string;
            color: string;
            gradient: string;
        }
    >;
}
export default function VerifiableCredential({
    credentialTypeConfig,
}: VerifiableCredentialProp) {
    const [issuedCredentials] = useState<IssuedCredential[]>([
        {
            id: 1,
            credentialId: "CRED-000001",
            holderName: "Alice Johnson",
            holderDID:
                "did:polygonid:polygon:mumbai:2qCU58EJgrELNZCDkSU23dQHZsBgAFWLNpNezo1Y6N",
            type: DocumentType.CitizenIdentity,
            proofType: "signature",
            storageType: "offchain",
            issuedDate: "2024-01-15",
            expiryDate: "2030-01-15",
            status: "active",
        },
        {
            id: 2,
            credentialId: "CRED-000002",
            holderName: "Bob Smith",
            holderDID:
                "did:polygonid:polygon:mumbai:2qH7XAwYQzCp9VfhpNgeLtK2iCehDDrfMWUCEg5ig5",
            type: DocumentType.DriverLicense,
            proofType: "mtp",
            storageType: "onchain",
            issuedDate: "2024-02-20",
            expiryDate: "2032-02-20",
            status: "active",
        },
    ]);

    return (
        <motion.div
            key="issued"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Issued Credentials
                    </h2>
                    <p className="text-gray-600">
                        View and manage all issued credentials
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-bold flex items-center gap-2 transition-all"
                >
                    <Download className="w-5 h-5" />
                    Export
                </motion.button>
            </div>

            {/* Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Credential
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Holder
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Proof
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Storage
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Issued
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {issuedCredentials.map((issued) => {
                                const config =
                                    credentialTypeConfig[issued.type];
                                const IconComponent = config.icon;

                                return (
                                    <tr
                                        key={issued.id}
                                        className="hover:bg-blue-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-sm font-bold text-gray-900">
                                                {issued.credentialId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">
                                                {issued.holderName}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono mt-1">
                                                {issued.holderDID.substring(
                                                    0,
                                                    25
                                                )}
                                                ...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
                                                >
                                                    <IconComponent className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {config.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                                    issued.proofType ===
                                                    "signature"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}
                                            >
                                                {issued.proofType ===
                                                "signature"
                                                    ? "Signature"
                                                    : "MTP"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                                    issued.storageType ===
                                                    "onchain"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {issued.storageType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(
                                                issued.issuedDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                    issued.status === "active"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : issued.status ===
                                                          "revoked"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {issued.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                {issued.status === "active" && (
                                                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
