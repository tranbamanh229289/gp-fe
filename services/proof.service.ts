import * as snarkjs from "snarkjs";

export class ProofService {
    private authV3WasmPath: string;
    private authV3ZkeyPath: string;
    private credentialAtomicQueryV3WasmPath: string;
    private credentialAtomicQueryV3ZkeyPath: string;
    constructor() {
        this.authV3WasmPath =
            process.env.NEXT_PUBLIC_AUTH_V3_WASM_PATH ||
            "./circuits/authV3/circuit.wasm";
        this.authV3ZkeyPath =
            process.env.NEXT_PUBLIC_AUTH_V3_ZKEY_PATH ||
            "./circuits/authV3/circuit_final.zkey";
        this.credentialAtomicQueryV3WasmPath =
            process.env.NEXT_PUBLIC_CREDENTIAL_ATOMIC_QUERY_V3_WASM_PATH ||
            "./circuits/credentialAtomicQueryV3/circuit.wasm";
        this.credentialAtomicQueryV3ZkeyPath =
            process.env.NEXT_PUBLIC_CREDENTIAL_ATOMIC_QUERY_V3_ZKEY_PATH ||
            "./circuits/credentialAtomicQueryV3/circuit_final.zkey";
    }

    async generateAuthV3ZKProof(inputs: snarkjs.CircuitSignals): Promise<{
        proof: snarkjs.Groth16Proof;
        publicSignals: snarkjs.PublicSignals;
    }> {
        if (!this.authV3WasmPath || !this.authV3ZkeyPath) {
            throw new Error(
                "AUTH_V3_WASM_PATH and AUTH_V3_ZKEY_PATH environment variables must be set",
            );
        }

        try {
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                inputs,
                this.authV3WasmPath,
                this.authV3ZkeyPath,
            );

            return { proof, publicSignals };
        } catch (error) {
            throw new Error(
                `Failed to generate proof: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }
    }

    async generateCredentialAtomicQueryV3Input(
        inputs: snarkjs.CircuitSignals,
    ): Promise<{
        proof: snarkjs.Groth16Proof;
        publicSignals: snarkjs.PublicSignals;
    }> {
        if (
            !this.credentialAtomicQueryV3ZkeyPath ||
            !this.credentialAtomicQueryV3WasmPath
        ) {
            throw new Error(
                "CREDENTIAL_QUERY_ATOMIC_QUERY_V3_WASM and CREDENTIAL_QUERY_ATOMIC_QUERY_V3_ZKEY_PATH environment variables must be set",
            );
        }

        try {
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                inputs,
                this.credentialAtomicQueryV3WasmPath,
                this.credentialAtomicQueryV3ZkeyPath,
            );

            return { proof, publicSignals };
        } catch (error) {
            throw new Error(
                `Failed to generate proof: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }
    }
}

export const createProofService = () => {
    return new ProofService();
};
