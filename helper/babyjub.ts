import {
    derivePublicKey,
    signMessage,
    verifySignature,
    packPublicKey,
    unpackPublicKey,
    Signature,
} from "@zk-kit/eddsa-poseidon";
import crypto from "crypto";

export interface PublicKey {
    x: string;
    y: string;
}

export interface BabyJubWallet {
    privateKey: string;
    publicKey: PublicKey;
    publicKeyCompressed: string;
}

export function generateBabyJubWallet(): BabyJubWallet {
    const privateKey = crypto.randomBytes(32);

    return getWalletFromPrivateKey(privateKey.toString("hex"));
}

export function getWalletFromPrivateKey(privateKeyHex: string): BabyJubWallet {
    const privateKey = Buffer.from(privateKeyHex, "hex");

    if (privateKey.length !== 32) {
        throw new Error("Length must 32 bytes");
    }

    const publicKey = derivePublicKey(privateKey);

    const publicKeyCompressed = packPublicKey(publicKey);
    return {
        privateKey: privateKeyHex,
        publicKey: {
            x: publicKey[0].toString(10),
            y: publicKey[1].toString(10),
        },
        publicKeyCompressed: publicKeyCompressed.toString(),
    };
}

export function getPublicKey(privateKeyHex: string): PublicKey {
    const privateKey = Buffer.from(privateKeyHex, "hex");

    if (privateKey.length !== 32) {
        throw new Error("length must 32 bytes");
    }

    const publicKey = derivePublicKey(privateKey);

    return {
        x: publicKey[0].toString(),
        y: publicKey[1].toString(),
    };
}

export function signPoseidon(
    message: bigint | string | number,
    privateKeyHex: string
): Signature {
    const privateKey = Buffer.from(privateKeyHex, "hex");

    if (privateKey.length !== 32) {
        throw new Error("length must 32 bytes");
    }
    const msgBigInt = typeof message === "bigint" ? message : BigInt(message);
    const signature = signMessage(privateKey, msgBigInt);

    return {
        R8: [signature.R8[0].toString(), signature.R8[1].toString()],
        S: signature.S.toString(),
    };
}

export function verifyPoseidon(
    message: bigint | string | number,
    signature: Signature,
    publicKey: PublicKey
): boolean {
    const msgBigInt = typeof message === "bigint" ? message : BigInt(message);

    const sig: Signature = {
        R8: [BigInt(signature.R8[0]), BigInt(signature.R8[1])],
        S: BigInt(signature.S),
    };

    const pubKey: [bigint, bigint] = [BigInt(publicKey.x), BigInt(publicKey.y)];

    return verifySignature(msgBigInt, sig, pubKey);
}

export function unpackPublicKeyFromBigInt(
    packedPublicKey: bigint | string
): PublicKey {
    const packed =
        typeof packedPublicKey === "string"
            ? BigInt(packedPublicKey)
            : packedPublicKey;
    const publicKey = unpackPublicKey(packed);

    return {
        x: publicKey[0].toString(),
        y: publicKey[1].toString(),
    };
}

export function packPublicKeyToBigInt(publicKey: PublicKey): bigint {
    const pubKey: [bigint, bigint] = [BigInt(publicKey.x), BigInt(publicKey.y)];

    return packPublicKey(pubKey);
}

export function derivePrivateKeyFromSeed(seed: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(seed);
    return hash.digest("hex");
}

export function exportWallet(wallet: BabyJubWallet): string {
    return JSON.stringify(wallet, null, 2);
}

export function importWallet(json: string): BabyJubWallet {
    const wallet = JSON.parse(json);

    if (
        !wallet.privateKey ||
        !wallet.publicKey ||
        !wallet.publicKeyCompressed
    ) {
        throw new Error("Invalid wallet format");
    }

    return wallet;
}
