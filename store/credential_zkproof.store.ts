import { CredentialZKProofStatus } from "@/constants/credential_zkproof";
import axiosInstance from "@/lib/axios";
import { Identity } from "@/types/auth";
import { ProofRequest, ProofResponse } from "@/types/credential_zkproof";
import { create } from "zustand";

export interface CredentialZKProofStore {
    proofRequests: ProofRequest[];
    proofResponses: ProofResponse[];
    issuers: Identity[];
    loading: boolean;
    error: string;

    createZkProofRequest: () => Promise<void>;
    updateZkProofRequest: (
        id: string,
        status: CredentialZKProofStatus
    ) => Promise<void>;
    getAllZkProofRequests: () => Promise<void>;
    createZkProofResponse: () => Promise<void>;
    getAllZkProofResponses: () => Promise<void>;
    getAllIssuers: () => Promise<void>;
}

export const useCredentialZKProofStore = create<CredentialZKProofStore>(
    (set, get) => ({
        proofRequests: [],
        proofResponses: [],
        issuers: [],
        loading: false,
        error: "",

        createZkProofRequest: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.post<{ data: ProofRequest }>(
                    "/proofs/request"
                );
                set((state) => {
                    return {
                        ...state,
                        proofRequests: [...state.proofRequests, res.data.data],
                    };
                });
            } catch (err) {
                set({ error: "call_failed" });
            } finally {
                set({ loading: false });
            }
        },

        updateZkProofRequest: async (
            id: string,
            status: CredentialZKProofStatus
        ) => {
            set({ loading: true });
            try {
                await axiosInstance.patch(`/proofs/request/${id}`, {
                    status: status,
                });
                set((state) => {
                    return {
                        ...state,
                        proofRequests: state.proofRequests.map((item) => {
                            if (item.id !== id) {
                                return item;
                            } else {
                                return { ...item, status: status };
                            }
                        }),
                    };
                });
            } catch (err) {
                set({ error: "call_failed" });
            } finally {
                set({ loading: false });
            }
        },

        getAllZkProofRequests: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{ data: ProofRequest[] }>(
                    "/proofs/request"
                );
                set({ proofRequests: res.data.data });
            } catch (err) {
                set({ error: "call_failed" });
            } finally {
                set({ loading: false });
            }
        },

        createZkProofResponse: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.post<{ data: ProofResponse }>(
                    "/proofs/response"
                );
                set((state) => {
                    return {
                        ...state,
                        proofResponses: [
                            ...state.proofResponses,
                            res.data.data,
                        ],
                    };
                });
            } catch (err) {
                set({ error: "call_failed" });
            } finally {
                set({ loading: false });
            }
        },

        getAllZkProofResponses: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{ data: ProofResponse[] }>(
                    "/proofs/response"
                );
                set({ proofResponses: res.data.data });
            } catch (err) {
                set({ error: "call_failed" });
            } finally {
                set({ loading: false });
            }
        },

        getAllIssuers: async () => {
            set({ loading: true });
            try {
                const params = {
                    role: "issuer",
                };
                const res = await axiosInstance.get<{ data: Identity[] }>(
                    "/authzk",
                    { params }
                );
                set({ issuers: res.data.data });
            } catch (err) {
                set({ error: "call_failed" });
            } finally {
                set({ loading: false });
            }
        },
    })
);
