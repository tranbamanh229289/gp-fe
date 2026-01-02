import {
    LucideProps,
    Search,
    Trash2,
    FileJson,
    Plus,
    FileJson2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Schema } from "@/types/schema";
import { SchemaStatus, Slot } from "@/constants/schema";
import { IssuerModal } from "@/constants/issuer";
import DeleteModal from "./modal/DeleteModal";

interface SchemaProp {
    credentialTypeConfig: Record<
        string,
        {
            icon: React.ComponentType<LucideProps>;
            label: string;
            color: string;
            gradient: string;
        }
    >;
    showModal: IssuerModal;
    setShowModal: (modal: IssuerModal) => void;
}
const schemas = [
    {
        id: "1",
        issuerDID:
            "did:polygonid:polygon:main:2qE1BZ7gcmEoP2KppvFPCZqyzyb5tK9T6Gec5HFANQ",
        hash: "ca938857241db9451ea329256b9c06e5",
        title: "Citizen Identity Card",
        type: "CitizenIdentityCard",
        version: "1.0.0",
        description: "National citizen identification card schema",
        status: SchemaStatus.Active,
        isMerklized: true,
        schemaURL: "https://example.com/schemas/citizen-id.json",
        contextURL: "https://example.com/contexts/citizen-id.jsonld",
        attributes: [
            {
                name: "fullName",
                title: "Full Name",
                type: "string",
                description: "Full legal name of the citizen",
                required: true,
                slot: Slot.SlotDataA,
            },
            {
                name: "dateOfBirth",
                title: "Date of Birth",
                type: "date",
                description: "Date of birth",
                required: true,
                slot: Slot.SlotDataB,
            },
            {
                name: "idNumber",
                title: "ID Number",
                type: "string",
                description: "Unique identification number",
                required: true,
                slot: Slot.SlotIndexA,
            },
        ],
    },
    {
        id: "2",
        issuerDID:
            "did:polygonid:polygon:main:2qE1BZ7gcmEoP2KppvFPCZqyzyb5tK9T6Gec5HFANQ",
        hash: "db849768352ec0563fb356467c17b9f8",
        title: "Driver License",
        type: "DriverLicense",
        version: "1.0.0",
        description: "Official driver license credential schema",
        status: SchemaStatus.Active,
        isMerklized: false,
        schemaURL: "https://example.com/schemas/driver-license.json",
        contextURL: "https://example.com/contexts/driver-license.jsonld",
        attributes: [
            {
                name: "licenseNumber",
                title: "License Number",
                type: "string",
                description: "Driver license number",
                required: true,
                slot: Slot.SlotIndexA,
            },
            {
                name: "class",
                title: "License Class",
                type: "string",
                description: "Type of vehicle license",
                required: true,
                slot: Slot.SlotDataA,
            },
            {
                name: "expiryDate",
                title: "Expiry Date",
                type: "date",
                description: "License expiration date",
                required: true,
                slot: Slot.SlotDataB,
            },
        ],
    },
];

export default function Schemas({
    showModal,
    setShowModal,
    credentialTypeConfig,
}: SchemaProp) {
    const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const deleteSchema = () => {
        if (selectedSchema) {
            setShowModal(IssuerModal.Null);
            setSelectedSchema(null);
        }
    };

    const filteredSchemas = schemas.filter((schema) =>
        schema.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: SchemaStatus) => {
        switch (status) {
            case SchemaStatus.Active:
                return "bg-green-100 text-green-700";
            case SchemaStatus.Revoked:
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <motion.div
                key="schemas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Schema Management
                        </h2>
                        <p className="text-gray-600">
                            View and manage credential schemas
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowModal(IssuerModal.CreateSchema);
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Schema
                    </motion.button>
                </div>

                {/* Search */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search schemas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Schemas Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredSchemas.map((schema) => {
                        const config = credentialTypeConfig[schema.type] || {
                            icon: FileJson,
                            label: schema.type,
                            gradient: "from-gray-400 to-gray-600",
                        };
                        const IconComponent = config.icon;

                        return (
                            <motion.div
                                key={schema.id}
                                whileHover={{ y: -4 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                                        >
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {schema.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium">
                                                v{schema.version} •{" "}
                                                {config.label}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                            schema.status
                                        )}`}
                                    >
                                        {schema.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4">
                                    {schema.description}
                                </p>

                                {/* Schema Info */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                        <span className="text-xs font-semibold text-gray-600">
                                            Merklized
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-bold ${
                                                schema.isMerklized
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {schema.isMerklized ? "Yes" : "No"}
                                        </span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <span className="text-xs font-semibold text-gray-600 block mb-1">
                                            Hash
                                        </span>
                                        <span className="font-mono text-xs text-gray-800 break-all">
                                            {schema.hash}
                                        </span>
                                    </div>
                                </div>

                                {/* Attributes */}
                                <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                                    <p className="text-xs font-bold text-purple-900 uppercase tracking-wide mb-3">
                                        Attributes ({schema.attributes.length})
                                    </p>
                                    <div className="space-y-2">
                                        {schema.attributes
                                            .slice(0, 3)
                                            .map((attr, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-white/80 backdrop-blur-sm"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-xs font-bold text-gray-900">
                                                            {attr.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {attr.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-bold">
                                                            {attr.type}
                                                        </span>
                                                        {attr.required && (
                                                            <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        {schema.attributes.length > 3 && (
                                            <p className="text-xs text-gray-500 text-center">
                                                +{schema.attributes.length - 3}{" "}
                                                more
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedSchema(schema);
                                            setShowModal(
                                                IssuerModal.DetailSchema
                                            );
                                        }}
                                        className="flex-1 px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedSchema(schema);
                                            setShowModal(
                                                IssuerModal.DeleteSchema
                                            );
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

                {filteredSchemas.length === 0 && (
                    <div className="text-center py-12">
                        <FileJson className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg font-semibold">
                            No schemas found
                        </p>
                        <p className="text-gray-500 text-sm">
                            {searchQuery
                                ? "Try adjusting your search"
                                : "No schemas available"}
                        </p>
                    </div>
                )}

                {showModal === IssuerModal.DeleteSchema && (
                    <DeleteModal
                        setShowModal={setShowModal}
                        onConfirm={deleteSchema}
                    />
                )}
            </motion.div>
        </div>
    );
}
