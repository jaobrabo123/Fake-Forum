import {
    BinaryToTextEncoding,
    createHmac,
    randomBytes,
    timingSafeEqual,
} from "crypto";

/**
 * Cria um hash HMAC-SHA256
 * @param rawValue Valor original
 * @param encoding Codificação do resultado
 * @returns Hash gerado
 */
export function createHmacSHA256Hash(
    rawValue: string,
    encoding: BinaryToTextEncoding = "hex",
) {
    const hashedValue = createHmac("sha256", process.env.SHA256_KEY!)
        .update(rawValue)
        .digest(encoding);
    return hashedValue;
}

/**
 * Compara dois hashes de forma segura contra ataques de tempo
 * @param incomingHash Hash recebido
 * @param trueHash Hash verdadeiro
 * @param encoding Codificação dos hashes
 * @returns true se os hashes forem iguais, false caso contrário
 */
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

/**
 * Compara um valor original com um hash HMAC-SHA256
 * @param rawValue Valor original
 * @param trueHash Hash verdadeiro
 * @param encoding Codificação dos hashes
 * @returns true se o valor original corresponder ao hash, false caso contrário
 */
export function compareRawWithHmacSHA256Hash(
    rawValue: string,
    trueHash: string,
    encoding: BinaryToTextEncoding = "hex",
) {
    const incomingHash = createHmacSHA256Hash(rawValue, encoding);
    const isValid = compareHashes(incomingHash, trueHash, encoding);
    return isValid;
}

/**
 * Cria uma string de alta entropia
 * @param bytesSize Tamanho em bytes da string
 * @param encoding Codificação do resultado
 * @returns String gerada
 */
export function createHighEntropyString(
    bytesSize = 32,
    encoding: BufferEncoding = "hex",
) {
    return randomBytes(bytesSize).toString(encoding);
}
