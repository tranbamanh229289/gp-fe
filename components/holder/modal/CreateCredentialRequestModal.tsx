import { AuthRole } from "@/constants/auth";
import { useIdentityStore } from "@/store/identity.store";
import { useSchemaStore } from "@/store/schema.store";
import { CredentialIssuanceRequest } from "@/types/credential_request";
import { Identity } from "@/types/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, FileText, Loader2, User, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Schema } from "@/types/schema";
import { useCredentialRequestStore } from "@/store/credential_request.store";
import { ProofType } from "@0xpolygonid/js-sdk";
import {
    dateInputToTimestamp,
    formatDate,
    isExpired,
    timestampToDateInput,
} from "@/helper/dateTime";

export default function CreateCredentialRequestModal({
    onClose,
}: {
    onClose: () => void;
}) {
    const identity = useIdentityStore((state) => state.identity);
    const fetchIdentities = useIdentityStore((state) => state.fetchIdentities);
    const isLoadingIssuers = useIdentityStore((state) => state.loading);

    const fetchSchemas = useSchemaStore((state) => state.fetchSchemas);
    const isLoadingSchemas = useSchemaStore((state) => state.loading);

    const createCredentialRequest = useCredentialRequestStore(
        (state) => state.createCredentialRequest,
    );

    const [formData, setFormData] = useState<CredentialIssuanceRequest>({
        holderDID: identity?.did || "",
        issuerDID: "",
        schemaHash: "",
        schemaURL: "",
        schemaType: "",
        createdTime: 0,
        expiresTime: 0,
        expiration: Date.now() / 1000,
    });

    const [issuers, setIssuers] = useState<Identity[]>([]);
    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!isFormValid()) return;
        setLoading(true);
        try {
            const requestData: CredentialIssuanceRequest = {
                holderDID: formData.holderDID,
                issuerDID: formData.issuerDID,
                schemaHash: formData.schemaHash,
                schemaURL: formData.schemaURL,
                schemaType: formData.schemaType,
                expiration: formData.expiration,
                createdTime: Math.floor(Date.now() / 1000),
                expiresTime: Math.floor(Date.now() / 1000) + 24 * 3600,
            };
            await createCredentialRequest(requestData);
            onClose();
        } catch (error) {
            console.error("Failed to submit request:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (key: keyof CredentialIssuanceRequest, value: any) => {
        let updated = { ...formData, [key]: value };
        if (key === "schemaURL") {
            const schema = getSchemaBySchemaURL(value);
            updated = {
                ...updated,
                schemaType: schema?.type ?? "",
                schemaHash: schema?.hash ?? "",
            };
        }
        setFormData(updated);
    };

    const getSchemaBySchemaURL = (url: string): Schema | undefined => {
        return schemas.find((item) => item.schemaURL === url);
    };

    const isFormValid = () => {
        return (
            formData.holderDID &&
            formData.issuerDID &&
            formData.schemaURL &&
            formData.schemaType &&
            formData.expiration &&
            !isExpired(formData.expiration) &&
            formData.expiration > 0
        );
    };

    // Fetch schemas and issuers on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch schemas
                const schemas: Schema[] = await fetchSchemas();
                const issuers: Identity[] = await fetchIdentities(
                    AuthRole.Issuer,
                );

                setIssuers(issuers || []);
                setSchemas(schemas || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/70 to-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white transition-all"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </motion.button>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">
                                Request Credential
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Fill in the details to submit your request
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)]">
                    <div className="space-y-6">
                        {/* Your Information (Read-only) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Your Information
                                </h3>
                            </div>

                            {identity ? (
                                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {identity?.name}
                                                </span>
                                                <span className="px-2 py-0.5 bg-indigo-200 text-indigo-700 text-xs rounded-full font-medium">
                                                    You
                                                </span>
                                            </div>
                                            <code className="text-xs text-slate-600 font-mono break-all">
                                                {identity?.did}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-amber-900">
                                                Identity not found
                                            </p>
                                            <p className="text-xs text-amber-700 mt-1">
                                                Please set up your identity
                                                first
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Issuer Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Issuer Information
                                </h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Select Issuer{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                {isLoadingIssuers ? (
                                    <div className="flex items-center justify-center py-3 text-slate-500">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Loading issuers...
                                    </div>
                                ) : issuers.length > 0 ? (
                                    <select
                                        value={formData.issuerDID || ""}
                                        onChange={(e) =>
                                            updateField(
                                                "issuerDID",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-700 bg-white"
                                    >
                                        <option value="">
                                            Select an issuer...
                                        </option>
                                        {issuers.map((issuer) => (
                                            <option
                                                key={issuer.did}
                                                value={issuer.did}
                                            >
                                                {issuer.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                                        <p className="text-sm text-amber-700">
                                            No issuers available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Schema Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Schema Details
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Select Schema{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    {isLoadingSchemas ? (
                                        <div className="flex items-center justify-center py-3 text-slate-500">
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Loading schemas...
                                        </div>
                                    ) : schemas.length > 0 ? (
                                        <select
                                            value={formData.schemaURL || ""}
                                            onChange={(e) =>
                                                updateField(
                                                    "schemaURL",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-700 bg-white"
                                        >
                                            <option value="">
                                                Select a schema...
                                            </option>
                                            {schemas.map((schema) => (
                                                <option
                                                    key={schema.id}
                                                    value={schema.schemaURL}
                                                >
                                                    {schema.title} (v
                                                    {schema.version})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                                            <p className="text-sm text-amber-700">
                                                No schemas available
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {formData.schemaType && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Schema Type
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.schemaType}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 font-mono text-sm"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Expiration */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Expiration
                                </h3>
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={timestampToDateInput(
                                        formData.expiration,
                                    )}
                                    onChange={(e) => {
                                        const timestamp = dateInputToTimestamp(
                                            e.target.value,
                                        );
                                        updateField("expiration", timestamp);
                                    }}
                                    min="1"
                                    className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-slate-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
                                Credential will be valid until:{" "}
                                {formatDate(formData.expiration)}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 rounded-xl border-2 border-slate-300 hover:bg-white hover:border-slate-400 text-slate-700 font-semibold transition-all"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: isFormValid() ? 1.02 : 1 }}
                            whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
                            onClick={handleSubmit}
                            disabled={!isFormValid() || loading}
                            className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                isFormValid() && !loading
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            Submit Request
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
