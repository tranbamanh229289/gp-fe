import { SchemaStatus } from "@/constants/schema";
import axiosInstance from "@/lib/axios";
import { Schema } from "@/types/schema";
import { create } from "zustand";

interface SchemaStore {
    schemas: Schema[];
    loading: boolean;
    error: string;

    getAllSchemas: () => Promise<void>;
    createSchema: (data: Partial<Schema>) => Promise<void>;
    removeSchema: (id: string) => Promise<void>;
}
export const useSchemaStore = create<SchemaStore>((set, get) => ({
    schemas: [],
    loading: false,
    error: "",

    getAllSchemas: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get<{ data: Schema[] }>("/schemas");

            set({ schemas: res.data.data });
        } catch (err) {
            set({ error: "get_err" });
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
                    schemas: [...state.schemas, res.data.data],
                };
            });
        } catch (err) {
            set({ error: "create_err" });
        } finally {
            set({ loading: false });
        }
    },

    removeSchema: async (id: string) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.patch(`schemas/${id}`);
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
        } finally {
            set({ loading: false });
        }
    },
}));
