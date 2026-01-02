"use client";

import { getPublicKey } from "@/helper/babyjub";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { AuthRole } from "@/constants/auth";
import { Identity } from "@/types/auth";
import { ZKProof } from "@/types/auth_zkproof";
import { useAuthZkProofStore } from "./auth_zkproof.store";

interface IdentityStore {
    id: string;
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
    login: (proof: ZKProof) => Promise<AuthRole>;
    logout: () => void;
}

export const useIdentityStore = create<IdentityStore>()(
    persist(
        (set, get) => ({
            id: "",
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

                try {
                    const response = await axiosInstance.post<{
                        data: Identity;
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

            login: async (proof: ZKProof): Promise<AuthRole> => {
                const res: Identity = await useAuthZkProofStore
                    .getState()
                    .verify(proof);
                set({
                    id: res.id,
                    publicKeyX: res.publicKeyX,
                    publicKeyY: res.publicKeyY,
                    role: res.role,
                    did: res.did,
                    state: res.state,
                    name: res.name,
                });
                return res.role;
            },

            logout: () => {
                localStorage.removeItem("pk");
                set({
                    id: "",
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
                id: state.id,
                publicKeyX: state.publicKeyX,
                publicKeyY: state.publicKeyY,
                role: state.role,
                did: state.did,
                state: state.state,
                name: state.name,
            }),
        }
    )
);
