import { proofTypeConfig } from "@/constants/credential_zkproof";
import {
    formatDate,
    formatDateTime,
    isExpired,
    isExpiredDateTime,
} from "@/helper/dateTime";
import { useCredentialZKProofStore } from "@/store/credential_zkproof.store";
import { useIdentityStore } from "@/store/identity.store";
import { useVerifiableCredential } from "@/store/verifiable_credential.store";
import { ProofRequest } from "@/types/credential_proof";
import { ZKProof } from "@/types/zkproof";
import { W3CCredential } from "@0xpolygonid/js-sdk";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Shield,
    Loader2,
    Info,
    AlertCircle,
    Send,
    Check,
    Clock,
    User,
    FileText,
    Link as LinkIcon,
    ChevronDown,
    ChevronUp,
    Timer,
    Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";

interface GenerateProofModalProp {
    proofRequest: ProofRequest;
    onClose: () => void;
}

export default function GenerateProofModal({
    proofRequest,
    onClose,
}: GenerateProofModalProp) {
    const [verifiableCredentials, setVerifiableCredentials] = useState<
        W3CCredential[]
    >([]);
    const [selectedCredential, setSelectedCredential] =
        useState<W3CCredential>();
    const [proofGenerated, setProofGenerated] = useState(false);
    const [proofSubmitted, setProofSubmitted] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showCredentialDetails, setShowCredentialDetails] = useState(false);

    const fetchVerifiableCredentials = useVerifiableCredential(
        (state) => state.fetchVerifiableCredentials,
    );

    const identity = useIdentityStore((state) => state.identity);
    const generateCredentialAtomicQueryV3Proof = useCredentialZKProofStore(
        (state) => state.generateCredentialAtomicQueryV3Proof,
    );
    const submitZkProof = useCredentialZKProofStore(
        (state) => state.submitZkProof,
    );

    const isLoading = useCredentialZKProofStore((state) => state.loading);
    const [zkProof, setZkProof] = useState<ZKProof | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const credentials = await fetchVerifiableCredentials();
                const filterCredentials = credentials.filter(
                    (item) =>
                        item["@context"][2] === proofRequest.context &&
                        item.type[1] === proofRequest.type,
                );
                setVerifiableCredentials(filterCredentials || []);
            } catch (error) {
                console.error("Failed to fetch credentials:", error);
            }
        };
        fetchData();
    }, []);

    const handleGenerateProof = async () => {
        if (!selectedCredential) return;
        try {
            const proof: ZKProof = await generateCredentialAtomicQueryV3Proof(
                proofRequest.id,
                selectedCredential.id,
                proofRequest.scopeId,
            );
            setZkProof(proof);
            setProofGenerated(true);
        } catch (error) {
            console.error("Failed to generate proof:", error);
        }
    };

    const handleSubmitProof = async () => {
        if (!identity || !zkProof) {
            return;
        }
        try {
            await submitZkProof(identity?.did, proofRequest, zkProof);
            setProofSubmitted(true);
            onClose();
        } catch (error) {
            console.error("Failed to submit proof:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-4xl w-full shadow-2xl max-h-[95vh] overflow-hidden flex flex-col"
            >
                {/* Header with gradient */}
                <div className="relative px-8 py-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">
                                Zero-Knowledge Proof Generation
                            </h3>
                        </div>
                        <p className="text-emerald-50 text-sm ml-14">
                            {proofGenerated
                                ? "Review and submit your proof"
                                : "Select a credential and generate cryptographic proof"}
                        </p>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-6">
                        {/* Success Message */}
                        <AnimatePresence>
                            {proofSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 shadow-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500 rounded-full">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-900">
                                                Proof Submitted Successfully!
                                            </p>
                                            <p className="text-sm text-green-700">
                                                Your proof has been sent to the
                                                verifier.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Proof Request Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Info className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">
                                            Proof Request Details
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            From {proofRequest.verifierName}
                                        </p>
                                    </div>
                                </div>
                                {showDetails ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showDetails && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-200"
                                    >
                                        <div className="p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white">
                                            <div className="flex gap-3">
                                                <User className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Verifier Name
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-mono break-all">
                                                        {
                                                            proofRequest.verifierName
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-mono break-all">
                                                        {
                                                            proofRequest.verifierDID
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start gap-3">
                                                    <Shield className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Circuit ID
                                                        </p>
                                                        <p className="text-sm text-gray-900 font-mono">
                                                            {
                                                                proofRequest.circuitId
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Shield className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Proof Type
                                                        </p>
                                                        <p className="text-sm text-gray-900 font-mono">
                                                            {
                                                                proofTypeConfig[
                                                                    proofRequest
                                                                        .proofType
                                                                ].label
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Created
                                                        </p>
                                                        <p className="text-sm text-gray-900">
                                                            {formatDate(
                                                                proofRequest.createdTime,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Timer className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Expires
                                                        </p>
                                                        <p className="text-sm text-gray-900">
                                                            {formatDate(
                                                                proofRequest.expiresTime,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {proofRequest.reason && (
                                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p className="text-xs font-medium text-blue-900 mb-1">
                                                        Reason
                                                    </p>
                                                    <p className="text-sm text-blue-800">
                                                        {proofRequest.reason}
                                                    </p>
                                                </div>
                                            )}

                                            {proofRequest.message && (
                                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                    <p className="text-xs font-medium text-purple-900 mb-1">
                                                        Message
                                                    </p>
                                                    <p className="text-sm text-purple-800">
                                                        {proofRequest.message}
                                                    </p>
                                                </div>
                                            )}

                                            {proofRequest.callbackURL && (
                                                <div className="flex items-start gap-3">
                                                    <LinkIcon className="w-4 h-4 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Callback URL
                                                        </p>
                                                        <a
                                                            href={
                                                                proofRequest.callbackURL
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline font-mono break-all"
                                                        >
                                                            {
                                                                proofRequest.callbackURL
                                                            }
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Requirements Section */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-sm">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-emerald-600 rounded-lg">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Required Credentials
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Your credential must match these
                                        requirements
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-emerald-200">
                                    <p className="text-xs font-medium text-gray-500 mb-2">
                                        Context Schema
                                    </p>
                                    <a
                                        href={proofRequest.context}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline font-mono break-all flex items-center gap-2"
                                    >
                                        <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                        {proofRequest.context}
                                    </a>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-emerald-200">
                                    <p className="text-xs font-medium text-gray-500 mb-2">
                                        Credential Type
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {proofRequest.type}
                                    </p>
                                </div>
                                {proofRequest.allowedIssuers &&
                                    proofRequest.allowedIssuers.length > 0 && (
                                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-emerald-200">
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                Allowed Issuers
                                            </p>
                                            <div className="space-y-1">
                                                {proofRequest.allowedIssuers.map(
                                                    (issuer, index) => (
                                                        <p
                                                            key={index}
                                                            className="text-xs text-gray-700 font-mono break-all"
                                                        >
                                                            {" "}
                                                            {issuer == "*"
                                                                ? "All Issuer"
                                                                : issuer}
                                                        </p>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {proofRequest.credentialSubject && (
                                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-emerald-200">
                                        <p className="text-xs font-medium text-gray-500 mb-2">
                                            Required Conditions
                                        </p>
                                        <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto font-mono">
                                            {JSON.stringify(
                                                proofRequest.credentialSubject,
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Credentials Selection */}
                        {!proofGenerated && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-900">
                                        Your Matching Credentials
                                    </p>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {verifiableCredentials.length} available
                                    </span>
                                </div>

                                {verifiableCredentials.length === 0 ? (
                                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                                        <div className="p-3 bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            No matching credentials found
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Please obtain the required
                                            credential first
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {verifiableCredentials.map((cred) => {
                                            const credType = Array.isArray(
                                                cred.type,
                                            )
                                                ? cred.type.find(
                                                      (t) =>
                                                          t !==
                                                          "VerifiableCredential",
                                                  )
                                                : cred.type;
                                            const isSelected =
                                                selectedCredential?.id ===
                                                cred.id;

                                            return (
                                                <motion.button
                                                    key={cred.id}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() =>
                                                        setSelectedCredential(
                                                            cred,
                                                        )
                                                    }
                                                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                                                        isSelected
                                                            ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-500/20"
                                                            : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className={`p-3 rounded-xl ${
                                                                isSelected
                                                                    ? "bg-emerald-600"
                                                                    : "bg-gray-100"
                                                            }`}
                                                        >
                                                            <FileText
                                                                className={`w-4 h-4 ${
                                                                    isSelected
                                                                        ? "text-white"
                                                                        : "text-gray-600"
                                                                }`}
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <p className="font-semibold text-gray-900">
                                                                    {credType}
                                                                </p>
                                                                {isSelected && (
                                                                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                                                )}
                                                            </div>

                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                    <User className="w-3 h-3" />
                                                                    <span className="font-medium">
                                                                        Issuer:
                                                                    </span>
                                                                    <span className="truncate">
                                                                        {
                                                                            cred.issuer
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {cred.issuanceDate && (
                                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                        <Clock className="w-3 h-3" />
                                                                        <span className="font-medium">
                                                                            Issued:
                                                                        </span>
                                                                        <span>
                                                                            {formatDateTime(
                                                                                cred.issuanceDate,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {cred.expirationDate && (
                                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        <span className="font-medium">
                                                                            Expires:
                                                                        </span>
                                                                        <span>
                                                                            {formatDateTime(
                                                                                cred.expirationDate,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {cred.credentialSubject && (
                                                                <details className="mt-3">
                                                                    <summary className="text-xs font-medium text-emerald-700 cursor-pointer hover:text-emerald-800">
                                                                        View
                                                                        credential
                                                                        details
                                                                    </summary>
                                                                    <pre className="mt-2 text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto font-mono">
                                                                        {JSON.stringify(
                                                                            cred.credentialSubject,
                                                                            null,
                                                                            2,
                                                                        )}
                                                                    </pre>
                                                                </details>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Generated Proof Display */}
                        {proofGenerated && zkProof && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-600 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Proof Generated Successfully
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Review your proof before
                                                submission
                                            </p>
                                        </div>
                                    </div>

                                    {/* Selected Credential Info */}
                                    {selectedCredential && (
                                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4 border border-green-200">
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                Selected Credential
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedCredential?.type[1]}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Issuer:{" "}
                                                {selectedCredential?.issuer}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                                        <button
                                            onClick={() =>
                                                setShowCredentialDetails(
                                                    !showCredentialDetails,
                                                )
                                            }
                                            className="w-full flex items-center justify-between text-left"
                                        >
                                            <p className="text-xs font-medium text-gray-500">
                                                ZK Proof Data
                                            </p>
                                            {showCredentialDetails ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {showCredentialDetails && (
                                                <motion.div
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    className="mt-3"
                                                >
                                                    <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto font-mono max-h-64">
                                                        {JSON.stringify(
                                                            zkProof,
                                                            null,
                                                            2,
                                                        )}
                                                    </pre>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3.5 rounded-xl border-2 border-gray-300 hover:bg-white hover:border-gray-400 text-gray-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {proofSubmitted ? "Close" : "Cancel"}
                        </motion.button>

                        {!proofGenerated ? (
                            <motion.button
                                whileHover={{
                                    scale:
                                        selectedCredential &&
                                        !isLoading &&
                                        !isExpired
                                            ? 1.02
                                            : 1,
                                }}
                                whileTap={{
                                    scale:
                                        selectedCredential &&
                                        !isLoading &&
                                        !isExpired
                                            ? 0.98
                                            : 1,
                                }}
                                onClick={handleGenerateProof}
                                disabled={
                                    !selectedCredential ||
                                    isLoading ||
                                    isExpiredDateTime(
                                        selectedCredential.expirationDate ?? "",
                                    )
                                }
                                className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Proof...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        Generate Proof
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{
                                    scale:
                                        !isLoading && !proofSubmitted
                                            ? 1.02
                                            : 1,
                                }}
                                whileTap={{
                                    scale:
                                        !isLoading && !proofSubmitted
                                            ? 0.98
                                            : 1,
                                }}
                                onClick={handleSubmitProof}
                                disabled={isLoading || proofSubmitted}
                                className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : proofSubmitted ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Submitted
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Proof
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
