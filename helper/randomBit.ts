export function randomBigInt(bits: number): bigint {
    if (!Number.isInteger(bits) || bits <= 0) {
        return BigInt(0);
    }

    const byteCount = Math.ceil(bits / 8);
    const buffer = new Uint8Array(byteCount);

    crypto.getRandomValues(buffer);

    let result = BigInt(0);
    for (const byte of buffer) {
        result = (result << BigInt(8)) + BigInt(byte);
    }

    const mask = (BigInt(1) << BigInt(bits)) - BigInt(1);
    return result & mask;
}

export function randomIntSecure(max: number): number {
    if (max <= 0) return 0;

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    return Number(array[0]) % max;
}
