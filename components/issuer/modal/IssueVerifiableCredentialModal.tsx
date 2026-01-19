import { motion } from "framer-motion";
import {
    X,
    CheckCircle,
    Send,
    FileText,
    User,
    ExternalLink,
    Clock,
    Loader2,
    Key,
    AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CredentialRequest } from "@/types/credential_request";
import { useDocumentStore } from "@/store/document.store";
import { DocumentData } from "@/types/document";
import { useVerifiableCredential } from "@/store/verifiable_credential.store";
import { useSchemaStore } from "@/store/schema.store";
import { Attribute } from "@/types/schema";
import { convertValue } from "@/helper/convertValue";
import { credentialTypeConfig } from "@/constants/issuer";
import { useIdentityStore } from "@/store/identity.store";
import { getPublicKey } from "@/helper/babyjub";
import { formatDate } from "@/helper/dateTime";

interface ReviewCredentialRequestModalProps {
    request: CredentialRequest;
    onClose: () => void;
}

export function ReviewCredentialRequestModal({
    request,
    onClose,
}: ReviewCredentialRequestModalProps) {
    const [credentialData, setCredentialData] = useState<DocumentData>({});
    const [schemaAttributes, setSchemaAttributes] = useState<Attribute[]>([]);
    const [privateKey, setPrivateKey] = useState<string>("");
    const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
    const [formError, setFormError] = useState<string>("");

    const config = credentialTypeConfig[request.documentType];

    const fetchDocumentByHolderDID = useDocumentStore(
        (state) => state.fetchDocumentByHolderDID,
    );
    const fetchSchemaAttributes = useSchemaStore(
        (state) => state.fetchSchemaAttributes,
    );

    const issueVerifiableClaim = useVerifiableCredential(
        (state) => state.issueVerifiableCredential,
    );
    const issueLoading = useVerifiableCredential((state) => state.loading);
    const publicKey = useIdentityStore((state) => state.publicKey);

    const getCredentialData = (): Record<string, any> => {
        return schemaAttributes.reduce((acc, item) => {
            const value = credentialData[item.name as keyof DocumentData];
            acc[item.name] = convertValue(value, item.type);
            return acc;
        }, {} as Record<string, any>);
    };

    const handleConfirm = async () => {
        if (isValid()) {
            setFormError("");
            try {
                if (!privateKey) throw new Error("Missing private key");
                const data = getCredentialData();

                await issueVerifiableClaim(request, data, privateKey);
            } catch (err) {
                console.error("Issue credential failed:", err);
            }

            setShowPrivateKeyModal(false);
            onClose();
        } else {
            setFormError("invalid private key");
        }
    };

    const handleIssueCredential = () => {
        setShowPrivateKeyModal(true);
    };

    const isValid = (): boolean => {
        const parsePublicKey = getPublicKey(privateKey);

        const publicKeyX = publicKey?.x ?? "";
        const publicKeyY = publicKey?.y ?? "";
        if (parsePublicKey.x != publicKeyX || parsePublicKey.y != publicKeyY) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const credentialData = await fetchDocumentByHolderDID(
                    request.documentType,
                    request.holderDID,
                );
                const schemaAttributes = await fetchSchemaAttributes(
                    request.schemaId,
                );

                setCredentialData(credentialData);
                setSchemaAttributes(schemaAttributes);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    (
                                    <CheckCircle className="w-6 h-6" />)
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Issue Credential
                                    </h2>
                                    <p className="text-emerald-100 text-sm">
                                        Create verifiable credential
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                        {/* Request Info */}
                        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Holder Info */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        Holder Information
                                    </h3>
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Name:
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {request.holderName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                DID:
                                            </span>
                                            <code className="text-xs font-mono text-blue-600 bg-white px-2 py-1 rounded">
                                                {request.holderDID}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {/* Schema Info */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-purple-600" />
                                        Schema Information
                                    </h3>
                                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Title:
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {request.schemaTitle}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Type:
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {request.schemaType}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">
                                                URL:
                                            </span>
                                            <a
                                                href={request.schemaURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors group"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                View Details
                                                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Timeline */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    Timeline
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 col-span-1 rounded-xl bg-gray-50 border border-gray-200">
                                        <div className="text-xs text-gray-600 mb-1">
                                            Issuance Date
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatDate(Date.now() / 1000)}
                                        </div>
                                    </div>

                                    <div className="p-3  col-span-1 rounded-xl bg-gray-50 border border-gray-200">
                                        <div className="text-xs text-gray-600 mb-1">
                                            Expiration
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatDate(request.expiration)}{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Credential Fields */}

                        <div className="mb-6">
                            <div className="p-4 rounded-xl bg-green-50 border border-green-200 space-y-2">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <config.icon className="w-4 h-4 text-gray-600" />
                                    Credential Data
                                </h3>

                                <div className="space-y-3">
                                    {Object.entries(getCredentialData()).map(
                                        ([field, value]) => (
                                            <motion.div
                                                key={field}
                                                className="flex justify-between"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                whileHover={{ y: -4 }}
                                            >
                                                <span className="text-sm text-gray-600">
                                                    {field}:
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {String(value)}
                                                </span>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleIssueCredential}
                            className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Issue Credential
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Private Key Modal */}
            {showPrivateKeyModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => {
                        setPrivateKey("");
                        setFormError("");
                        setShowPrivateKeyModal(false);
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Key className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Enter Private Key
                                        </h2>
                                        <p className="text-blue-100 text-sm">
                                            Required to sign the credential
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setPrivateKey("");
                                        setFormError("");
                                        setShowPrivateKeyModal(false);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Private Key
                                </label>
                                <input
                                    type="password"
                                    value={privateKey}
                                    onChange={(e) =>
                                        setPrivateKey(e.target.value)
                                    }
                                    placeholder="Enter your private key"
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        formError
                                            ? "border-red-400 bg-red-50"
                                            : "border-blue-200 bg-white"
                                    }  outline-none transition-all font-mono text-sm`}
                                    autoFocus
                                />
                                {formError && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                        <AlertCircle size={16} /> {formError}
                                    </p>
                                )}
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                <p className="text-xs text-yellow-800">
                                    ⚠️ Your private key will be used to sign the
                                    credential and will not be stored.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => {
                                    setPrivateKey("");
                                    setFormError("");
                                    setShowPrivateKeyModal(false);
                                }}
                                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={privateKey.length !== 64}
                                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                {issueLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
