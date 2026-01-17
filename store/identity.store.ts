import { getPublicKey, PublicKey } from "@/helper/babyjub";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { AuthRole } from "@/constants/auth";
import { Identity, LoginResponse, RefreshTokenResponse } from "@/types/auth";
import { ZKProof } from "@/types/auth_zkproof";
import { useAuthZkProofStore } from "./auth_zkproof.store";

interface IdentityStore {
    identity: Identity | null;
    publicKey: PublicKey | null;
    token: string;
    loading: boolean;
    error: string;

    register: (
        privateKey: string,
        name: string,
        role: AuthRole
    ) => Promise<void>;
    login: (proof: ZKProof) => Promise<AuthRole>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    fetchIdentity: (did: string) => Promise<Identity>;
    fetchIdentities: (role: AuthRole) => Promise<Identity[]>;
}

export const useIdentityStore = create<IdentityStore>()(
    persist(
        (set, get) => ({
            identity: null,
            publicKey: null,
            token: "",

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
                    const { data } = await axiosInstance.post<{
                        data: Identity;
                    }>("/authzk/register", request);
                    set({ identity: data.data });
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                } catch (err) {
                    set({ error: "fetch_err" });
                } finally {
                    set({ loading: false });
                }
            },

            login: async (proof: ZKProof): Promise<AuthRole> => {
                const res: LoginResponse = await useAuthZkProofStore
                    .getState()
                    .verify(proof);
                set({
                    identity: res.claims,
                    publicKey: res.publicKey,
                    token: res.accessToken,
                });
                return res.claims.role;
            },

            refreshToken: async () => {
                set({ loading: true, error: "" });
                try {
                    const response = await axiosInstance.get<{
                        data: RefreshTokenResponse;
                    }>("/authzk/refresh-token");

                    set({ token: response.data.data.accessToken });
                } catch (err) {
                    set({ error: "fetch_err" });
                } finally {
                    set({ loading: false });
                }
            },
            logout: async () => {
                localStorage.removeItem("identity_store");
                set({ loading: true, error: "" });
                try {
                    await axiosInstance.get("authzk/logout");
                    set({
                        identity: null,
                        publicKey: null,
                        token: "",
                    });
                } catch (err) {
                    set({ error: "fetch_err" });
                } finally {
                    set({ loading: false, error: "" });
                }
            },

            fetchIdentity: async (did: string): Promise<Identity> => {
                set({ loading: true, error: "" });
                try {
                    const response = await axiosInstance.get<{
                        data: Identity;
                    }>(`/authzk/${did}`);
                    set({ loading: false, error: "" });
                    return response.data.data;
                } catch (err) {
                    set({ loading: false, error: "fetch_err" });
                    throw err;
                }
            },

            fetchIdentities: async (role: AuthRole): Promise<Identity[]> => {
                set({ loading: true, error: "" });
                try {
                    const response = await axiosInstance.get<{
                        data: Identity[];
                    }>(`/authzk`, {
                        params: {
                            role: role,
                        },
                    });
                    set({ loading: false, error: "" });
                    return response.data.data;
                } catch (err) {
                    set({ loading: false, error: "fetch_err" });
                    throw err;
                }
            },
        }),
        {
            name: "identity_store",
            partialize: (state) => ({
                identity: state.identity,
                publicKey: state.publicKey,
                token: state.token,
            }),
        }
    )
);
