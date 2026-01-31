import {
    Clock,
    ExternalLink,
    Calendar,
    Timer,
    Building2,
    FileText,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { credentialTypeConfig } from "@/constants/issuer";
import { useCredentialRequestStore } from "@/store/credential_request.store";
import { useEffect } from "react";
import {
    CredentialRequestStatus,
    credentialStatusConfig,
} from "@/constants/credential_request";
import { formatDate, isExpired } from "@/helper/dateTime";

export default function MyCredentialRequest() {
    const getCredentialRequests = useCredentialRequestStore(
        (state) => state.getCredentialRequests,
    );
    const credentialRequests = useCredentialRequestStore(
        (state) => state.credentialRequests,
    );

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {credentialRequests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No Credential Requests Found
                        </h3>
                    </motion.div>
                ) : (
                    credentialRequests.map((request, index) => {
                        const config =
                            credentialTypeConfig[request.documentType];
                        const expired = isExpired(request.expiresTime);
                        let statusConfig =
                            credentialStatusConfig[request.status];

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
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                        >
                                            <config.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {request.holderName}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {config.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${statusConfig.color}`}
                                        >
                                            <StatusIcon className="w-3 h-3" />
                                            {request.status}
                                        </span>
                                        {expired && (
                                            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-bold border border-rose-300">
                                                Expired
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Fields */}
                                <div className="space-y-2 mb-4">
                                    {/* Schema */}
                                    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                        <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-purple-600" />
                                            Schema:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                                                {request.schemaType}
                                            </code>

                                            <a
                                                href={request.schemaURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:text-purple-800"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                    {/* Valid Until */}
                                    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                        <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            Valid Until:
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 text-right">
                                            {formatDate(request.expiration)}
                                        </span>
                                    </div>

                                    {/* Created & Expires - Same Row */}
                                    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100">
                                        {/* Created - Left */}
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm text-gray-600 font-medium">
                                                Created:
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatDate(
                                                    request.createdTime,
                                                )}
                                            </span>
                                        </div>

                                        {/* Expires - Right */}
                                        <div className="flex items-center gap-2">
                                            <Timer
                                                className={`w-4 h-4 ${
                                                    expired
                                                        ? "text-rose-600"
                                                        : "text-amber-600"
                                                }`}
                                            />
                                            <span className="text-sm text-gray-600 font-medium">
                                                Expires:
                                            </span>
                                            <span
                                                className={`text-sm font-semibold ${
                                                    expired
                                                        ? "text-rose-700"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {formatDate(
                                                    request.expiresTime,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
