"use client";
import { AuthMode, LoginStep } from "@/constants/auth";
import { generateQRCodeSVG } from "@/helper/qrcode";
import { useIdentityStore } from "@/store/identity.store";
import { useAuthZkProofStore } from "@/store/auth_zkproof.store";
import { ProofData, ZKProof } from "@/types/auth_zkproof";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Key,
    Loader2,
    Lock,
    Monitor,
    Shield,
    Smartphone,
    Sparkles,
    Send,
    Zap,
    ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginProps {
    setMode: (mode: AuthMode) => void;
}

export default function Login({ setMode }: LoginProps) {
    const [showQRCode, setShowQRCode] = useState(true);
    const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
    const [privateKeyInput, setPrivateKeyInput] = useState<string>("");
    const [zkLoginStep, setZkLoginStep] = useState<LoginStep>(
        LoginStep.Challenge
    );

    console.log(zkLoginStep);
    const [zkProof, setZkProof] = useState<ProofData>({
        pi_a: [],
        pi_b: [],
        pi_c: [],
        protocol: "",
        curve: "",
    });
    const [publicSignals, setPublicSignals] = useState<string[]>([]);

    const [isChallengeLoading, setIsChallengeLoading] = useState(false);
    const [isProofLoading, setIsProofLoading] = useState(false);
    const [isSendingProof, setIsSendingProof] = useState(false);
    const [error, setError] = useState<string>("");

    // hook
    const router = useRouter();
    const { requestChallenge, generateProof, cancel, challenge } =
        useAuthZkProofStore();
    const { login } = useIdentityStore();

    // Step 1: Get challenge
    const handleCancel = () => {
        setIsProofLoading(false);
        setPrivateKeyInput("");
        setShowQRCode(true);
        cancel();
        setZkLoginStep(LoginStep.Challenge);
    };

    const handleGetChallenge = async () => {
        setIsChallengeLoading(true);
        setError("");
        try {
            await requestChallenge();
            setZkLoginStep(LoginStep.Generate);
        } catch (err) {
            setError("Failed to get challenge");
        } finally {
            setIsChallengeLoading(false);
        }
    };

    // Step 2: Generate ZK proof
    const handleGenerateProof = async () => {
        if (!privateKeyInput) {
            setError("Please enter your private key");
            return;
        }
        if (privateKeyInput.length != 64) {
            setError("Private invalid");
            return;
        }

        setIsProofLoading(true);
        setError("");

        try {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const result = await generateProof(privateKeyInput);

            setZkProof(result.proof);
            setPublicSignals(result.publicSignals);
            setZkLoginStep(LoginStep.Verify);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to generate proof"
            );
        } finally {
            setIsProofLoading(false);
        }
    };

    // Step 3: Send proof to backend
    const handleVerify = async () => {
        setIsSendingProof(true);
        setError("");

        try {
            const proof: ZKProof = {
                proof: zkProof,
                pub_signals: publicSignals,
            };
            const roleAuth = await login(proof);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            setZkLoginStep(LoginStep.Login);
            setTimeout(() => {
                router.push(`/${roleAuth}`);
            }, 1000);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Verification failed"
            );
            setZkLoginStep(LoginStep.Generate);
        } finally {
            setIsSendingProof(false);
            setZkLoginStep(LoginStep.Challenge);
        }
    };

    const stepInfos = [
        {
            step: LoginStep.Challenge,
            label: "Request Challenge",
            icon: Lock,
            num: 1,
        },
        {
            step: LoginStep.Generate,
            label: "Generate Proof",
            icon: Key,
            num: 2,
        },
        {
            step: LoginStep.Verify,
            label: "Verify & Login",
            icon: CheckCircle2,
            num: 3,
        },
    ];

    return (
        <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-900/95 via-purple-900/30 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-12 shadow-2xl shadow-purple-500/10"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50"
                    >
                        <Shield className="w-14 h-14 text-white" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent mb-3"
                    >
                        Zero-Knowledge Login
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-purple-300/80 text-lg"
                    >
                        Prove your identity without revealing it
                    </motion.p>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-center gap-6 mb-12">
                    {stepInfos.map((item, idx) => {
                        const currentIdx = [
                            LoginStep.Challenge,
                            LoginStep.Generate,
                            LoginStep.Verify,
                            LoginStep.Login,
                        ].indexOf(zkLoginStep);
                        const isActive = zkLoginStep === item.step;
                        const isCompleted = idx < currentIdx;

                        return (
                            <div key={item.step} className="flex items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        opacity: 1,
                                    }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <motion.div
                                        animate={{
                                            scale: isActive ? [1, 1.05, 1] : 1,
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: isActive ? Infinity : 0,
                                        }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                                            isCompleted
                                                ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400 shadow-lg shadow-emerald-500/50"
                                                : isActive
                                                ? "bg-gradient-to-br from-violet-500 to-purple-500 border-purple-400 shadow-lg shadow-purple-500/50"
                                                : "bg-slate-800/50 border-slate-700"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring" }}
                                            >
                                                <Check className="w-7 h-7 text-white" />
                                            </motion.div>
                                        ) : (
                                            <item.icon
                                                className={`w-7 h-7 ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-slate-500"
                                                }`}
                                            />
                                        )}
                                    </motion.div>
                                    <span
                                        className={`text-sm font-medium transition-colors ${
                                            isActive || isCompleted
                                                ? "text-white"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </motion.div>
                                {idx < 2 && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                        className={`w-16 h-0.5 mx-4 transition-all origin-left ${
                                            isCompleted
                                                ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                                                : "bg-slate-700"
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <div className="space-y-6">
                        {/* Step 1: Request Challenge */}
                        {zkLoginStep === LoginStep.Challenge && (
                            <motion.div
                                key="challenge-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
                                    <div className="flex items-start gap-4">
                                        <motion.div
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50"
                                        >
                                            <Lock className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                Step 1: Get Authentication
                                                Challenge
                                            </h3>
                                            <p className="text-purple-200/80 mb-4">
                                                Request a unique challenge from
                                                the server to begin the
                                                authentication process.
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                {[
                                                    "🔐 Secure random challenge",
                                                    "⏱️ Valid for 5 minutes",
                                                    "🔄 One-time use only",
                                                ].map((feature, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            delay: idx * 0.1,
                                                        }}
                                                        className="bg-slate-800/50 px-4 py-2 rounded-lg text-purple-200/90 border border-purple-500/20"
                                                    >
                                                        {feature}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGetChallenge}
                                    disabled={isChallengeLoading}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white text-lg font-bold shadow-2xl shadow-purple-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isChallengeLoading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Requesting Challenge...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-6 h-6" />
                                            Request Challenge
                                            <ArrowRight className="w-6 h-6" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Step 2: Show Challenge & Generate Proof */}
                        {zkLoginStep === LoginStep.Generate &&
                            !isProofLoading && (
                                <motion.div
                                    key="proof-generation"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            {/* Title */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring" }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                                    <Check className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">
                                                    Challenge Received
                                                </h3>
                                            </motion.div>

                                            {/* Cancel */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleCancel}
                                                disabled={isProofLoading}
                                                className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-all 
                                                    ${
                                                        isProofLoading
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                aria-label="Cancel login"
                                            >
                                                ✕
                                            </motion.button>
                                        </div>

                                        {/* Device type toggle */}
                                        <div className="flex items-center justify-center gap-4 mb-6">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setShowQRCode(true)
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                                    showQRCode
                                                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-purple-500/50"
                                                        : "bg-slate-800/50 text-purple-300 hover:bg-slate-800 border border-slate-700"
                                                }`}
                                            >
                                                <Smartphone className="w-4 h-4" />
                                                Mobile (QR Code)
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setShowQRCode(false)
                                                }
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                                    !showQRCode
                                                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-purple-500/50"
                                                        : "bg-slate-800/50 text-purple-300 hover:bg-slate-800 border border-slate-700"
                                                }`}
                                            >
                                                <Monitor className="w-4 h-4" />
                                                Desktop (Manual)
                                            </motion.button>
                                        </div>

                                        {showQRCode ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col items-center"
                                            >
                                                <p className="text-purple-200/80 mb-6 text-center">
                                                    Scan this QR code with your
                                                    wallet app to generate proof
                                                </p>
                                                <motion.div
                                                    initial={{
                                                        scale: 0.8,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        scale: 1,
                                                        opacity: 1,
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                    }}
                                                    className="bg-white p-6 rounded-2xl shadow-2xl"
                                                >
                                                    <div
                                                        className="w-64 h-64"
                                                        dangerouslySetInnerHTML={{
                                                            __html: generateQRCodeSVG(
                                                                challenge
                                                            ),
                                                        }}
                                                    />
                                                </motion.div>
                                                <div className="mt-6 bg-slate-900/60 rounded-xl p-4 border border-cyan-500/30 w-full backdrop-blur-sm">
                                                    <p className="text-cyan-200 font-mono text-xs break-all text-center">
                                                        {challenge}
                                                    </p>
                                                </div>
                                                <motion.p
                                                    animate={{
                                                        opacity: [0.5, 1, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                    }}
                                                    className="mt-4 text-purple-300/80 text-sm text-center"
                                                >
                                                    Waiting for proof from
                                                    mobile app...
                                                </motion.p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="bg-slate-900/60 rounded-xl p-4 border border-cyan-500/30 mb-6 backdrop-blur-sm">
                                                    <p className="text-cyan-200 font-mono text-sm break-all">
                                                        {challenge}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-lg font-semibold text-white mb-3">
                                                        Enter Your Private Key
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                showPrivateKeyInput
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            value={
                                                                privateKeyInput
                                                            }
                                                            onChange={(e) => {
                                                                setPrivateKeyInput(
                                                                    e.target
                                                                        .value
                                                                );
                                                                setError("");
                                                            }}
                                                            placeholder="0x..."
                                                            className="w-full px-6 py-4 pr-14 rounded-2xl bg-slate-900/60 border-2 border-slate-700 text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all backdrop-blur-sm"
                                                        />
                                                        <button
                                                            onMouseDown={() =>
                                                                setShowPrivateKeyInput(
                                                                    !showPrivateKeyInput
                                                                )
                                                            }
                                                            onMouseUp={() =>
                                                                setShowPrivateKeyInput(
                                                                    !showPrivateKeyInput
                                                                )
                                                            }
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                                                        >
                                                            {showPrivateKeyInput ? (
                                                                <EyeOff className="w-6 h-6" />
                                                            ) : (
                                                                <Eye className="w-6 h-6" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={
                                                        handleGenerateProof
                                                    }
                                                    disabled={
                                                        isProofLoading ||
                                                        !privateKeyInput
                                                    }
                                                    className="w-full mt-6 py-5 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white text-lg font-bold shadow-2xl shadow-purple-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isProofLoading ? (
                                                        <>
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                            Generating Proof...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Key className="w-6 h-6" />
                                                            Generate ZK Proof
                                                            <ArrowRight className="w-6 h-6" />
                                                        </>
                                                    )}
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        {isProofLoading && !showQRCode && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm"
                            >
                                <div className="flex flex-col items-center text-center mb-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50"
                                    >
                                        <Zap className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Generating Zero-Knowledge Proof
                                    </h3>
                                    <p className="text-purple-300/80">
                                        This may take 10-30 seconds. Please
                                        wait...
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2.5: Proof Generated Successfully */}
                        {zkLoginStep === LoginStep.Verify &&
                            !isSendingProof && (
                                <motion.div
                                    key="proof-success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="space-y-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-sm"
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    duration: 0.6,
                                                }}
                                                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-2xl shadow-emerald-500/50"
                                            >
                                                <motion.div
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: 0.2,
                                                    }}
                                                >
                                                    <CheckCircle2 className="w-14 h-14 text-white" />
                                                </motion.div>
                                            </motion.div>
                                            <motion.h3
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-3xl font-bold text-white mb-2"
                                            >
                                                Proof Generated Successfully!
                                            </motion.h3>
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-emerald-200/80 text-lg mb-6"
                                            >
                                                Your zero-knowledge proof is
                                                ready to be verified
                                            </motion.p>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="w-full max-w-md space-y-3 mb-6"
                                            >
                                                {[
                                                    {
                                                        icon: Lock,
                                                        label: "Challenge Received",
                                                        color: "emerald",
                                                    },
                                                    {
                                                        icon: Key,
                                                        label: "Proof Generated",
                                                        color: "emerald",
                                                    },
                                                    {
                                                        icon: Shield,
                                                        label: "Ready to Verify",
                                                        color: "emerald",
                                                    },
                                                ].map((item, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            delay:
                                                                0.6 + idx * 0.1,
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                                            <Check className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="text-sm font-medium text-emerald-200">
                                                            {item.label}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleVerify}
                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white text-lg font-bold shadow-2xl shadow-emerald-500/50 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Send className="w-6 h-6" />
                                        Verify Now
                                        <ArrowRight className="w-6 h-6" />
                                    </motion.button>
                                </motion.div>
                            )}

                        {/* Step 3: Verifying Proof */}
                        {zkLoginStep === LoginStep.Verify && isSendingProof && (
                            <motion.div
                                key="verifying"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50"
                                    >
                                        <Send className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Verifying Your Proof
                                    </h3>
                                    <p className="text-blue-300/80 mb-8">
                                        Securely submitting your zero-knowledge
                                        proof to the server...
                                    </p>

                                    {/* Progress indicators */}
                                    <div className="space-y-3 w-full max-w-md">
                                        {[
                                            {
                                                icon: Key,
                                                label: "Proof Generated",
                                                done: true,
                                            },
                                            {
                                                icon: Send,
                                                label: "Sending to Backend",
                                                done: false,
                                            },
                                            {
                                                icon: CheckCircle2,
                                                label: "Awaiting Verification",
                                                done: false,
                                            },
                                        ].map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: idx * 0.1,
                                                }}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                                    step.done
                                                        ? "bg-emerald-500/20 border border-emerald-500/30"
                                                        : idx === 1
                                                        ? "bg-blue-500/20 border border-blue-500/30"
                                                        : "bg-slate-800/50 border border-slate-700"
                                                }`}
                                            >
                                                {step.done ? (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                                        <Check className="w-5 h-5 text-white" />
                                                    </div>
                                                ) : idx === 1 ? (
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                                        <step.icon className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                )}
                                                <span
                                                    className={`text-sm font-medium ${
                                                        step.done
                                                            ? "text-emerald-200"
                                                            : idx === 1
                                                            ? "text-blue-200"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {step.label}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Verification Success */}
                        {zkLoginStep === LoginStep.Login && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-sm"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            duration: 0.6,
                                        }}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-2xl shadow-emerald-500/50"
                                    >
                                        <CheckCircle2 className="w-14 h-14 text-white" />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-3xl font-bold text-white mb-2"
                                    >
                                        Authentication Successful!
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-emerald-200/80 text-lg"
                                    >
                                        Redirecting to dashboard...
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Display */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-red-400 font-semibold mb-1">
                                                Error
                                            </h3>
                                            <p className="text-red-300 text-sm">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-slate-400">
                                    or
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setMode(AuthMode.Register);
                                setZkLoginStep(LoginStep.Challenge);
                                setError("");
                            }}
                            className="w-full py-4 rounded-xl border-2 border-purple-500/30 hover:border-purple-500/50 bg-slate-800/30 hover:bg-slate-800/50 text-white font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            Create New Identity
                        </motion.button>
                    </div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
