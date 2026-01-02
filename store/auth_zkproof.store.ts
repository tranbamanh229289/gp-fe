import axiosInstance from "@/lib/axios";
import { createMTService } from "@/services/mt.service";
import { Challenge, Identity } from "@/types/auth";
import { ZKProof } from "@/types/auth_zkproof";
import { protocol } from "@iden3/js-iden3-auth";
import { create } from "zustand";

interface AuthZkProofStore {
    verifierDID: string;
    senderDID: string;
    requestID: string;
    circuitID: string;
    scopeID: string;
    challenge: number;
    callbackURL: string;
    message: string;
    isVerified: boolean;
    loading: boolean;
    error: string;

    verify: (proof: ZKProof) => Promise<Identity>;
    requestChallenge: () => Promise<void>;
    generateProof: (privateKey: string) => Promise<{
        proof: snarkjs.Groth16Proof;
        publicSignals: snarkjs.PublicSignals;
    }>;
    cancel: () => void;
}

export const useAuthZkProofStore = create<AuthZkProofStore>()((set, get) => ({
    verifierDID: "",
    senderDID: "",
    requestID: "",
    circuitID: "",
    scopeID: "",
    challenge: 0,
    callbackURL: "",
    message: "",
    isVerified: false,
    loading: false,
    error: "",

    verify: async (proof: ZKProof): Promise<Identity> => {
        set({ loading: true });
        const verifierDID = get().verifierDID;
        const senderDID = get().senderDID;
        const requestID = get().requestID;
        const circuitID = get().circuitID;
        const scopeID = get().scopeID;
        const message = get().message;
        const callbackURL = get().callbackURL;
        try {
            const scope: protocol.ZeroKnowledgeProofResponse = {
                id: scopeID,
                circuitId: circuitID,
                proof: proof.proof,
                pub_signals: proof.pub_signals,
            };

            const req: protocol.AuthorizationResponseMessage = {
                id: requestID,
                type: protocol.PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE
                    .AUTHORIZATION_RESPONSE_MESSAGE_TYPE,
                from: senderDID,
                to: verifierDID,
                body: {
                    scope: [scope],
                    message: message,
                },
            };

            const res = await axiosInstance.post<{
                data: Identity;
            }>(callbackURL, req);
            set({ isVerified: true });
            return res.data.data;
        } catch (err: any) {
            set({ error: err.message, isVerified: false });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    generateProof: async (
        privateKey: string
    ): Promise<{
        proof: snarkjs.Groth16Proof;
        publicSignals: snarkjs.PublicSignals;
    }> => {
        set({ loading: true });
        try {
            const mtService = await createMTService(privateKey);
            const { did } = await mtService.getIdentityInfo();
            console.log(did);
            set({ senderDID: did.string() });
            const challenge = get().challenge;
            if (!challenge || challenge === 0) {
                throw new Error("challenge not found");
            }
            const challengeBigInt = BigInt(challenge);
            const inputs = await mtService.getAuthV3CircuitInput(
                challengeBigInt
            );
            const { proof, publicSignals } = await mtService.generateZKProof(
                inputs
            );
            console.log("proof", proof);
            console.log("publicSignals", publicSignals);
            return { proof, publicSignals };
        } catch (err: any) {
            console.error("Generate proof failed:", err);
            const errorMsg = err.message?.includes("BigInt")
                ? "challenge invalid"
                : err.message?.includes("Merkle")
                ? "Merkle tree not have claim"
                : err.message || "Generate proof undefined";
            set({ error: errorMsg });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    requestChallenge: async () => {
        set({ loading: true, error: "" });
        try {
            const response = await axiosInstance.get<{
                data: Challenge;
            }>("/authzk/challenge");
            set({
                verifierDID: response.data.data.from,
                requestID: response.data.data.id,
                circuitID: response.data.data.body.scope[0].circuitId,
                scopeID: response.data.data.body.scope[0].id,
                challenge: response.data.data.body.scope[0].params.challenge,
                callbackURL: response.data.data.body.callbackUrl,
                message: response.data.data.body.message,
            });
        } catch (err) {
            console.log(err);
            set({ error: "fetch_error" });
        } finally {
            set({ loading: false });
        }
    },
    cancel: async () => {
        set({ loading: false, error: "", challenge: 0, callbackURL: "" });
    },
}));
