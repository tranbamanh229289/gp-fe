export const convertValue = (value: any, targetType: string): number => {
    switch (targetType.toLocaleLowerCase()) {
        case "integer":
            const n = Number(value);
            if (Number.isNaN(n)) {
                throw new Error(`Invalid number value: ${value}`);
            }
            return n;
        case "double":
        case "float": {
            const s = String(value);

            if (!/^-?\d+(\.\d+)?$/.test(s)) {
                throw new Error(`Invalid decimal value: ${value}`);
            }

            const [i, f = ""] = s.split(".");
            const scale = 3;

            const frac = f.padEnd(scale, "0").slice(0, scale);
            const scaled = Number(i + frac);

            if (!Number.isSafeInteger(scaled)) {
                throw new Error("Scaled number exceeds JS safe integer range");
            }

            return scaled;
        }
        case "datetime": {
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) {
                throw new Error(`Invalid datetime value: ${value}`);
            }

            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");

            return Number(`${yyyy}${mm}${dd}`);
        }

        case "boolean":
            return value === true || value === "true" || value === 1 ? 1 : 0;

        case "string":

        default:
            const val = String(value);
            if (value === null || value === undefined) {
                throw new Error("Cannot hash null or undefined");
            }
            let hash = 0;
            for (let i = 0; i < val.length; i++) {
                const char = val.charCodeAt(i);
                hash = (hash << 5) - hash + char;
            }
            return hash >>> 0;
    }
};
