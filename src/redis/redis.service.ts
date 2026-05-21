import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

    async set(key: string, value: unknown, ttl?: number): Promise<"OK"> {
        const valueFormated =
            typeof value === "string" ? value : JSON.stringify(value);

        if (ttl !== undefined) {
            return await this.redis.set(key, valueFormated, "EX", ttl);
        }

        return await this.redis.set(key, valueFormated);
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

    async sadd(key: string, ...values: unknown[]) {
        const formatedValues = values.map((val) =>
            typeof val !== "string" ? JSON.stringify(val) : val,
        );

        return await this.redis.sadd(key, ...formatedValues);
    }

    async srem(key: string, ...members: string[]) {
        return await this.redis.srem(key, ...members);
    }

    async sismember(key: string, member: string) {
        return !!(await this.redis.sismember(key, member));
    }

    async expire(key: string, ttl: number, option?: "GT" | "LT" | "NX" | "XX") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return !!(await this.redis.expire(key, ttl, option as any));
    }

    async saddAndExpire(
        key: string,
        ttl: number,
        option: "GT" | "LT" | "NX" | "XX",
        ...values: unknown[]
    ) {
        await this.sadd(key, ...values);
        return await this.expire(key, ttl, option);
    }
}
