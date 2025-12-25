import { AuthMode, AuthRole, RegisterStep } from "@/constants/auth";
import { generateBabyJubWallet } from "@/helper/babyjub";
import { useIdentityStateStore } from "@/store/identity.store";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    Copy,
    Download,
    Eye,
    EyeOff,
    Fingerprint,
    Key,
    Loader2,
    Shield,
    Sparkles,
    UserCircle,
    Building2,
    CheckCircle,
} from "lucide-react";
import { useState } from "react";

interface RegisterProp {
    setMode: (mode: AuthMode) => void;
}

export function Register({ setMode }: RegisterProp) {
    // Registration states
    const [role, setRole] = useState<AuthRole>(AuthRole.Holder);
    const [registerStep, setRegisterStep] = useState<RegisterStep>(
        RegisterStep.role
    );

    const [showPrivateKeyGenerated, setShowPrivateKeyGenerated] =
        useState(false);
    const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
    const [privateKeyGenerated, setPrivateKeyGenerated] = useState<string>("");

    const [nameCopied, setNameCopied] = useState(false);
    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");

    const [didCopied, setDIDCopied] = useState(false);
    const did = useIdentityStateStore((state) => state.did);
    const [isCreateEntityLoading, setIsCreateEntityLoading] = useState(false);
    const state = useIdentityStateStore((state) => state.state);

    // Method register
    const resetRegisterState = () => {
        setMode(AuthMode.Login);
        setRole(AuthRole.Holder);
        setRegisterStep(RegisterStep.role);
        setShowPrivateKeyGenerated(false);
        setPrivateKeyCopied(false);
        setPrivateKeyGenerated("");
        setNameCopied(false);
        setName("");
        setNameError("");
        setDIDCopied(false);
    };

    const backToSignIn = () => {
        setMode(AuthMode.Login);
        setRole(AuthRole.Holder);
        setName("");
        setNameError("");
    };

    const back = () => {
        setRegisterStep(RegisterStep.role);
        setShowPrivateKeyGenerated(false);
        setPrivateKeyCopied(false);
        setPrivateKeyGenerated("");
        setNameCopied(false);
    };

    const register = useIdentityStateStore((state) => state.register);

    const generateIdentity = async () => {
        if (name === "") {
            setNameError("Name is required !");
        } else {
            const babyJub = await generateBabyJubWallet();
            setPrivateKeyGenerated(babyJub.privateKey);
            setRegisterStep(RegisterStep.wallet);
        }
    };

    const createIdentity = async () => {
        setIsCreateEntityLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await register(privateKeyGenerated, name, role);
        setIsCreateEntityLoading(false);
        setRegisterStep(RegisterStep.identity);
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setPrivateKeyCopied(false);
        setNameCopied(false);
        setDIDCopied(false);
        if (type === "privateKey") setPrivateKeyCopied(true);
        if (type === "name") setNameCopied(true);
        if (type === "did") setDIDCopied(true);
        setTimeout(() => {
            setPrivateKeyCopied(false);
            setNameCopied(false);
            setDIDCopied(false);
        }, 2000);
    };

    const downloadPrivateKey = () => {
        const blob = new Blob([privateKeyGenerated], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lala-id-private-key-${name || "user"}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const roleInfo = [
        {
            role: AuthRole.Holder,
            title: "Holder",
            description: "Receive and manage your digital credentials",
            icon: UserCircle,
            gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
            features: [
                "Store credentials securely",
                "Generate ZK proofs",
                "Control your data",
            ],
        },
        {
            role: AuthRole.Issuer,
            title: "Issuer",
            description: "Issue verifiable credentials to users",
            icon: Building2,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            features: [
                "Create credential schemas",
                "Issue credentials",
                "Manage holders",
            ],
        },
        {
            role: AuthRole.Verifier,
            title: "Verifier",
            description: "Verify zero-knowledge proofs",
            icon: CheckCircle,
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            features: [
                "Create proof requests",
                "Verify credentials",
                "Validate identity",
            ],
        },
    ];

    const roleColors = {
        [AuthRole.Holder]: "from-violet-500 via-purple-500 to-fuchsia-500",
        [AuthRole.Issuer]: "from-blue-500 via-cyan-500 to-teal-500",
        [AuthRole.Verifier]: "from-emerald-500 via-teal-500 to-cyan-500",
    };

    return (
        <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto"
        >
            <AnimatePresence mode="wait">
                {registerStep === RegisterStep.role && (
                    <motion.div
                        key="role-selection"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/30 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-12 shadow-2xl shadow-purple-500/10"
                    >
                        {/* Header */}
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50"
                            >
                                <Fingerprint className="w-14 h-14 text-white" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent mb-3"
                            >
                                Create Your Identity
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-purple-300/80 text-lg"
                            >
                                Choose your role in the ecosystem
                            </motion.p>
                        </div>

                        {/* Role Selection Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {roleInfo.map((r, idx) => {
                                const Icon = r.icon;
                                const isSelected = role === r.role;
                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.3 }}
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setRole(r.role)}
                                        className={`relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                                            isSelected
                                                ? "border-purple-500 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent shadow-lg shadow-purple-500/20"
                                                : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
                                        }`}
                                    >
                                        {/* Animated background gradient */}
                                        {isSelected && (
                                            <motion.div
                                                className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-10`}
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.1, 0.15, 0.1],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        )}

                                        <div className="relative">
                                            {/* Icon */}
                                            <motion.div
                                                animate={
                                                    isSelected
                                                        ? {
                                                              rotate: [
                                                                  0, 5, -5, 0,
                                                              ],
                                                          }
                                                        : {}
                                                }
                                                transition={{
                                                    duration: 2,
                                                    repeat: isSelected
                                                        ? Infinity
                                                        : 0,
                                                }}
                                                className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${
                                                    r.gradient
                                                } flex items-center justify-center shadow-lg ${
                                                    isSelected
                                                        ? "shadow-purple-500/50"
                                                        : "shadow-slate-900/50"
                                                }`}
                                            >
                                                <Icon className="w-8 h-8 text-white" />
                                            </motion.div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {r.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-purple-300/80 text-sm mb-4">
                                                {r.description}
                                            </p>

                                            {/* Features */}
                                            <div className="space-y-2 text-left">
                                                {r.features.map(
                                                    (feature, fIdx) => (
                                                        <motion.div
                                                            key={fIdx}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    idx * 0.1 +
                                                                    fIdx *
                                                                        0.05 +
                                                                    0.4,
                                                            }}
                                                            className="flex items-center gap-2 text-purple-200/90 text-xs"
                                                        >
                                                            <div
                                                                className={`w-1.5 h-1.5 rounded-full ${
                                                                    isSelected
                                                                        ? "bg-purple-400"
                                                                        : "bg-slate-500"
                                                                }`}
                                                            />
                                                            {feature}
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>

                                            {/* Selected indicator */}
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
                                                >
                                                    <Check className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Name Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4 mb-8"
                        >
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Display Name{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (nameError) setNameError("");
                                    }}
                                    required
                                    placeholder="Enter your name"
                                    className={`w-full px-6 py-4 rounded-2xl bg-slate-900/60 border-2 ${
                                        nameError
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-700 focus:border-purple-500"
                                    } text-white text-lg placeholder:text-slate-500 focus:outline-none transition-all backdrop-blur-sm`}
                                />
                                <AnimatePresence>
                                    {nameError && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mt-2 text-sm text-red-400 flex items-center gap-2"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            {nameError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generateIdentity}
                                className={`w-full py-5 rounded-2xl bg-gradient-to-r ${roleColors[role]} hover:shadow-2xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3`}
                            >
                                <Key className="w-6 h-6" />
                                Generate Identity
                                <ArrowRight className="w-6 h-6" />
                            </motion.button>

                            <button
                                onClick={backToSignIn}
                                className="w-full py-3 text-purple-300/80 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {registerStep === RegisterStep.wallet && (
                    <motion.div
                        key="wallet-generated"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/30 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-12 shadow-2xl shadow-purple-500/10"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/50"
                            >
                                <Check className="w-14 h-14 text-white" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold text-white mb-3"
                            >
                                Identity Wallet Generated!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-emerald-300/80 text-lg"
                            >
                                Your wallet is ready
                            </motion.p>
                        </div>

                        {/* Warning Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm"
                        >
                            <div className="flex gap-4">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                </motion.div>
                                <div>
                                    <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Important: Save Your Private Key
                                    </h3>
                                    <p className="text-amber-200/80 text-sm leading-relaxed">
                                        This is the ONLY time you will see your
                                        private key. Store it securely. If you
                                        lose it, you will lose access to your
                                        identity forever.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Identity Details */}
                        <div className="space-y-4 mb-8">
                            {/* Name */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-purple-300 text-sm font-semibold flex items-center gap-2">
                                        <UserCircle className="w-4 h-4" />
                                        Name
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            copyToClipboard(name, "name")
                                        }
                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        {nameCopied ? (
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                </div>
                                <p className="text-white font-medium text-lg break-all">
                                    {name}
                                </p>
                            </motion.div>

                            {/* Private Key */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-500/10 border border-red-500/30 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-red-300 text-sm font-semibold flex items-center gap-2">
                                        <Key className="w-4 h-4" />
                                        Private Key (Keep Secret!)
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onMouseDown={() =>
                                                setShowPrivateKeyGenerated(
                                                    !showPrivateKeyGenerated
                                                )
                                            }
                                            onMouseUp={() =>
                                                setShowPrivateKeyGenerated(
                                                    !showPrivateKeyGenerated
                                                )
                                            }
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            {showPrivateKeyGenerated ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() =>
                                                copyToClipboard(
                                                    privateKeyGenerated,
                                                    "privateKey"
                                                )
                                            }
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            {privateKeyCopied ? (
                                                <Check className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-5 h-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="bg-slate-900/80 rounded-xl p-4 font-mono text-sm break-all border border-red-500/20">
                                    {showPrivateKeyGenerated ? (
                                        <span className="text-red-200">
                                            {privateKeyGenerated}
                                        </span>
                                    ) : (
                                        <span className="text-slate-600">
                                            ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={back}
                                className="flex-1 py-4 rounded-2xl bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-white font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={downloadPrivateKey}
                                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Backup
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={createIdentity}
                                disabled={isCreateEntityLoading}
                                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreateEntityLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Identity...
                                    </>
                                ) : (
                                    <>
                                        Create Identity
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {registerStep === RegisterStep.identity && (
                    <motion.div
                        key="identity-created"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/30 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-12 shadow-2xl shadow-purple-500/10"
                    >
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/50"
                            >
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <Check className="w-14 h-14 text-white" />
                                </motion.div>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold text-white mb-3"
                            >
                                Identity Created Successfully!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-emerald-300/80 text-lg"
                            >
                                Your decentralized identity is ready
                            </motion.p>
                        </div>

                        {/* Celebration Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center gap-2 mb-8"
                        >
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 0, opacity: 0 }}
                                    animate={{
                                        y: [-20, -40, -20],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                >
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Identity Details */}
                        <div className="space-y-4 mb-8">
                            {/* DID */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 backdrop-blur-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-purple-300 text-sm font-semibold flex items-center gap-2">
                                        <Fingerprint className="w-4 h-4" />
                                        DID (Decentralized Identifier)
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            copyToClipboard(did, "did")
                                        }
                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        {didCopied ? (
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                </div>
                                <p className="text-white font-mono text-sm break-all bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
                                    {did}
                                </p>
                            </motion.div>

                            {/* State Hash */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
                            >
                                <span className="text-purple-300 text-sm font-semibold block mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    State Hash
                                </span>
                                <p className="text-white font-mono text-sm break-all bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    {state}
                                </p>
                            </motion.div>
                        </div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setMode(AuthMode.Login);
                                    resetRegisterState();
                                }}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold text-lg shadow-2xl shadow-purple-500/50 transition-all flex items-center justify-center gap-3"
                            >
                                Continue to Dashboard
                                <ArrowRight className="w-6 h-6" />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
