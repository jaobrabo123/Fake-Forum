import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

    async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
        try {
            const valueFormated =
                typeof value === "string" ? value : JSON.stringify(value);

            if (ttl !== undefined) {
                await this.redis.set(key, valueFormated, "EX", ttl);
            } else {
                await this.redis.set(key, valueFormated);
            }

            return true;
        } catch (err) {
            console.error(`Falha ao armazenar ${key}:`, err);
            return false;
        }
    }

    async get<T>(key: string, toObject: true): Promise<T | null>;
    async get(key: string, toObject: false): Promise<string | null>;
    async get(key: string, toObject: boolean) {
        try {
            const result = await this.redis.get(key);
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

    async del(...keys: string[]) {
        return await this.redis.del(...keys);
    }

    async getdel<T>(key: string, toObject: true): Promise<T | null>;
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
}
