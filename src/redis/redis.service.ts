import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

    /**
     * Método para salvar algo no Redis
     * @param key Chave do Redis
     * @param value Valor a ser salvo
     * @param ttl TTL em segundos
     * @returns "OK" se der certo
     */
    async set(key: string, value: unknown, ttl?: number): Promise<"OK"> {
        const valueFormated =
            typeof value === "string" ? value : JSON.stringify(value);

        if (ttl !== undefined) {
            return await this.redis.set(key, valueFormated, "EX", ttl);
        }

        return await this.redis.set(key, valueFormated);
    }

    /**
     * Método para buscar algo no Redis
     * @param key Chave do Redis
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns T | null
     */
    async get<T>(key: string, toObject: true): Promise<T | null>;
    /**
     * Buscar algo no Redis
     * @param key Chave do Redis
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns string | null
     */
    async get(key: string, toObject: false): Promise<string | null>;
    async get(key: string, toObject: boolean) {
        const result = await this.redis.get(key);
        if (result === null || !toObject) return result;

        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(result);
        } catch {
            return result;
        }
    }

    /**
     * Método para remover uma ou várias chaves de uma vez no Redis
     * @param keys Chaves a serem removidas
     * @returns Quantidade de chaves removidas (se já não existia não entra no contador)
     */
    async del(...keys: string[]) {
        return await this.redis.del(...keys);
    }

    /**
     * Busca e remove atômicamente uma chave do Redis
     * @param key Chave do Redis
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns T | null
     */
    async getdel<T>(key: string, toObject: true): Promise<T | null>;
    /**
     * Busca e remove atômicamente uma chave do Redis
     * @param key Chave do Redis
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns string | null
     */
    async getdel(key: string, toObject: false): Promise<string | null>;
    async getdel(key: string, toObject: boolean) {
        try {
            const result = await this.redis.getdel(key);
            if (result === null || !toObject) return result;

            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(result);
            } catch {
                return result;
            }
        } catch (err) {
            console.error(`Falha ao buscar ${key}:`, err);
            return null;
        }
    }

    /**
     * Adiciona elementos a um Set no Redis
     * @param key Chave do Redis
     * @param values Valores a serem adicionados ao Set
     * @returns A quantidade de elementos que foram adicionados ao Set (não conta os que já existiam)
     */
    async sadd(key: string, ...values: unknown[]) {
        const formatedValues = values.map((val) =>
            typeof val !== "string" ? JSON.stringify(val) : val,
        );

        return await this.redis.sadd(key, ...formatedValues);
    }

    /**
     * Remove elementos de um Set no Redis
     * @param key Chave do Redis
     * @param members Valores a serem removidos do Set
     * @returns A quantidade de elementos que foram removidos do Set (não conta os que não existiam)
     */
    async srem(key: string, ...members: string[]) {
        return await this.redis.srem(key, ...members);
    }

    /**
     * Verifica se um elemento existe em um Set no Redis
     * @param key Chave do Redis
     * @param member Elemento a ser verificado
     * @returns true se o elemento existir no Set, false caso contrário
     */
    async sismember(key: string, member: string) {
        return !!(await this.redis.sismember(key, member));
    }

    /**
     * Define um tempo de expiração para uma chave no Redis
     * @param key Chave do Redis
     * @param ttl Tempo de vida em segundos
     * @param option Opções para a operação de expiração
     * @returns true se a expiração for definida com sucesso, false caso contrário
     */
    async expire(key: string, ttl: number, option?: "GT" | "LT" | "NX" | "XX") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return !!(await this.redis.expire(key, ttl, option as any));
    }

    /**
     * Adiciona elementos a um Set no Redis e define um tempo de expiração para a chave
     * @param key Chave do Redis
     * @param ttl Tempo de vida em segundos
     * @param option Opções para a operação de expiração
     * @param values Valores a serem adicionados ao Set
     * @returns true se a expiração for definida com sucesso, false caso contrário
     */
    async saddAndExpire(
        key: string,
        ttl: number,
        option: "GT" | "LT" | "NX" | "XX",
        ...values: unknown[]
    ) {
        await this.sadd(key, ...values);
        return await this.expire(key, ttl, option);
    }

    /**
     * Método para salvar várias chaves e valores no Redis de uma vez
     * @param data Objeto ou Map contendo as chaves e valores a serem salvos
     * @returns "OK" se der certo
     */
    async mset(data: object | Map<string, string | number>) {
        return await this.redis.mset(data);
    }

    /**
     * Método para buscar várias chaves no Redis de uma vez
     * @param keys Chaves a serem buscadas
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns (T | null)[] Na mesma ordem das chaves
     */
    async mget<T>(keys: string[], toObject: true): Promise<(T | null)[]>;
    /**
     * Método para buscar várias chaves no Redis de uma vez
     * @param keys Chaves a serem buscadas
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns (string | null)[] Na mesma ordem das chaves
     */
    async mget(keys: string[], toObject: false): Promise<(string | null)[]>;
    async mget(keys: string[], toObject: boolean) {
        const result = await this.redis.mget(keys);

        if (!toObject) return result;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result.map((val) => {
            if (val === null) return val;
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(val);
            } catch {
                return val;
            }
        });
    }

    /**
     * Método para buscar todos os membros de um Set no Redis
     * @param key Chave do Redis
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns T[]
     */
    async smembers<T>(key: string, toObject: true): Promise<T[]>;
    /**
     * Método para buscar todos os membros de um Set no Redis
     * @param key Chave do Redis
     * @param toObject Se vai transformar o resultado em Object usando JSON.parse
     * @returns string[]
     */
    async smembers(key: string, toObject: false): Promise<string[]>;
    async smembers(key: string, toObject: boolean) {
        const result = await this.redis.smembers(key);

        if (!toObject) return result;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result.map((val) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(val);
            } catch {
                return val;
            }
        });
    }

    multi() {
        return this.redis.multi();
    }
}
