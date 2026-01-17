import { QueryValueType } from "@/types/credential_zkproof";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Operators } from "@0xpolygonid/js-sdk";

interface DynamicValueInputProps {
    fieldType: string;
    operator: Operators;
    value: QueryValueType;
    onChange: (value: QueryValueType) => void;
}

export const DynamicValueInput = ({
    fieldType,
    operator,
    value,
    onChange,
}: DynamicValueInputProps) => {
    const [arrayValues, setArrayValues] = useState<string[]>([""]);

    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(0);

    const handleArrayValueChange = (index: number, newValue: string) => {
        const newValues = [...arrayValues];
        newValues[index] = newValue;
        setArrayValues(newValues);

        if (fieldType === "number") {
            onChange(newValues.map((item) => Number(item)));
        } else {
            onChange(newValues);
        }
    };

    const addArrayInput = () => {
        setArrayValues([...arrayValues, ""]);
    };

    const removeArrayInput = (index: number) => {
        if (arrayValues.length > 1) {
            const newValues = arrayValues.filter((_, i) => i !== index);
            setArrayValues(newValues);
            if (fieldType === "number") {
                onChange(newValues.map((item) => Number(item)));
            } else {
                onChange(newValues);
            }
        }
    };

    const handleBetweenChange = (type: "min" | "max", newValue: string) => {
        if (type === "min") {
            setMinValue(Number(newValue));
            if (newValue && maxValue) {
                onChange([Number(newValue), maxValue]);
            }
        } else {
            setMaxValue(Number(newValue));
            if (minValue && newValue) {
                onChange([minValue, Number(newValue)]);
            }
        }
    };
    if (operator === Operators.EXISTS) {
        return (
            <motion.select
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                value={value as string}
                onChange={(e) => onChange(e.target.value === "true")}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm bg-white shadow-sm"
            >
                <option value="">Select value...</option>
                <option value="true">True</option>
                <option value="false">False</option>
            </motion.select>
        );
    }

    if (operator === Operators.IN || operator === Operators.NIN) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
            >
                <AnimatePresence mode="popLayout">
                    {arrayValues.map((val, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-2"
                        >
                            <input
                                type={fieldType}
                                value={val}
                                onChange={(e) =>
                                    handleArrayValueChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                placeholder={`Value ${index + 1}`}
                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                            />
                            {arrayValues.length > 1 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => removeArrayInput(index)}
                                    className="p-2.5 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors shadow-sm"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={addArrayInput}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Value
                </motion.button>
                <p className="text-xs text-gray-500">
                    Add multiple values to create an array
                </p>
            </motion.div>
        );
    }

    if (operator === Operators.BETWEEN || operator === Operators.NONBETWEEN) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
            >
                <motion.input
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    type={fieldType}
                    value={minValue}
                    onChange={(e) => handleBetweenChange("min", e.target.value)}
                    placeholder="Minimum value"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                />
                <motion.input
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    type={fieldType}
                    value={maxValue}
                    onChange={(e) => handleBetweenChange("max", e.target.value)}
                    placeholder="Maximum value"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                />
                <p className="text-xs text-gray-500">
                    Enter range from minimum to maximum
                </p>
            </motion.div>
        );
    }

    switch (fieldType) {
        case "boolean":
            return (
                <motion.select
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    value={value as string}
                    onChange={(e) => onChange(e.target.value === "true")}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm bg-white shadow-sm"
                >
                    <option value="">Select value...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </motion.select>
            );
        case "integer":
            return (
                <motion.input
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="number"
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter text value"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                />
            );
        case "float":
            return (
                <motion.input
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type={"number"}
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter text value"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                />
            );
        default:
            return (
                <motion.input
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type={fieldType}
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter text value"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm shadow-sm"
                />
            );
    }
};

export const validateConditionValue = (
    value: string,
    fieldType: string,
    operator: Operators
): string | null => {
    if (!value && operator !== Operators.EXISTS) {
        return "Value is required";
    }

    if (operator === Operators.EXISTS) {
        if (value !== "true" && value !== "false") {
            return "Value must be true or false";
        }
        return null;
    }

    if (operator === Operators.IN || operator === Operators.NIN) {
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                return "At least one value is required";
            }

            // Validate từng phần tử
            if (fieldType === "integer") {
                if (parsed.some((v) => isNaN(parseInt(v, 10)))) {
                    return "All values must be valid integers";
                }
            } else if (fieldType === "double" || fieldType === "number") {
                if (parsed.some((v) => isNaN(parseFloat(v)))) {
                    return "All values must be valid numbers";
                }
            }
        } catch {
            return "Invalid value format";
        }
        return null;
    }

    if (operator === Operators.BETWEEN) {
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed) || parsed.length !== 2) {
                return "Both minimum and maximum values are required";
            }
            if (
                fieldType === "integer" &&
                (isNaN(parseInt(parsed[0], 10)) ||
                    isNaN(parseInt(parsed[1], 10)))
            ) {
                return "Both values must be valid integers";
            }
            if (
                (fieldType === "double" || fieldType === "number") &&
                (isNaN(parseFloat(parsed[0])) || isNaN(parseFloat(parsed[1])))
            ) {
                return "Both values must be valid numbers";
            }

            // Kiểm tra min < max
            const min =
                fieldType === "integer"
                    ? parseInt(parsed[0], 10)
                    : parseFloat(parsed[0]);
            const max =
                fieldType === "integer"
                    ? parseInt(parsed[1], 10)
                    : parseFloat(parsed[1]);
            if (min >= max) {
                return "Minimum value must be less than maximum value";
            }
        } catch {
            return "Both minimum and maximum values are required";
        }
        return null;
    }

    if (fieldType === "integer" && isNaN(parseInt(value, 10))) {
        return "Value must be a valid integer";
    }
    if (
        (fieldType === "double" || fieldType === "number") &&
        isNaN(parseFloat(value))
    ) {
        return "Value must be a valid number";
    }
    if (fieldType === "boolean" && value !== "true" && value !== "false") {
        return "Value must be true or false";
    }

    return null;
};
