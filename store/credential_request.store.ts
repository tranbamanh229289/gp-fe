import { CredentialRequestStatus } from "@/constants/credential_request";
import axiosInstance from "@/lib/axios";
import {
    CredentialRequest,
    CredentialIssuanceRequest,
} from "@/types/credential_request";
import {
    CredentialIssuanceRequestMessage,
    CredentialIssuanceRequestMessageBody,
    PROTOCOL_CONSTANTS,
    Schema,
} from "@0xpolygonid/js-sdk";
import { create } from "zustand";

interface CredentialRequestStore {
    credentialRequests: CredentialRequest[];
    loading: boolean;
    error: string;

    createCredentialRequest: (data: CredentialIssuanceRequest) => Promise<void>;
    updateCredentialRequest: (
        id: string,
        status: CredentialRequestStatus
    ) => Promise<void>;
    getCredentialRequests: () => Promise<void>;
}

export const useCredentialRequestStore = create<CredentialRequestStore>(
    (set, get) => ({
        credentialRequests: [],

        loading: false,
        error: "",

        createCredentialRequest: async (data: CredentialIssuanceRequest) => {
            set({ loading: true });
            try {
                const schema: Schema = {
                    hash: data.schemaHash,
                    url: data.schemaURL,
                    type: data.schemaType,
                };
                const body: CredentialIssuanceRequestMessageBody = {
                    schema: schema,
                    data: {},
                    expiration: data.expiration,
                };
                const req: CredentialIssuanceRequestMessage = {
                    id: crypto.randomUUID(),
                    typ: PROTOCOL_CONSTANTS.MediaType.PlainMessage,
                    type: PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE
                        .CREDENTIAL_ISSUANCE_REQUEST_MESSAGE_TYPE,
                    thid: crypto.randomUUID(),
                    body: body,
                    from: data.holderDID,
                    to: data.issuerDID,
                    created_time: data.createdTime,
                    expires_time: data.expiresTime,
                };

                const res = await axiosInstance.post<{
                    data: CredentialRequest;
                }>("/credentials/request", req);

                set((state) => {
                    return {
                        ...state,
                        credentialRequests: [
                            ...state.credentialRequests,
                            res.data.data,
                        ],
                    };
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (err) {
                set({ error: "post_failed" });
                throw err;
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
                await axiosInstance.patch(`/credentials/request/${id}`, {
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
                throw err;
            } finally {
                set({ loading: true });
            }
        },

        getCredentialRequests: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{
                    data: CredentialRequest[];
                }>(`/credentials/request`);
                set({ credentialRequests: res.data.data ?? [] });
            } catch (err) {
                set({ error: "get_failed" });
                throw err;
            } finally {
                set({ loading: true });
            }
        },
    })
);
