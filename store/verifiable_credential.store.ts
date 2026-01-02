import axiosInstance from "@/lib/axios";
import { VerifiableCredential } from "@/types/verifiable_credential";
import { create } from "zustand";

interface VerifiableCredentialStore {
    verifiableCredentials: VerifiableCredential[];
    loading: boolean;
    error: string;

    issueVerifiableCredential: () => Promise<void>;
    getAllVerifiableCredentials: () => Promise<void>;
}

export const useVerifiableCredential = create<VerifiableCredentialStore>(
    (set, get) => ({
        verifiableCredentials: [],
        loading: false,
        error: "",

        issueVerifiableCredential: async () => {
            set({ loading: true });
            try {
                const req = "";
                const res = await axiosInstance.post<{
                    data: VerifiableCredential;
                }>("/credential/verifiable/");
                set((state) => {
                    return {
                        ...state,
                        verifiableCredentials: [
                            ...state.verifiableCredentials,
                            res.data.data,
                        ],
                    };
                });
            } catch (err) {
                set({ error: "post_failed" });
            } finally {
                set({ loading: true });
            }
        },

        getAllVerifiableCredentials: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{
                    data: VerifiableCredential[];
                }>("/credential/verifiable/");
                set({ verifiableCredentials: res.data.data });
            } catch (err) {
                set({ error: "get_failed" });
            } finally {
                set({ loading: true });
            }
        },
    })
);
