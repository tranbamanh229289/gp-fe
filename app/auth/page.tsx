"use client";

import Login from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { AuthMode } from "@/constants/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function IdentityAuth() {
    const [mode, setMode] = useState<AuthMode>(AuthMode.Login);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl">
                <AnimatePresence mode="wait">
                    {mode === AuthMode.Login && <Login setMode={setMode} />}

                    {mode === AuthMode.Register && (
                        <Register setMode={setMode} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
