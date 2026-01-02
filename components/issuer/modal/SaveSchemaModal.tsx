import { DocumentType } from "@/constants/document";
import { IssuerModal } from "@/constants/issuer";
import { SchemaStatus, Slot } from "@/constants/schema";
import { Attribute, Schema } from "@/types/schema";
import { motion } from "framer-motion";
import {
    Database,
    FileText,
    Plus,
    Save,
    Sparkles,
    Trash2,
    X,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface SaveSchemaModalProps {
    showModal: IssuerModal;
    setShowModal: (modal: IssuerModal) => void;
    schema?: Schema;
}

const fieldTypes = ["string", "integer", "number", "date", "boolean"];

const currentType = {
    type: DocumentType.CitizenIdentity,
    label: "Citizen Identity",
    icon: "🪪",
    gradient: "from-fuchsia-500 → to-purple-600",
};
export default function SaveSchemaModal({
    setShowModal,
}: SaveSchemaModalProps) {
    const [formData, setFormData] = useState<Partial<Schema>>({
        title: "",
        type: "",
        version: "1.0.0",
        description: "",
        isMerklized: false,
    });

    const [attributes, setAttributes] = useState<Attribute[]>([
        {
            name: "",
            title: "",
            type: "string",
            description: "",
            required: false,
            slot: Slot.SlotIndexA,
        },
    ]);

    const addAttribute = () => {
        setAttributes([
            ...attributes,
            {
                name: "",
                title: "",
                type: "string",
                description: "",
                required: false,
                slot: Slot.SlotIndexA,
            },
        ]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (
        index: number,
        key: keyof Attribute,
        value: any
    ) => {
        const updated = [...attributes];
        updated[index] = { ...updated[index], [key]: value };
        setAttributes(updated);
    };

    const handleSubmit = () => {
        const schemaData: Partial<Schema> = {
            ...formData,
            attributes,
        };
        console.log("Schema data:", schemaData);
        // Handle submit logic here
    };

    const isFormValid = () => {
        return (
            formData.title &&
            formData.type &&
            formData.version &&
            attributes.length > 0 &&
            attributes.every((attr) => attr.name && attr.title)
        );
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
                className="w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div
                    className={`relative bg-gradient-to-r ${currentType.gradient} p-8 overflow-hidden`}
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
                                {currentType.icon}
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {"Create"} Schema
                                    <Sparkles className="w-6 h-6" />
                                </h3>
                                <p className="text-white/90 mt-1 font-medium text-lg">
                                    Define credential structure and attributes
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white">
                    {/* Basic Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2 rounded-xl bg-gradient-to-br ${currentType.gradient}`}
                            >
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                Basic Information
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Schema Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., KYC"
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            type: e.target.value,
                                        })
                                    }
                                    placeholder="KYCAgeCredential"
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Version{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.version}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            version: e.target.value,
                                        })
                                    }
                                    placeholder="1.0.0"
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isMerklized}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isMerklized: e.target.checked,
                                            })
                                        }
                                        className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">
                                        Is Merklization
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-8">
                                    Use Merkle tree for selective disclosure
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe the purpose of this schema..."
                                    rows={3}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Attributes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-xl bg-gradient-to-br ${currentType.gradient}`}
                                >
                                    <Database className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">
                                    Attributes
                                </h4>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addAttribute}
                                className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Attribute
                            </motion.button>
                        </div>

                        {attributes.length === 0 && (
                            <div className="p-8 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 text-center">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">
                                    No attributes added yet
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Click Add Attribute to define schema fields
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {attributes.map((attr, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 rounded-2xl bg-white border-2 border-gray-200 space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                                    Name{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={attr.name}
                                                    onChange={(e) =>
                                                        updateAttribute(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. birthday"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                                    Title{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={attr.title}
                                                    onChange={(e) =>
                                                        updateAttribute(
                                                            index,
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., Date of Birth"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-2">
                                                    Type{""}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    value={attr.type}
                                                    onChange={(e) =>
                                                        updateAttribute(
                                                            index,
                                                            "type",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                                >
                                                    {fieldTypes.map((type) => (
                                                        <option
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {!formData.isMerklized && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                                                        Slot
                                                    </label>
                                                    <select
                                                        value={attr.slot}
                                                        onChange={(e) =>
                                                            updateAttribute(
                                                                index,
                                                                "slot",
                                                                e.target
                                                                    .value as Slot
                                                            )
                                                        }
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    >
                                                        <option
                                                            value={
                                                                Slot.SlotIndexA
                                                            }
                                                        >
                                                            Slot IndexA
                                                        </option>
                                                        <option
                                                            value={
                                                                Slot.SlotIndexB
                                                            }
                                                        >
                                                            Slot IndexB
                                                        </option>
                                                        <option
                                                            value={
                                                                Slot.SlotDataA
                                                            }
                                                        >
                                                            Slot ValueA
                                                        </option>
                                                        <option
                                                            value={
                                                                Slot.SlotDataB
                                                            }
                                                        >
                                                            Slot ValueB
                                                        </option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() =>
                                                removeAttribute(index)
                                            }
                                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                                            Description{""}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={attr.description}
                                            onChange={(e) =>
                                                updateAttribute(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Describe this attribute..."
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={attr.required}
                                                onChange={(e) =>
                                                    updateAttribute(
                                                        index,
                                                        "required",
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                                            />
                                            <span className="text-xs font-semibold text-gray-600">
                                                Required field
                                            </span>
                                        </label>
                                    </div>
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
                            whileHover={{
                                scale: isFormValid() ? 1.02 : 1,
                            }}
                            whileTap={{
                                scale: isFormValid() ? 0.98 : 1,
                            }}
                            onClick={() => {
                                if (isFormValid()) {
                                    handleSubmit();
                                    setShowModal(IssuerModal.Null);
                                }
                            }}
                            disabled={!isFormValid()}
                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all ${
                                isFormValid()
                                    ? `bg-gradient-to-r ${currentType.gradient} hover:shadow-xl`
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Save size={20} />
                                "Create" Schema
                            </div>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
