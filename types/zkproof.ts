export interface MerkleTreeProof {
    siblings: string[];
    auxHi: string;
    auxHv: string;
    noAux: string;
}

export interface ZKProof {
    proof: ProofData;
    pub_signals: string[];
}

export interface ProofData {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
}
