import axiosInstance from "@/lib/axios";
import { createCredentialService } from "@/services/credential.service";
import { createMTService } from "@/services/mt.service";
import { CredentialRequest } from "@/types/credential_request";
import { W3CCredential } from "@0xpolygonid/js-sdk";
import { Signature } from "@iden3/js-crypto";
import { packSignature } from "@zk-kit/eddsa-poseidon";
import { create } from "zustand";

interface VerifiableCredentialStore {
    verifiableCredentials: W3CCredential[];
    loading: boolean;
    error: string;

    issueVerifiableCredential: (
        credentialRequest: CredentialRequest,
        credentialSubject: Record<string, any>,
        privateKey: string,
    ) => Promise<void>;
    getAllVerifiableCredentials: () => Promise<void>;
    fetchVerifiableCredentials: () => Promise<W3CCredential[]>;
}

export const useVerifiableCredential = create<VerifiableCredentialStore>(
    (set, get) => ({
        verifiableCredentials: [],
        loading: false,
        error: "",

        issueVerifiableCredential: async (
            credentialRequest: CredentialRequest,
            credentialSubject: Record<string, any>,
            privateKey: string,
        ) => {
            set({ loading: true });
            try {
                const credentialService =
                    createCredentialService(credentialRequest);
                const mtService = await createMTService(privateKey);

                const vc =
                    credentialService.createVerifiableCredential(
                        credentialSubject,
                    );

                const coreClaim = await credentialService.createCoreClaim(
                    vc,
                    credentialRequest.isMerklized,
                );

                const signature = mtService.signClaim(coreClaim);
                const request = {
                    isMerklized: credentialRequest.isMerklized,
                    credentialSubject: vc.credentialSubject,
                    credentialStatus: vc.credentialStatus,
                    signature: Signature.newFromCompressed(
                        packSignature(signature),
                    ).hex(),
                };

                const res = await axiosInstance.post<{
                    data: W3CCredential;
                }>(`/credentials/verifiable/${credentialRequest.id}`, request);

                set((state) => {
                    return res.data.data
                        ? {
                              ...state,
                              verifiableCredentials: [
                                  ...state.verifiableCredentials,
                                  res.data.data,
                              ],
                          }
                        : state;
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (err) {
                set({ error: "post_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },

        getAllVerifiableCredentials: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{
                    data: W3CCredential[];
                }>("/credentials/verifiable");

                set({ verifiableCredentials: res.data.data ?? [] });
            } catch (err) {
                set({ error: "get_failed" });
                throw err;
            } finally {
                set({ loading: false });
            }
        },
        fetchVerifiableCredentials: async () => {
            set({ loading: true });
            try {
                const res = await axiosInstance.get<{
                    data: W3CCredential[];
                }>("/credentials/verifiable");
                set({ error: "get_failed" });
                return res.data.data;
            } catch (err) {
                set({ error: "get_failed" });
                set({ loading: false });
                throw err;
            }
        },
    }),
);
