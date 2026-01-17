import { proofRequestStatusConfig } from "@/constants/credential_zkproof";
import { ProofRequest } from "@/types/credential_zkproof";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    Shield,
    Timer,
    X,
    FileText,
    Users,
    ExternalLink,
    Hash,
    Zap,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProofRequestDetailModeProp {
    selectedRequest: ProofRequest;
    formatDate: (date: number) => string;
    isExpired: (expiresTime: number) => boolean;
    isExpiringSoon?: (expiresTime: number) => boolean;
    onClose: () => void;
}

export default function ProofRequestDetailModal({
    selectedRequest,
    formatDate,
    isExpired,
    isExpiringSoon,
    onClose,
}: ProofRequestDetailModeProp) {
    const [copiedField, setCopiedField] = useState<string>("");

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    };

    const expired = isExpired(selectedRequest.expiresTime);
    const expiringSoon = isExpiringSoon
        ? isExpiringSoon(selectedRequest.expiresTime)
        : false;

    const StatusIcon = proofRequestStatusConfig[selectedRequest.status].icon;

    useEffect(() => {}, []);
    return (
        <AnimatePresence>
            {selectedRequest && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-600 flex-shrink-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xl font-bold text-white">
                                                {selectedRequest.message ||
                                                    "ZKP Proof Request"}
                                            </h2>
                                            <span
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 ${
                                                    proofRequestStatusConfig[
                                                        selectedRequest.status
                                                    ].color
                                                } bg-white/90 flex items-center gap-1`}
                                            >
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {selectedRequest.status}
                                            </span>
                                        </div>
                                        {selectedRequest.reason && (
                                            <p className="text-sm text-white/90 mb-2">
                                                {selectedRequest.reason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* Verifier Section */}
                            <div className="p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-purple-900">
                                        Verifier Information
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                                        <div>
                                            <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                                                Name
                                            </span>
                                            <p className="text-sm font-bold text-gray-900 mt-0.5">
                                                {selectedRequest.verifierName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-white rounded-lg border border-purple-100">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                                                DID
                                            </span>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedRequest.verifierDID,
                                                        "verifierDID",
                                                    )
                                                }
                                                className="p-1 hover:bg-purple-100 rounded transition-colors"
                                            >
                                                {copiedField ===
                                                "verifierDID" ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                                                )}
                                            </button>
                                        </div>
                                        <code className="text-xs font-mono text-gray-900 break-all">
                                            {selectedRequest.verifierDID}
                                        </code>
                                    </div>

                                    {selectedRequest.callbackURL && (
                                        <div className="p-3 bg-white rounded-lg border border-purple-100">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                                                <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                                                    Callback URL
                                                </span>
                                            </div>
                                            <a
                                                href={
                                                    selectedRequest.callbackURL
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:text-blue-800 font-mono break-all underline"
                                            >
                                                {selectedRequest.callbackURL}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Schema & Circuit Grid */}

                            {/* Schema */}
                            <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-indigo-900">
                                        Schema
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 bg-white rounded-lg border border-indigo-100">
                                        <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                                            Type
                                        </span>
                                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                                            {selectedRequest.type}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg border border-indigo-100">
                                        <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                                            Context URL
                                        </span>
                                        <code className="text-xs font-mono text-gray-900 break-all block mt-0.5">
                                            {selectedRequest.context}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Circuit */}
                            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-blue-900">
                                        Circuit
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 bg-white rounded-lg border border-blue-100">
                                        <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                                            Circuit ID
                                        </span>
                                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                                            {selectedRequest.circuitId}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg border border-indigo-100">
                                        <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                                            Proof Type
                                        </span>
                                        <code className="text-xs font-mono text-indigo-700 bg-indigo-100 px-2 py-1 rounded inline-block mt-1">
                                            {selectedRequest.proofType}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Allowed Issuers */}
                            <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-emerald-900">
                                        Allowed Issuers
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRequest.allowedIssuers.map(
                                        (issuer, i) => (
                                            <div
                                                key={i}
                                                className="px-3 py-2 bg-white rounded-lg border border-emerald-200"
                                            >
                                                <code className="text-xs font-mono text-emerald-700 font-semibold">
                                                    {issuer === "*"
                                                        ? "🌐 All Issuers"
                                                        : issuer}
                                                </code>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Query Conditions */}
                            {Object.keys(selectedRequest.credentialSubject)
                                .length > 0 && (
                                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-base font-bold text-amber-900">
                                            Query Conditions
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(
                                            selectedRequest.credentialSubject,
                                        ).map(([field, value], i) => (
                                            <div
                                                key={i}
                                                className="p-3 bg-white rounded-lg border border-amber-100"
                                            >
                                                <span className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
                                                    {field}
                                                </span>
                                                <code className="text-sm font-mono text-gray-900 block mt-1">
                                                    {JSON.stringify(
                                                        value,
                                                        null,
                                                        2,
                                                    )}
                                                </code>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Timeline Section - Prominent */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-bold text-blue-900">
                                            Created
                                        </span>
                                    </div>
                                    <p className="text-sx font-bold text-gray-900">
                                        {formatDate(
                                            selectedRequest.createdTime,
                                        )}
                                    </p>
                                </div>

                                <div
                                    className={`p-4 rounded-xl border-2 ${
                                        expired
                                            ? "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200"
                                            : expiringSoon
                                            ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                                            : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Timer
                                            className={`w-5 h-5 ${
                                                expired
                                                    ? "text-rose-600"
                                                    : expiringSoon
                                                    ? "text-amber-600"
                                                    : "text-green-600"
                                            }`}
                                        />
                                        <span
                                            className={`text-sm font-bold ${
                                                expired
                                                    ? "text-rose-900"
                                                    : expiringSoon
                                                    ? "text-amber-900"
                                                    : "text-green-900"
                                            }`}
                                        >
                                            {expired
                                                ? "Expired"
                                                : expiringSoon
                                                ? "Expires Soon"
                                                : "Expires"}
                                        </span>
                                    </div>
                                    <p
                                        className={`text-sx font-bold ${
                                            expired
                                                ? "text-rose-700"
                                                : expiringSoon
                                                ? "text-amber-700"
                                                : "text-green-700"
                                        }`}
                                    >
                                        {formatDate(
                                            selectedRequest.expiresTime,
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Advanced Options */}
                            <div className="p-5 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Advanced Options
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                                        <span className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                                            Thread ID
                                        </span>
                                        <div className="flex items-center justify-between mt-1">
                                            <code className="text-xs font-mono text-gray-900 break-all flex-1">
                                                {selectedRequest.threadId}
                                            </code>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedRequest.threadId,
                                                        "threadId",
                                                    )
                                                }
                                                className="p-1 hover:bg-slate-100 rounded transition-colors ml-2"
                                            >
                                                {copiedField === "threadId" ? (
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {selectedRequest.nullifierSession && (
                                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                                            <span className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                                                Nullifier Session
                                            </span>
                                            <code className="text-xs font-mono text-gray-900 block mt-1">
                                                {
                                                    selectedRequest.nullifierSession
                                                }
                                            </code>
                                        </div>
                                    )}

                                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedRequest.skipClaimRevocationCheck
                                                }
                                                readOnly
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <div>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Skip Claim Revocation Check
                                                </span>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {selectedRequest.skipClaimRevocationCheck
                                                        ? "Revocation check is disabled"
                                                        : "Revocation check is enabled"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                            <button
                                onClick={onClose}
                                className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-bold transition-all shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
