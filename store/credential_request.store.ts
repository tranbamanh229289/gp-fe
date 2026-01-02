import axiosInstance from "@/lib/axios";
import {
    CredentialRequest,
    CredentialRequestStatus,
} from "@/types/credential_request";
import { create } from "zustand";

interface CredentialRequestStore {
    credentialRequests: CredentialRequest[];
    loading: boolean;
    error: string;

    createCredentialRequest: () => Promise<void>;
    updateCredentialRequest: (
        id: string,
        status: CredentialRequestStatus
    ) => Promise<void>;
    getAllCredentialRequests: () => Promise<void>;
}

export const credentialRequestStore = create<CredentialRequestStore>(
    (set, get) => ({
        credentialRequests: [],

        loading: false,
        error: "",

        createCredentialRequest: async () => {
            set({ loading: true });
            try {
                const req = {};
                const res = await axiosInstance.post<{
                    data: CredentialRequest;
                }>("/credential/request", req);

                set((state) => {
                    return {
                        ...state,
                        credentialRequests: [
                            ...state.credentialRequests,
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

        updateCredentialRequest: async (
            id: string,
            status: CredentialRequestStatus
        ) => {
            set({ loading: true });
            try {
                await axiosInstance.patch(`/credential/request/${id}`, {
                    status,
                });
                set((state) => {
                    return {
                        ...state,
                        credentialRequests: state.credentialRequests.map(
                            (item) => {
                                if (item.id !== id) {
                                    return item;
                                } else {
                                    return { ...item, status: status };
                                }
                            }
                        ),
                    };
                });
            } catch (err) {
                set({ error: "post_failed" });
            } finally {
                set({ loading: true });
            }
        },

        getAllCredentialRequests: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{
                    data: CredentialRequest[];
                }>("/credential/request");
                set({ credentialRequests: res.data.data });
            } catch (err) {
                set({ error: "get_failed" });
            } finally {
                set({ loading: true });
            }
        },
    })
);
