import { CredentialRequest } from "@/types/credential_request";
import { motion } from "framer-motion";

interface CredentialRequestDetailModalProp {
    credentialRequest: CredentialRequest;
    onClose: () => void;
}
export default function CredentialRequestDetailModal({
    credentialRequest,
    onClose,
}: CredentialRequestDetailModalProp) {
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
                className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl"
            >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Credential Details
                    </h3>
                    <p className="text-sm text-gray-600">
                        {credentialRequest.documentType}
                    </p>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="text-xs text-gray-600 mb-1">Issuer</p>
                            <p className="text-sm text-gray-900 font-semibold">
                                {credentialRequest.issuerName}
                            </p>
                            <p className="text-xs text-gray-600 font-mono mt-1">
                                {credentialRequest.issuerDID}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <p className="text-xs text-gray-600 mb-1">
                                    Issued Date
                                </p>
                                <p className="text-sm text-gray-900 font-semibold">
                                    {new Date(
                                        credentialRequest.createdTime
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <p className="text-xs text-gray-600 mb-1">
                                    Expiry Date
                                </p>
                                <p className="text-sm text-gray-900 font-semibold">
                                    {credentialRequest.expiresTime
                                        ? new Date(
                                              credentialRequest.expiresTime
                                          ).toLocaleDateString()
                                        : "Never"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full mt-6 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-all border border-gray-300"
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
