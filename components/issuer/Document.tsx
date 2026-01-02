import {
    Edit,
    FileText,
    Plus,
    Search,
    Trash2,
    LucideProps,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DocumentStatus, DocumentType } from "@/constants/document";
import { IssuerItemSelectedType, IssuerModal } from "@/constants/issuer";
import { useDocumentStore } from "@/store/document.store";
import { IssuerItemSelected } from "@/types/issuer";
import DeleteModal from "./modal/DeleteModal";

interface DocumentProp {
    showModal: IssuerModal;
    itemSelected: IssuerItemSelected;
    credentialTypeConfig: Record<
        string,
        {
            icon: React.ComponentType<LucideProps>;
            label: string;
            color: string;
            gradient: string;
        }
    >;
    setItemSelected: (item: IssuerItemSelected) => void;
    setItemSelectedType: (item: IssuerItemSelectedType) => void;
    setShowModal: (modal: IssuerModal) => void;
}

export default function Documents({
    itemSelected,
    credentialTypeConfig,
    showModal,
    setShowModal,
    setItemSelected,
    setItemSelectedType,
}: DocumentProp) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<DocumentType>(
        DocumentType.CitizenIdentity
    );
    const [filterStatus, setFilterStatus] = useState<DocumentStatus | "All">(
        "All"
    );

    const { documents, getAll, remove } = useDocumentStore();
    // Filter doc based on active tab
    const filteredDocs = documents[activeTab].filter((doc) => {
        const matchesFilter =
            filterStatus === "All" ? true : filterStatus === doc.status;
        const matchesSearch = JSON.stringify(doc)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchesSearch && matchesFilter;
    });

    const removeDocument = async () => {
        await remove(activeTab, itemSelected.id, DocumentStatus.Revoke);
    };

    useEffect(() => {
        getAll(activeTab);
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Documents
                        </h2>
                        <p className="text-gray-600">
                            Manage documents for holder
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowModal(IssuerModal.CreateDocument);
                            setItemSelected({} as IssuerItemSelected);
                            setItemSelectedType(activeTab);
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Record
                    </motion.button>
                </div>

                {/* Tabs - Row 2: Document Types Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(credentialTypeConfig).map(
                        ([type, config]) => {
                            const IconComponent = config.icon;
                            return (
                                <motion.button
                                    key={type}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setActiveTab(type as DocumentType);
                                    }}
                                    className={`px-4 py-3 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${
                                        activeTab === type
                                            ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                                            : "bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <IconComponent className="w-6 h-6" />
                                    <span className="text-sm text-center leading-tight">
                                        {config.label}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs ${
                                            activeTab === type
                                                ? "bg-white/20"
                                                : "bg-gray-100"
                                        }`}
                                    ></span>
                                </motion.button>
                            );
                        }
                    )}
                </div>

                {/* Search and Filters */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or any field..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            />
                        </div>
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(
                                        e.target.value as DocumentStatus | "All"
                                    )
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                            >
                                <option value="All">All Status</option>
                                <option value={DocumentStatus.Active}>
                                    Active
                                </option>
                                <option value={DocumentStatus.Expired}>
                                    Expired
                                </option>
                                <option value={DocumentStatus.Revoke}>
                                    Revoked
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Credentials Grid */}
                {filteredDocs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map((doc, index) => {
                            const config = credentialTypeConfig[activeTab];

                            const IconComponent = config.icon;

                            return (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                            >
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                {/* <h3 className="font-bold text-gray-900">
                                                    {doc.holderName}
                                                </h3> */}
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {config.label}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                doc.status ===
                                                DocumentStatus.Active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : doc.status ===
                                                      DocumentStatus.Revoke
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {doc.status}
                                        </span>
                                    </div>
                                    {/* Display key fields */}
                                    <div className="space-y-2 mb-4">
                                        {Object.entries(doc)
                                            .filter(
                                                ([key]) =>
                                                    ![
                                                        "id",
                                                        "status",
                                                        "holderDID",
                                                        "issuerDID",
                                                    ].includes(key)
                                            )
                                            .map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                                >
                                                    <span className="text-sm text-gray-600 font-medium capitalize">
                                                        {key
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .trim()}
                                                        :
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] truncate">
                                                        {typeof value ===
                                                            "string" &&
                                                        value.includes("Z")
                                                            ? new Date(
                                                                  value
                                                              ).toLocaleDateString(
                                                                  "en-GB"
                                                              )
                                                            : value}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setShowModal(
                                                    IssuerModal.EditDocument
                                                );
                                                setItemSelected(doc);
                                            }}
                                            className="flex-1 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(
                                                    IssuerModal.DeleteDocument
                                                );
                                                setItemSelected(doc);
                                                setItemSelectedType(activeTab);
                                            }}
                                            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">
                            No credentials found
                        </p>
                    </div>
                )}
            </motion.div>
            {showModal === IssuerModal.DeleteDocument && (
                <DeleteModal
                    setShowModal={setShowModal}
                    onConfirm={removeDocument}
                />
            )}
        </div>
    );
}
