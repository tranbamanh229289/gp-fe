import { ProofRequestStatus } from "@/constants/credential_zkproof";
import { randomIntSecure } from "@/helper/randomBit";
import axiosInstance from "@/lib/axios";
import { createProofService } from "@/services/proof.service";
import { ZKProof } from "@/types/auth_zkproof";

import {
    AuthorizationRequest,
    ProofRequest,
    ProofResponse,
} from "@/types/credential_zkproof";
import { protocol } from "@iden3/js-iden3-auth";
import { create } from "zustand";

export interface CredentialZKProofStore {
    proofRequests: ProofRequest[];
    proofResponses: ProofResponse[];
    loading: boolean;
    error: string;

    createZkProofRequest: (authReq: AuthorizationRequest) => Promise<void>;
    updateZkProofRequest: (
        id: string,
        status: ProofRequestStatus,
    ) => Promise<void>;
    getAllZkProofRequests: () => Promise<void>;
    generateCredentialAtomicQueryV3Proof: (
        proofRequestId: string,
        credentialId: string,
    ) => Promise<void>;
    proveCredentialAtomicQueryV3Proof: (
        holderDID: string,
        request: ProofRequest,
        proof: ZKProof,
    ) => Promise<void>;
    getAllZkProofResponses: () => Promise<void>;
}

export const useCredentialZKProofStore = create<CredentialZKProofStore>(
    (set, get) => ({
        proofRequests: [],
        proofResponses: [],

        loading: false,
        error: "",

        createZkProofRequest: async (authReq: AuthorizationRequest) => {
            set({ loading: true });
            try {
                const scopes: protocol.ZeroKnowledgeProofRequest[] = [
                    {
                        id: randomIntSecure(2 ^ 32),
                        circuitId: authReq.circuitId,
                        query: authReq.query,
                        params: authReq.params,
                    },
                ];
                const req: protocol.AuthorizationRequestMessage = {
                    id: crypto.randomUUID(),
                    typ: protocol.PROTOCOL_CONSTANTS.MediaType.PlainMessage,
                    type: protocol.PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE
                        .AUTHORIZATION_REQUEST_MESSAGE_TYPE,
                    thid: crypto.randomUUID(),
                    body: {
                        callbackUrl: authReq.callback,
                        reason: authReq.reason,
                        message: authReq.message,
                        scope: scopes,
                    },
                    from: authReq.verifierDID,
                    created_time: authReq.createdTime,
                    expires_time: authReq.expiresTime,
                };

                const res = await axiosInstance.post<{ data: ProofRequest }>(
                    "/proofs/request",
                    req,
                );
                console.log(res);
                set((state) => {
                    return {
                        ...state,
                        proofRequests: [...state.proofRequests, res.data.data],
                    };
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (err) {
                set({ error: "call_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        updateZkProofRequest: async (
            id: string,
            status: ProofRequestStatus,
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
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (err) {
                set({ error: "call_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        getAllZkProofRequests: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{ data: ProofRequest[] }>(
                    "/proofs/request",
                );
                set({ proofRequests: res.data.data ?? [] });
            } catch (err) {
                set({ error: "call_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        generateCredentialAtomicQueryV3Proof: async (
            proofRequestId: string,
            credentialId: string,
        ): Promise<void> => {
            set({ loading: true });

            try {
                const proofService = await createProofService();
                const request = { proofRequestId, credentialId };
                const inputs = await axiosInstance.post(
                    "/circuits/credentialAtomicQueryV3",
                    request,
                );
                console.log(inputs);

                const { proof, publicSignals } =
                    await proofService.generateCredentialAtomicQueryV3Input(
                        inputs.data.data,
                    );

                set({ loading: false });
            } catch (err) {
                set({ error: "call_failed", loading: false });
                throw err;
            }
        },

        proveCredentialAtomicQueryV3Proof: async (
            holderDID: string,
            proofRequest: ProofRequest,
            proof: ZKProof,
        ) => {
            set({ loading: true });
            const scope: protocol.ZeroKnowledgeProofResponse = {
                id: proofRequest.scopeId,
                circuitId: proofRequest.circuitId,
                proof: proof.proof,
                pub_signals: proof.pub_signals,
            };
            const responseMessage: protocol.AuthorizationResponseMessage = {
                id: proofRequest.threadId,
                type: protocol.PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE
                    .AUTHORIZATION_RESPONSE_MESSAGE_TYPE,
                from: holderDID,
                to: proofRequest.verifierDID,
                body: {
                    scope: [scope],
                    message: proofRequest.message,
                },
            };
            try {
                const resp = await axiosInstance.post<{ data: ProofResponse }>(
                    "/proofs/verify",
                    responseMessage,
                );
                set((state) => {
                    return {
                        ...state,
                        proofResponses: [
                            ...state.proofResponses,
                            resp.data.data,
                        ],
                    };
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (err) {
                set({ error: "call_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        getAllZkProofResponses: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{ data: ProofResponse[] }>(
                    "/proofs/response",
                );
                set({ proofResponses: res.data.data });
            } catch (err) {
                set({ error: "call_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },
    }),
);
