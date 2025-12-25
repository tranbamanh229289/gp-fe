"use client";

import { getPublicKey } from "@/helper/babyjub";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { AuthRole } from "@/constants/auth";
import { IdentityStateResponse } from "@/types/auth";
import { ZKProof } from "@/types/proof";
import { useZkProofStore } from "./zkproof.store";

interface IdentityStateStore {
    publicID: string;
    publicKeyX: string;
    publicKeyY: string;
    did: string;
    state: string;
    role: AuthRole;
    name: string;
    loading: boolean;
    error: string;

    register: (
        privateKey: string,
        name: string,
        role: AuthRole
    ) => Promise<void>;
    login: (proof: ZKProof) => Promise<void>;
    logout: () => void;
}

export const useIdentityStateStore = create<IdentityStateStore>()(
    persist(
        (set, get) => ({
            publicID: "",
            publicKeyX: "",
            publicKeyY: "",
            role: AuthRole.Holder,
            did: "",
            state: "",
            name: "",
            loading: false,
            error: "",

            register: async (
                privateKey: string,
                name: string,
                role: AuthRole
            ) => {
                set({ loading: true, error: "" });
                const publicKey = getPublicKey(privateKey);

                const request: {
                    publicKeyX: string;
                    publicKeyY: string;
                    name: string;
                    role: AuthRole;
                } = {
                    publicKeyX: publicKey.x,
                    publicKeyY: publicKey.y,
                    name: name,
                    role: role,
                };
                console.log("request", request);
                try {
                    const response = await axiosInstance.post<{
                        data: IdentityStateResponse;
                    }>("/authzk/register", request);

                    set({
                        did: response.data.data.did,
                        state: response.data.data.state,
                    });
                } catch (err) {
                    console.log(err);
                    set({ error: "fetch_err" });
                } finally {
                    set({ loading: false });
                }
            },

            login: async (proof: ZKProof): Promise<void> => {
                const res: IdentityStateResponse = await useZkProofStore
                    .getState()
                    .verify(proof);
                set({
                    publicID: res.publicID,
                    publicKeyX: res.publicKeyX,
                    publicKeyY: res.publicKeyY,
                    role: res.role,
                    did: res.did,
                    state: res.state,
                    name: res.name,
                });
            },

            logout: () => {
                localStorage.removeItem("pk");
                set({
                    publicID: "",
                    publicKeyX: "",
                    publicKeyY: "",
                    role: AuthRole.Holder,
                    did: "",
                    state: "",
                });
            },
        }),
        {
            name: "identity_store",
            partialize: (state) => ({
                PublicID: state.publicID,
                publicKeyX: state.publicKeyX,
                publicKeyY: state.publicKeyY,
                role: state.role,
                did: state.did,
                state: state.state,
            }),
        }
    )
);
