import { useDocumentStore } from "@/store/document.store";
import { DocumentType, documentTypeFields } from "@/constants/document";
import {
    credentialTypeConfig,
    documentTypes,
    IssuerItemSelectedType,
    IssuerModal,
} from "@/constants/issuer";
import { motion } from "framer-motion";
import {
    AlertCircle,
    FileText,
    Save,
    User,
    X,
    Sparkles,
    Loader2,
} from "lucide-react";
import { useState } from "react";
import { DocumentData } from "@/types/document";
import { IssuerItemSelected } from "@/types/issuer";

interface SaveModalProps {
    itemSelected: IssuerItemSelected;
    itemSelectedType: IssuerItemSelectedType;
    showModal: IssuerModal;
    setShowModal: (modal: IssuerModal) => void;
}

export default function SaveDocumentModal({
    itemSelected,
    itemSelectedType,
    showModal,
    setShowModal,
}: SaveModalProps) {
    const [selectedType, setSelectedType] = useState<DocumentType>(
        itemSelectedType as DocumentType
    );

    const [formData, setFormData] = useState<IssuerItemSelected>(itemSelected);
    const [holderDID, setHolderDID] = useState(itemSelected.holderDID ?? "");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const documentField = documentTypeFields[selectedType];
    const configUI = credentialTypeConfig[selectedType];

    const create = useDocumentStore((state) => state.create);
    const update = useDocumentStore((state) => state.update);
    const loading = useDocumentStore((state) => state.loading);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!holderDID) newErrors.holderDID = "Holder DID is required";

        documentField.forEach((field) => {
            if (field.required && !formData[field.name as keyof DocumentData]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const data = {
                ...formData,
                holderDID: holderDID,
            };
            if (showModal == IssuerModal.CreateDocument) {
                await create(selectedType as DocumentType, data);
            } else {
                if (showModal == IssuerModal.EditDocument) {
                    await update(
                        selectedType as DocumentType,
                        itemSelected.id,
                        data
                    );
                }
            }
            setShowModal(IssuerModal.Null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/50 to-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(IssuerModal.Null)}
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
                className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header with Gradient */}
                <div
                    className={`relative bg-gradient-to-r ${configUI.gradient} p-8 overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                }}
                                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg border border-white/30"
                            >
                                {
                                    <configUI.icon className="w-10 h-10 text-white" />
                                }
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {showModal === IssuerModal.CreateDocument
                                        ? "Create New"
                                        : "Edit"}{" "}
                                    Credential
                                    <Sparkles className="w-6 h-6" />
                                </h3>
                                <p className="text-white/90 mt-1 font-medium text-lg">
                                    {configUI.label}
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
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white">
                    {/* Type Selection */}
                    {showModal === IssuerModal.CreateDocument && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-1 h-6 rounded-full bg-gradient-to-b ${configUI.gradient}`}
                                ></div>
                                <h4 className="text-lg font-bold text-gray-900">
                                    Select Document Type
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                {documentTypes.map((field, index) => {
                                    const item = credentialTypeConfig[field];
                                    return (
                                        <motion.button
                                            key={field}
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            transition={{
                                                delay: index * 0.05,
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                y: -4,
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedType(field);
                                                setFormData({} as DocumentData);
                                            }}
                                            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                                                selectedType === field
                                                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg border-transparent`
                                                    : `${item.bgColor} ${item.borderColor} hover:shadow-md`
                                            }`}
                                        >
                                            {selectedType === field && (
                                                <motion.div
                                                    layoutId="selectedType"
                                                    className="absolute inset-0 bg-white/10 rounded-2xl"
                                                    transition={{
                                                        type: "spring",
                                                        damping: 20,
                                                    }}
                                                />
                                            )}
                                            <div className="relative flex">
                                                <div className="text-4xl mb-2">
                                                    {
                                                        <item.icon
                                                            className={`w-5 h-5 mr-1 ${
                                                                selectedType ===
                                                                field
                                                                    ? "text-white"
                                                                    : item.textColor
                                                            }`}
                                                        />
                                                    }
                                                </div>
                                                <div
                                                    className={`text-sm font-bold ${
                                                        selectedType === field
                                                            ? "text-white"
                                                            : item.textColor
                                                    }`}
                                                >
                                                    {item.label}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Holder Information */}
                    {
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-xl bg-gradient-to-br ${configUI.gradient}`}
                                >
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">
                                    Holder Information
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Holder DID{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    {showModal ===
                                    IssuerModal.CreateDocument ? (
                                        <input
                                            type="text"
                                            value={holderDID}
                                            onChange={(e) =>
                                                setHolderDID(e.target.value)
                                            }
                                            placeholder="did:polygonid:polygon:mumbai:..."
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 font-mono text-sm ${
                                                errors.holderDID
                                                    ? "border-red-400 bg-red-50"
                                                    : "border-gray-200 bg-white"
                                            } focus:ring-4 ${
                                                configUI.ringColor
                                            } focus:ring-opacity-20 focus:border-opacity-50 outline-none transition-all`}
                                        />
                                    ) : (
                                        <div
                                            className={`w-full  py-3.5 rounded-xl  font-mono text-sm ${
                                                errors.holderDID
                                                    ? "border-red-400 bg-red-50"
                                                    : "border-gray-200 bg-white"
                                            } focus:ring-4 ${
                                                configUI.ringColor
                                            } focus:ring-opacity-20 focus:border-opacity-50 outline-none transition-all`}
                                        >
                                            {" "}
                                            {holderDID}{" "}
                                        </div>
                                    )}
                                    {errors.holderDID && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                            <AlertCircle size={16} />{" "}
                                            {errors.holderDID}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    }

                    {/* Document Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2 rounded-xl bg-gradient-to-br ${configUI.gradient}`}
                            >
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                Document Details
                            </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {documentField.map((field, index) => (
                                <motion.div
                                    key={field.name}
                                    initial={{
                                        opacity: 0,
                                        x: -20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        delay: 0.3 + index * 0.03,
                                    }}
                                    className={
                                        field.name === "status"
                                            ? "md:col-span-1"
                                            : ""
                                    }
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {field.label}{" "}
                                        {field.required && (
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    {field.type === "select" ? (
                                        <select
                                            value={
                                                formData[
                                                    field.name as keyof DocumentData
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [field.name]:
                                                        e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors[field.name]
                                                    ? "border-red-400 bg-red-50"
                                                    : "border-gray-200 bg-white"
                                            } focus:ring-4 ${
                                                configUI.ringColor
                                            } focus:ring-opacity-20 focus:border-opacity-50 outline-none transition-all`}
                                        >
                                            <option value="" disabled>
                                                Select {field.label}
                                            </option>
                                            {field.options &&
                                                field.options.map((opt) => (
                                                    <option
                                                        key={opt}
                                                        value={opt}
                                                    >
                                                        {opt}
                                                    </option>
                                                ))}
                                        </select>
                                    ) : field.type === "date" ? (
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={
                                                    formData[
                                                        field.name as keyof DocumentData
                                                    ]
                                                        ? new Date(
                                                              formData[
                                                                  field.name as keyof DocumentData
                                                              ] as string
                                                          )
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    // Convert to ISO-8601 format for Go time.Time
                                                    const dateValue =
                                                        e.target.value;
                                                    if (dateValue) {
                                                        // Create date at midnight UTC
                                                        const isoDate =
                                                            new Date(
                                                                dateValue +
                                                                    "T00:00:00.000Z"
                                                            ).toISOString();
                                                        setFormData({
                                                            ...formData,
                                                            [field.name]:
                                                                isoDate,
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            [field.name]: "",
                                                        });
                                                    }
                                                }}
                                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                    errors[field.name]
                                                        ? "border-red-400 bg-red-50"
                                                        : "border-gray-200 bg-white"
                                                } focus:ring-4 ${
                                                    configUI.ringColor
                                                } focus:ring-opacity-20 focus:border-opacity-50 outline-none transition-all
                                                                text-gray-700 font-medium
                                                                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                                                [&::-webkit-calendar-picker-indicator]:opacity-60
                                                                [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                                                                [&::-webkit-calendar-picker-indicator]:transition-opacity`}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={
                                                formData[
                                                    field.name as keyof DocumentData
                                                ] || ""
                                            }
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    [field.name]:
                                                        field.type === "number"
                                                            ? Number(
                                                                  e.target.value
                                                              )
                                                            : e.target.value,
                                                });
                                            }}
                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors[field.name]
                                                    ? "border-red-400 bg-red-50"
                                                    : "border-gray-200 bg-white"
                                            } focus:ring-4 ${
                                                configUI.ringColor
                                            } focus:ring-opacity-20 focus:border-opacity-50 outline-none transition-all`}
                                        />
                                    )}

                                    {errors[field.name] && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                            <AlertCircle size={16} />{" "}
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t-2 border-gray-100 bg-white">
                    <div className="flex flex-col-reverse sm:flex-row gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowModal(IssuerModal.Null)}
                            className="flex-1 py-4 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all bg-gradient-to-r ${configUI.gradient} hover:shadow-xl`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Save size={20} />
                                )}
                                {showModal === IssuerModal.CreateDocument
                                    ? "Create"
                                    : "Update"}{" "}
                                Credential
                            </div>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
