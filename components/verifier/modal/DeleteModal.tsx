import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, X, ShieldAlert, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteModal({ onClose, onConfirm }: DeleteModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const handleRemove = async () => {
        setLoading(true);
        await onConfirm();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gradient-to-br from-red-900/40 via-gray-900/60 to-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 40, opacity: 0 }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header with Red Gradient */}
                    <div className="relative bg-gradient-to-r from-red-500 to-rose-500 p-8 overflow-hidden">
                        <div className="relative">
                            {/* Close Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="absolute -top-2 -right-2 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm border border-white/30"
                            >
                                <X size={20} />
                            </motion.button>

                            {/* Warning Icon with Animation */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{
                                    scale: 1,
                                    rotate: 0,
                                }}
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                    delay: 0.1,
                                }}
                                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30"
                            >
                                <AlertTriangle className="w-10 h-10 text-white" />
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-bold text-white text-center"
                            >
                                Delete Item?
                            </motion.h3>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-700 text-center text-lg"
                        >
                            Are you sure you want to delete this item?
                        </motion.p>

                        {/* Warning Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative p-5 rounded-2xl bg-red-50 border-2 border-red-200 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-50"></div>
                            <div className="relative flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                                    <ShieldAlert className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-red-900 mb-1">
                                        Warning: Permanent Action
                                    </p>
                                    <p className="text-sm text-red-700 leading-relaxed">
                                        This action cannot be undone. All data
                                        associated with this credential will be
                                        permanently deleted from the system.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col-reverse sm:flex-row gap-3"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="flex-1 py-4 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    handleRemove();
                                }}
                                className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                                Delete Forever
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
            )
        </AnimatePresence>
    );
}
