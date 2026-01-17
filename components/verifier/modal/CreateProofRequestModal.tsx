import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VerifierModal } from "@/constants/verifier";
import {
    CircuitId,
    JsonDocumentObject,
    Operators,
    ProofType,
    QueryOperators,
} from "@0xpolygonid/js-sdk";
import { useSchemaStore } from "@/store/schema.store";
import { Attribute, Schema } from "@/types/schema";
import {
    Loader2,
    X,
    Plus,
    Users,
    Edit2,
    CheckIcon,
    AlertCircle,
    FileText,
    Shield,
    Settings,
    Zap,
} from "lucide-react";
import {
    AuthorizationRequest,
    QueryCondition,
} from "@/types/credential_zkproof";
import { useIdentityStore } from "@/store/identity.store";
import { Identity } from "@/types/auth";
import { AuthRole } from "@/constants/auth";
import { DynamicValueInput } from "./DynamicValueInput";
import { useCredentialZKProofStore } from "@/store/credential_zkproof.store";
import { OperatorOptions } from "@/constants/credential_zkproof";

interface CreateRequestProp {
    setModal: (modal: VerifierModal) => void;
}

export default function CreateProofRequestModal({
    setModal,
}: CreateRequestProp) {
    const identity = useIdentityStore((state) => state.identity);
    const fetchIdentities = useIdentityStore((state) => state.fetchIdentities);

    const fetchSchemas = useSchemaStore((state) => state.fetchSchemas);
    const isLoadingSchemas = useSchemaStore((state) => state.loading);

    const createZkProofRequest = useCredentialZKProofStore(
        (state) => state.createZkProofRequest,
    );
    const isCreateZkProofRequestLoading = useCredentialZKProofStore(
        (state) => state.loading,
    );

    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [issuers, setIssuers] = useState<Identity[]>([]);

    const [formData, setFormData] = useState<AuthorizationRequest>({
        verifierDID: identity?.did ?? "",
        callback: "",
        message: "",
        reason: "",
        circuitId: CircuitId.AtomicQueryV3,
        query: {
            allowedIssuers: ["*"],
            context: "",
            type: "",
            credentialSubject: {},
            proofType: ProofType.BJJSignature,
            skipClaimRevocationCheck: false,
            groupId: 0,
        },
        params: {
            nullifierSessionId: "",
        },
        expiresTime: 0,
        createdTime: 0,
    });
    const [queryConditions, setQueryConditions] = useState<QueryCondition[]>(
        [],
    );
    const [selectedQueryCondition, setSelectedQueryCondition] =
        useState<QueryCondition>({
            field: "",
            operator: Operators.NOOP,
            value: "",
        });
    const [allowedIssuers, setAllowedIssuers] = useState<string[]>(["*"]);
    const [selectedIssuer, setSelectedIssuer] = useState<string>("*");

    const [isUpdatedIssuers, setIsUpdatedIssuers] = useState<boolean>(false);
    const [attributesOption, setAttributesOption] = useState<Attribute[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const getSchemaByContextURL = (url: string): Schema | undefined => {
        return schemas.find((item) => item.contextURL === url);
    };

    const getAttributeFromName = (name: string): Attribute | undefined => {
        return attributesOption.find((item) => item.name === name);
    };

    const getAttributeValueInputType = (name: string): string => {
        const attribute = getAttributeFromName(name);
        switch (attribute?.type) {
            case "string":
                return "text";
            case "integer":
            case "float":
            case "double":
                return "number";
            case "dateTime":
                return "date";
            case "boolean":
                return "boolean";
            default:
                return "text";
        }
    };

    const getOperator = (name: string) => {
        const attribute = getAttributeFromName(name);
        switch (attribute?.type) {
            case "string":
                return [
                    QueryOperators.$eq,
                    QueryOperators.$ne,
                    QueryOperators.$in,
                    QueryOperators.$nin,
                    QueryOperators.$exists,
                ];
            case "integer":
                return [
                    QueryOperators.$eq,
                    QueryOperators.$ne,
                    QueryOperators.$in,
                    QueryOperators.$nin,
                    QueryOperators.$lt,
                    QueryOperators.$gt,
                    QueryOperators.$lte,
                    QueryOperators.$gte,
                    QueryOperators.$between,
                    QueryOperators.$nonbetween,
                    QueryOperators.$exists,
                ];
            case "float":
                return [
                    QueryOperators.$eq,
                    QueryOperators.$ne,
                    QueryOperators.$in,
                    QueryOperators.$nin,
                    QueryOperators.$lt,
                    QueryOperators.$gt,
                    QueryOperators.$lte,
                    QueryOperators.$gte,
                    QueryOperators.$between,
                    QueryOperators.$nonbetween,
                    QueryOperators.$exists,
                ];
            case "dateTime":
                return [
                    QueryOperators.$eq,
                    QueryOperators.$ne,
                    QueryOperators.$in,
                    QueryOperators.$nin,
                    QueryOperators.$lt,
                    QueryOperators.$gt,
                    QueryOperators.$lte,
                    QueryOperators.$gte,
                    QueryOperators.$between,
                    QueryOperators.$nonbetween,
                    QueryOperators.$exists,
                ];
            case "boolean":
                return [Operators.EQ, Operators.NE, Operators.EXISTS];
            default:
                return [];
        }
    };

    const buildQueryPreview = () => {
        const credentialSubject: JsonDocumentObject = {};
        queryConditions.forEach((cond) => {
            credentialSubject[cond.field] = {
                [OperatorOptions[cond.operator].value]: cond.value,
            };
        });
        return {
            ...formData.query,
            credentialSubject: credentialSubject,
            allowedIssuers: allowedIssuers,
        };
    };
    const buildQuery = () => {
        const credentialSubject: JsonDocumentObject = {};
        queryConditions.forEach((cond) => {
            credentialSubject[cond.field] = {
                [cond.operator]: cond.value,
            };
        });
        return {
            ...formData.query,
            credentialSubject: credentialSubject,
            allowedIssuers: allowedIssuers,
        };
    };

    const addQueryCondition = () => {
        if (
            selectedQueryCondition.field &&
            selectedQueryCondition.operator &&
            selectedQueryCondition.value.toString()
        ) {
            setQueryConditions((state) => {
                let data = [...state];
                const index = state.findIndex(
                    (item) => item.field === selectedQueryCondition.field,
                );

                if (index === -1) {
                    data = [...data, selectedQueryCondition];
                } else {
                    data[index] = selectedQueryCondition;
                }
                return data;
            });
            setSelectedQueryCondition({
                field: "",
                operator: Operators.NOOP,
                value: "",
            });
        }
    };

    const removeQueryCondition = (index: number) => {
        setQueryConditions(queryConditions.filter((_, i) => i !== index));
    };

    const addIssuer = () => {
        if (selectedIssuer === "*" || allowedIssuers.includes("*")) {
            setAllowedIssuers([selectedIssuer]);
        } else {
            setAllowedIssuers([...allowedIssuers, selectedIssuer]);
        }
        setSelectedIssuer("");
        setErrors((prev) => ({ ...prev, allowedIssuers: "" }));
    };

    const removeIssuer = (issuerDID: string) => {
        const newIssuers = allowedIssuers.filter((i) => i !== issuerDID);
        setAllowedIssuers(newIssuers);
    };

    const editIssuer = () => {
        setIsUpdatedIssuers(!isUpdatedIssuers);
    };

    const getIssuerName = (did: string): string => {
        if (did === "*") return "All Issuers";
        const issuer = issuers.find((i) => i.did === did);
        return issuer?.name || did.substring(0, 20) + "...";
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        if (!formData.reason.trim()) {
            newErrors.reason = "Reason is required";
        }

        if (!formData.circuitId) {
            newErrors.circuitId = "Circuit ID is required";
        }

        if (allowedIssuers.length === 0) {
            newErrors.allowedIssuers = "At least one issuer must be selected";
        }

        if (!formData.query.context) {
            newErrors.schema = "Schema is required";
        }

        if (!formData.query.proofType) {
            newErrors.proofType = "Proof type is required";
        }

        if (queryConditions.length === 0) {
            newErrors.queryConditions =
                "At least one query condition is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            const firstErrorElement = document.querySelector(".error-message");
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
            return;
        }

        const data: AuthorizationRequest = {
            ...formData,
            query: buildQuery(),
            createdTime: Math.floor(Date.now() / 1000),
            expiresTime: Math.floor(Date.now() / 1000) + 24 * 3600,
        };
        try {
            await createZkProofRequest(data);
            setModal(VerifierModal.Null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const schemas: Schema[] = await fetchSchemas();
                const issuers: Identity[] = await fetchIdentities(
                    AuthRole.Issuer,
                );
                setSchemas(schemas);
                setIssuers(issuers);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center z-20 p-6 overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl my-8 overflow-hidden"
            >
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8">
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 mb-3"
                        >
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">
                                Create ZKP Proof Request
                            </h3>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-blue-100 ml-14"
                        >
                            Create authorization request for credential
                            verification
                        </motion.p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setModal(VerifierModal.Null)}
                        className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>

                <div className="p-8 space-y-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {/* Basic Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                Basic Information
                            </h4>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Message <span className="text-rose-500">*</span>
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.005 }}
                                type="text"
                                value={formData.message}
                                onChange={(e) =>
                                    handleFieldChange("message", e.target.value)
                                }
                                placeholder="Prove you are over 18"
                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                    errors.message
                                        ? "border-rose-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                } outline-none transition-all shadow-sm`}
                            />
                            <AnimatePresence>
                                {errors.message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-1.5 mt-2 text-rose-600 error-message"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">
                                            {errors.message}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason <span className="text-rose-500">*</span>
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.005 }}
                                type="text"
                                value={formData.reason}
                                onChange={(e) =>
                                    handleFieldChange("reason", e.target.value)
                                }
                                placeholder="Age verification for adult content access"
                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                    errors.reason
                                        ? "border-rose-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                } outline-none transition-all shadow-sm`}
                            />
                            <AnimatePresence>
                                {errors.reason && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-1.5 mt-2 text-rose-600 error-message"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">
                                            {errors.reason}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Circuit ID{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <motion.select
                                whileFocus={{ scale: 1.005 }}
                                value={formData.circuitId}
                                onChange={(e) => {
                                    handleFieldChange(
                                        "circuitId",
                                        e.target.value as CircuitId,
                                    );
                                }}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                    errors.circuitId
                                        ? "border-rose-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                        : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                } outline-none transition-all bg-white shadow-sm`}
                            >
                                {Object.entries(CircuitId).map(
                                    ([key, value]) => (
                                        <option key={key} value={value}>
                                            {key}
                                        </option>
                                    ),
                                )}
                            </motion.select>
                            <AnimatePresence>
                                {errors.circuitId && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-1.5 mt-2 text-rose-600 error-message"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">
                                            {errors.circuitId}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Allowed Issuers Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <label className="text-lg font-bold text-gray-900">
                                    Allowed Issuers{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={editIssuer}
                                disabled={allowedIssuers.length == 0}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                                    !isUpdatedIssuers
                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                                {!isUpdatedIssuers ? (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="w-4 h-4" />
                                        <span>Done</span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        <div className="space-y-2">
                            <AnimatePresence mode="popLayout">
                                {allowedIssuers.map((issuerDID, idx) => (
                                    <motion.div
                                        key={issuerDID}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 transition-all ${
                                            errors.allowedIssuers
                                                ? "bg-rose-50 border-rose-200"
                                                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-md"
                                        } shadow-sm`}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                                <Users
                                                    className={`w-4 h-4 ${
                                                        errors.allowedIssuers
                                                            ? "text-rose-600"
                                                            : "text-blue-600"
                                                    }`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-bold text-gray-900 block truncate">
                                                    {getIssuerName(issuerDID)}
                                                </span>
                                                {issuerDID !== "*" && (
                                                    <code className="text-xs font-mono text-gray-500 truncate block mt-0.5">
                                                        {issuerDID}
                                                    </code>
                                                )}
                                            </div>
                                        </div>
                                        {isUpdatedIssuers && (
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 90,
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    removeIssuer(issuerDID)
                                                }
                                                className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {errors.allowedIssuers && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-1.5 text-rose-600 error-message"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">
                                        {errors.allowedIssuers}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isUpdatedIssuers && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300"
                                >
                                    <p className="text-sm font-semibold text-gray-700 mb-3">
                                        Add Specific Issuer
                                    </p>
                                    <div className="flex gap-3">
                                        <select
                                            value={selectedIssuer}
                                            onChange={(e) =>
                                                setSelectedIssuer(
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm bg-white shadow-sm"
                                        >
                                            <option value="">
                                                Select a issuer...
                                            </option>
                                            {!allowedIssuers.includes("*") && (
                                                <option value="*">
                                                    All Issuer
                                                </option>
                                            )}
                                            {issuers
                                                .filter(
                                                    (issuer) =>
                                                        !allowedIssuers.includes(
                                                            issuer.did,
                                                        ),
                                                )
                                                .map((issuer) => (
                                                    <option
                                                        key={issuer.id}
                                                        value={issuer.did}
                                                    >
                                                        {issuer.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={addIssuer}
                                            disabled={!selectedIssuer}
                                            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${
                                                selectedIssuer
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Schema Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-100 rounded-xl">
                                <FileText className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                Schema Configuration
                            </h4>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Schema{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            {isLoadingSchemas ? (
                                <div className="flex items-center justify-center py-8 text-slate-500">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    Loading schemas...
                                </div>
                            ) : schemas.length > 0 ? (
                                <motion.select
                                    whileFocus={{ scale: 1.005 }}
                                    onChange={(e) => {
                                        const schema = getSchemaByContextURL(
                                            e.target.value,
                                        );
                                        setFormData({
                                            ...formData,
                                            query: {
                                                ...formData.query,
                                                type: schema?.type ?? "",
                                                context:
                                                    schema?.contextURL ?? "",
                                            },
                                        });
                                        setErrors((prev) => ({
                                            ...prev,
                                            schema: "",
                                        }));
                                        setAttributesOption(
                                            schema?.attributes ?? [],
                                        );
                                    }}
                                    value={formData.query.context || ""}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                                        errors.schema
                                            ? "border-rose-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                            : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    } outline-none transition-all bg-white shadow-sm`}
                                >
                                    <option value="">Select a schema...</option>
                                    {schemas.map((schema) => (
                                        <option
                                            key={schema.id}
                                            value={schema.contextURL}
                                        >
                                            {schema.title} (v{schema.version})
                                        </option>
                                    ))}
                                </motion.select>
                            ) : (
                                <div className="p-6 rounded-xl bg-amber-50 border-2 border-amber-200 text-center">
                                    <p className="text-sm text-amber-700 font-medium">
                                        No schemas available
                                    </p>
                                </div>
                            )}
                            <AnimatePresence>
                                {errors.schema && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-1.5 mt-2 text-rose-600 error-message"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">
                                            {errors.schema}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {formData.query.type && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Schema Type{" "}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.query.type}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-mono text-sm shadow-sm"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Proof Type Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32 }}
                    >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Proof Type <span className="text-rose-500">*</span>
                        </label>
                        <motion.select
                            whileFocus={{ scale: 1.005 }}
                            value={formData.query.proofType}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    query: {
                                        ...formData.query,
                                        proofType: e.target.value as ProofType,
                                    },
                                });
                                setErrors((prev) => ({
                                    ...prev,
                                    proofType: "",
                                }));
                            }}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                                errors.proofType
                                    ? "border-rose-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            } outline-none transition-all bg-white shadow-sm`}
                        >
                            {Object.entries(ProofType).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {key}
                                </option>
                            ))}
                        </motion.select>
                        <AnimatePresence>
                            {errors.proofType && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-1.5 mt-2 text-rose-600 error-message"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">
                                        {errors.proofType}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Query Builder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-rose-100 rounded-xl">
                                <Zap className="w-5 h-5 text-rose-600" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                Query Conditions{" "}
                                <span className="text-rose-500">*</span>
                            </h4>
                        </div>

                        {/* Existing Conditions */}
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {queryConditions.map((condition, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        layout
                                        transition={{
                                            type: "spring",
                                            damping: 25,
                                            stiffness: 300,
                                        }}
                                        className="flex items-center gap-3 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all shadow-sm"
                                    >
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div className="text-sm">
                                                <span className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                                    Field
                                                </span>
                                                <p className="text-gray-900 font-bold mt-1">
                                                    {condition.field}
                                                </p>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                                    Operator
                                                </span>
                                                <p className="text-gray-900 font-bold mt-1">
                                                    {
                                                        OperatorOptions[
                                                            condition.operator
                                                        ].label
                                                    }
                                                </p>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                                    Value
                                                </span>
                                                <p className="text-gray-900 font-mono font-bold mt-1 truncate">
                                                    {String(condition.value)}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 90,
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                removeQueryCondition(index);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    queryConditions: "",
                                                }));
                                            }}
                                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {errors.queryConditions && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-1.5 text-rose-600 error-message"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">
                                        {errors.queryConditions}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Add New Condition */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 space-y-4"
                        >
                            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add New Condition
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Field
                                    </label>
                                    <select
                                        value={selectedQueryCondition.field}
                                        onChange={(e) => {
                                            setSelectedQueryCondition({
                                                field: e.target.value,
                                                operator: Operators.NOOP,
                                                value: "",
                                            });
                                        }}
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm bg-white shadow-sm"
                                    >
                                        <option value="">
                                            Select field...
                                        </option>
                                        {attributesOption.map((item) => (
                                            <option
                                                key={item.name}
                                                value={item.name}
                                            >
                                                {item.name} ({item.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Operator
                                    </label>
                                    <select
                                        value={selectedQueryCondition.operator}
                                        onChange={(e) =>
                                            setSelectedQueryCondition({
                                                ...selectedQueryCondition,
                                                operator: Number(
                                                    e.target.value,
                                                ) as Operators,
                                                value: "",
                                            })
                                        }
                                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        disabled={!selectedQueryCondition.field}
                                    >
                                        <option value={Operators.NOOP}>
                                            Select operator...
                                        </option>
                                        {getOperator(
                                            selectedQueryCondition.field,
                                        ).map((item) => (
                                            <option key={item} value={item}>
                                                {OperatorOptions[item].label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Value
                                    </label>
                                    {selectedQueryCondition.field &&
                                    selectedQueryCondition.operator !==
                                        Operators.NOOP ? (
                                        <DynamicValueInput
                                            fieldType={getAttributeValueInputType(
                                                selectedQueryCondition.field,
                                            )}
                                            operator={
                                                selectedQueryCondition.operator
                                            }
                                            value={selectedQueryCondition.value}
                                            onChange={(val) => {
                                                setSelectedQueryCondition({
                                                    ...selectedQueryCondition,
                                                    value: val,
                                                });
                                            }}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            disabled
                                            placeholder="Select field & operator first"
                                            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-400 outline-none text-sm"
                                        />
                                    )}
                                </div>
                            </div>
                            <motion.button
                                whileHover={{
                                    scale:
                                        selectedQueryCondition.field &&
                                        selectedQueryCondition.operator !==
                                            Operators.NOOP
                                            ? 1.02
                                            : 1,
                                }}
                                whileTap={{
                                    scale:
                                        selectedQueryCondition.field &&
                                        selectedQueryCondition.operator !==
                                            Operators.NOOP
                                            ? 0.98
                                            : 1,
                                }}
                                onClick={() => {
                                    addQueryCondition();
                                    setErrors((prev) => ({
                                        ...prev,
                                        queryConditions: "",
                                    }));
                                }}
                                disabled={
                                    !selectedQueryCondition.field ||
                                    selectedQueryCondition.operator ===
                                        Operators.NOOP
                                }
                                className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                    selectedQueryCondition.field &&
                                    selectedQueryCondition.operator !==
                                        Operators.NOOP
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-200"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <Plus className="w-5 h-5" />
                                Add Condition
                            </motion.button>
                        </motion.div>

                        {/* Generated Query Preview */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-gray-900 rounded-xl border-2 border-gray-700"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Generated Query Preview
                                </p>
                            </div>
                            <pre className="text-xs text-green-400 font-mono overflow-x-auto p-3 bg-black/30 rounded-lg">
                                {JSON.stringify(buildQueryPreview(), null, 2)}
                            </pre>
                        </motion.div>
                    </motion.div>

                    {/* Advanced Options */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-orange-100 rounded-xl">
                                <Settings className="w-5 h-5 text-orange-600" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">
                                Advanced Options
                            </h4>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nullifier Session ID (Optional)
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.005 }}
                                type="text"
                                value={formData.params.nullifierSessionId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        params: {
                                            ...formData.params,
                                            nullifierSessionId: e.target.value,
                                        },
                                    })
                                }
                                placeholder="Unique session identifier"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Prevent replay attacks by binding proof to
                                session
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Group ID (Optional)
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.005 }}
                                type="number"
                                value={formData.query.groupId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        query: {
                                            ...formData.query,
                                            groupId: Number(e.target.value),
                                        },
                                    })
                                }
                                placeholder="Group identifier"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                            />
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 cursor-pointer transition-all"
                        >
                            <input
                                type="checkbox"
                                id="skipRevocation"
                                checked={
                                    formData.query.skipClaimRevocationCheck
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        query: {
                                            ...formData.query,
                                            skipClaimRevocationCheck:
                                                e.target.checked,
                                        },
                                    })
                                }
                                className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                                htmlFor="skipRevocation"
                                className="text-sm text-gray-700 font-medium cursor-pointer flex-1"
                            >
                                Skip claim revocation check{" "}
                                <span className="text-yellow-700 font-semibold">
                                    (not recommended for production)
                                </span>
                            </label>
                        </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="flex gap-4 pt-6 border-t-2 border-gray-200"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setModal(VerifierModal.Null)}
                            className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-bold transition-all shadow-sm"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isCreateZkProofRequestLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-300/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isCreateZkProofRequestLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    <span>Create Request</span>
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
