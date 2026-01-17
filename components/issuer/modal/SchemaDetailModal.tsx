import { Schema } from "@/types/schema";
import { motion } from "framer-motion";
import {
    X,
    Building2,
    FileJson,
    Database,
    Copy,
    CheckCircle2,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { credentialTypeConfig, IssuerModal } from "@/constants/issuer";
import { SchemaStatus } from "@/constants/schema";

interface SchemaDetailModalProps {
    schema: Schema;
    setShowModal: (modal: IssuerModal) => void;
}

export default function SchemaDetailModal({
    schema,
    setShowModal,
}: SchemaDetailModalProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const config = credentialTypeConfig[schema.documentType];

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const getStatusColor = (status: SchemaStatus) => {
        switch (status) {
            case SchemaStatus.Active:
                return "bg-green-100 text-green-700 border-green-300";
            case SchemaStatus.Revoked:
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(IssuerModal.Null)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div
                    className={`relative bg-gradient-to-r ${config.gradient} p-8`}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-0"></div>

                    {/* Title and Status */}
                    <div className="relative z-10 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-5">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30"
                            >
                                <config.icon className="w-12 h-12 text-white" />
                            </motion.div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-4xl font-bold text-white tracking-tight">
                                        {schema.title}
                                    </h2>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusColor(
                                            schema.status
                                        )}`}
                                    >
                                        {schema.status}
                                    </span>
                                </div>
                                <p className="text-white/90 text-lg font-medium">
                                    {config?.label} • Version {schema.version}
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowModal(IssuerModal.Null)}
                            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm border border-white/30"
                        >
                            <X size={24} />
                        </motion.button>
                    </div>

                    {/* Description */}
                    <div className="relative z-10 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <p className="text-white/95 leading-relaxed text-base">
                            {schema.description}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-br from-gray-50 to-white">
                    {/* 1. Issuer Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                Issuer Information
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                                <label className="text-xs font-bold text-blue-900 uppercase tracking-wide block mb-2">
                                    Organization Name
                                </label>
                                <p className="text-xl font-semibold text-gray-900">
                                    {schema.issuerName}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Issuer DID
                                    </label>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            copyToClipboard(
                                                schema.issuerDID,
                                                "issuerDID"
                                            )
                                        }
                                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        {copiedField === "issuerDID" ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-600" />
                                        )}
                                    </motion.button>
                                </div>
                                <code className="text-sm font-mono text-gray-800 break-all">
                                    {schema.issuerDID}
                                </code>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Schema Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                                <FileJson className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                Schema Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wide block mb-2">
                                    Schema Type
                                </label>
                                <code className="text-sm font-mono font-semibold text-gray-900 break-all">
                                    {schema.type}
                                </code>
                            </div>

                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wide block mb-2">
                                    Version
                                </label>
                                <p className="text-sm font-semibold text-gray-900">
                                    {schema.version}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wide block mb-2">
                                    Document Type
                                </label>
                                <p className="text-sm font-semibold text-gray-900">
                                    {schema.documentType}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wide block mb-2">
                                    Merklized
                                </label>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                            schema.isMerklized
                                                ? "bg-blue-200 text-blue-800"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {schema.isMerklized ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hash */}
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                    Schema Hash
                                </label>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                        copyToClipboard(schema.hash, "hash")
                                    }
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    {copiedField === "hash" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-600" />
                                    )}
                                </motion.button>
                            </div>
                            <code className="text-xs font-mono text-gray-800 break-all leading-relaxed">
                                {schema.hash}
                            </code>
                        </div>

                        {/* URLs */}
                        <div className="space-y-3">
                            {schema.schemaURL && (
                                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-wide block mb-2">
                                        Schema URL
                                    </label>
                                    <a
                                        href={schema.schemaURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-mono text-indigo-600 hover:text-indigo-800 break-all group"
                                    >
                                        <span className="flex-1">
                                            {schema.schemaURL}
                                        </span>
                                        <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                </div>
                            )}

                            {schema.contextURL && (
                                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                                    <label className="text-xs font-bold text-teal-700 uppercase tracking-wide block mb-2">
                                        Context URL
                                    </label>
                                    <a
                                        href={schema.contextURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-mono text-teal-600 hover:text-teal-800 break-all group"
                                    >
                                        <span className="flex-1">
                                            {schema.contextURL}
                                        </span>
                                        <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* 3. Attributes Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                Attributes ({schema.attributes.length})
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {schema.attributes.map((attr, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <code className="font-mono text-base font-bold text-gray-900">
                                                    {attr.name}
                                                </code>
                                                {attr.required && (
                                                    <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                                                        Required
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">
                                                {attr.title}
                                            </p>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {attr.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 ml-4">
                                            <span className="px-3 py-1.5 rounded-lg bg-emerald-200 text-emerald-800 text-xs font-bold text-center">
                                                {attr.type}
                                            </span>
                                            {!schema.isMerklized && (
                                                <span className="px-3 py-1.5 rounded-lg bg-blue-200 text-blue-800 text-xs font-bold text-center">
                                                    {attr.slot}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t-2 border-gray-100 bg-white flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(IssuerModal.Null)}
                        className={`px-8 py-3 rounded-xl bg-gradient-to-r ${config.gradient} hover:shadow-xl text-white font-bold transition-all shadow-lg`}
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
