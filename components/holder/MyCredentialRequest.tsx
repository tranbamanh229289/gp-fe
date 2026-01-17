import {
    CheckCircle,
    Clock,
    XCircle,
    ExternalLink,
    Calendar,
    Timer,
    Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { credentialTypeConfig } from "@/constants/issuer";
import { useCredentialRequestStore } from "@/store/credential_request.store";
import { useEffect } from "react";
import {
    CredentialRequestStatus,
    credentialStatusConfig,
} from "@/constants/credential_request";

export default function MyCredentialRequest() {
    const getCredentialRequests = useCredentialRequestStore(
        (state) => state.getCredentialRequests
    );
    const credentialRequests = useCredentialRequestStore(
        (state) => state.credentialRequests
    );

    const formatDate = (date: number) => {
        return new Date(date * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDuration = (expiration: number) => {
        return expiration / (3600 * 24);
    };

    const isExpired = (expiresTime: number) => {
        const nowInSeconds = () => Math.floor(Date.now() / 1000);
        return expiresTime < nowInSeconds();
    };

    useEffect(() => {
        getCredentialRequests();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    My Credential Requests
                </h2>
                <p className="text-sm text-gray-600">
                    Track and manage your credential requests
                </p>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {credentialRequests.map((request, index) => {
                    const config = credentialTypeConfig[request.documentType];
                    const expired = isExpired(request.expiresTime);
                    let statusConfig = credentialStatusConfig[request.status];

                    if (
                        expired &&
                        request.status === CredentialRequestStatus.Pending
                    ) {
                        statusConfig =
                            credentialStatusConfig[
                                CredentialRequestStatus.Expired
                            ];
                    }
                    const StatusIcon = statusConfig.icon;

                    return (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{
                                y: -2,
                                boxShadow: "0 12px 24px -8px rgba(0,0,0,0.12)",
                            }}
                            className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Top Row: Icon, Title, Status */}
                                <div className="flex items-start gap-5 mb-5">
                                    {/* Icon */}
                                    <div
                                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
                                    >
                                        <config.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Title & Badges */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {config.label}
                                            </h3>

                                            {
                                                <span
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${statusConfig.color} flex items-center gap-1.5`}
                                                >
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {request.status}
                                                </span>
                                            }
                                        </div>

                                        {/* Issuer Info */}
                                        <div className="flex items-center gap-2 text-sx">
                                            <Building2 className="w-6 h-6 text-gray-500" />
                                            <span className="font-semibold text-slate-700">
                                                {request.issuerName}
                                            </span>
                                            <span className="text-slate-400">
                                                •
                                            </span>
                                            <code className="text-xs font-mono text-slate-800  max-w-md">
                                                {request.issuerDID}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {/* Schema Info */}
                                <div className="mb-5 p-4 rounded-xl bg-purple-50 border border-purple-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                                            Schema
                                        </span>
                                        <a
                                            href={request.schemaURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors group"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Details
                                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sx font-semibold text-slate-900 mb-1">
                                            {request.schemaTitle}
                                        </p>
                                        <code className="text-sx font-mono text-purple-700 bg-white px-2 py-1 rounded border border-purple-300 inline-block">
                                            {request.schemaType}
                                        </code>
                                    </div>
                                </div>

                                {/* Bottom Grid: Dates & Validity */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Created */}
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                                                Created
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDate(request.createdTime)}
                                        </p>
                                    </div>

                                    {/* Expires */}
                                    <div
                                        className={`p-3 rounded-xl border ${
                                            expired
                                                ? "bg-rose-50 border-rose-200"
                                                : "bg-slate-50 border-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Timer className="w-4 h-4 text-slate-500" />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                                                Expires
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm font-semibold ${
                                                expired
                                                    ? "text-rose-700"
                                                    : "text-slate-900"
                                            }`}
                                        >
                                            {formatDate(request.expiresTime)}
                                        </p>
                                    </div>

                                    {/* Validity */}
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Validity
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDuration(request.expiration)}{" "}
                                            days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {credentialRequests.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300"
                >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <Clock className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        No Requests Yet
                    </h3>
                    <p className="text-slate-600">
                        Your credential requests will appear here
                    </p>
                </motion.div>
            )}
        </div>
    );
}
