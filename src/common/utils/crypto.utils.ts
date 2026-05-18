import { BinaryToTextEncoding, createHmac, timingSafeEqual } from "crypto";

export function createHmacSHA256Hash(
    rawValue: string,
    encoding: BinaryToTextEncoding = "hex",
) {
    const hashedValue = createHmac("sha256", process.env.SHA256_KEY!)
        .update(rawValue)
        .digest(encoding);
    return hashedValue;
}

export function compareHashes(
    incomingHash: string,
    trueHash: string,
    encoding: BinaryToTextEncoding = "hex",
) {
    return timingSafeEqual(
        Buffer.from(incomingHash, encoding),
        Buffer.from(trueHash, encoding),
    );
}

export function compareRawWithHmacSHA256Hash(
    rawValue: string,
    trueHash: string,
    encoding: BinaryToTextEncoding = "hex",
) {
    const incomingHash = createHmacSHA256Hash(rawValue, encoding);
    const isValid = compareHashes(incomingHash, trueHash, encoding);
    return isValid;
}
