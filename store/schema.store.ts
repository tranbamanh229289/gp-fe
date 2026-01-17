import { SchemaStatus } from "@/constants/schema";
import axiosInstance from "@/lib/axios";
import { Attribute, Schema } from "@/types/schema";
import { create } from "zustand";

interface SchemaStore {
    schemas: Schema[];
    loading: boolean;
    error: string;

    fetchSchemas: () => Promise<Schema[]>;
    fetchSchemaAttributes: (id: string) => Promise<Attribute[]>;
    getAllSchemas: () => Promise<void>;
    createSchema: (data: Partial<Schema>) => Promise<void>;
    removeSchema: (id: string) => Promise<void>;
}
export const useSchemaStore = create<SchemaStore>((set, get) => ({
    schemas: [],
    loading: false,
    error: "",

    fetchSchemas: async (): Promise<Schema[]> => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get<{ data: Schema[] }>("/schemas");
            set({ loading: false, error: "" });
            return res.data.data;
        } catch (err) {
            set({ loading: false, error: "get_err" });
            throw err;
        }
    },
    fetchSchemaAttributes: async (id: string): Promise<Attribute[]> => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get<{ data: Attribute[] }>(
                `/schemas/attributes/${id}`
            );
            set({ loading: false, error: "" });
            return res.data.data;
        } catch (err) {
            set({ loading: false, error: "get_err" });
            throw err;
        }
    },

    getAllSchemas: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get<{ data: Schema[] }>("/schemas");

            set({ schemas: res.data.data ?? [] });
        } catch (err) {
            set({ error: "get_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    createSchema: async (data: Partial<Schema>) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post<{ data: Schema }>(
                "/schemas",
                data
            );
            set((state) => {
                return {
                    ...state,
                    schemas: res.data.data
                        ? [...state.schemas, res.data.data]
                        : state.schemas,
                };
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (err) {
            set({ error: "create_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    removeSchema: async (id: string) => {
        set({ loading: true });
        try {
            await axiosInstance.patch(`schemas/${id}`);
            set((state) => {
                return {
                    ...state,
                    schemas: state.schemas.map((item) => {
                        if (item.id !== id) {
                            return item;
                        } else return { ...item, status: SchemaStatus.Revoked };
                    }),
                };
            });
        } catch (err) {
            set({ error: "remove_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },
}));
