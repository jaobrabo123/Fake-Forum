import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionService {
    // * Injetando dependências
    constructor(private readonly redisService: RedisService) {}

    // * Normalização para chave de refresh do Redis
    private refreshKey(refreshTokenHash: string) {
        return `refresh:${refreshTokenHash}` as const;
    }

    // * Normalização para chave de session do Redis
    private sessionsKey(userId: string) {
        return `user:${userId}:sessions` as const;
    }

    // * Normalização para chave de sessionId do Redis
    private sessionIdKey(sessionId: string) {
        return `session:${sessionId}` as const;
    }

    // * Constante para TTL (em segundos) das chaves de sessão no Redis
    private readonly SESSION_TTL = 7 * 24 * 60 * 60;

    async create(userId: string, refreshTokenHash: string, session: Session) {
        // * Crio a pipeline para operações atômicas
        const pipeline = this.redisService.multi();

        // * Adicionando o set da sessão à pipeline
        pipeline.set(
            this.refreshKey(refreshTokenHash),
            JSON.stringify(session),
            "EX",
            this.SESSION_TTL,
        );

        // * Adicionando o set da sessionId à pipeline
        pipeline.set(
            this.sessionIdKey(session.id),
            refreshTokenHash,
            "EX",
            this.SESSION_TTL,
        );

        // * Adicionando o sadd à pipeline
        pipeline.sadd(this.sessionsKey(userId), refreshTokenHash);
        // * Aumentando o expire do Set
        pipeline.expire(this.sessionsKey(userId), this.SESSION_TTL, "GT");
        // * Garantindo que o Set vai ter um expire
        pipeline.expire(this.sessionsKey(userId), this.SESSION_TTL, "NX");

        // * Executando todos os comandos da Pipeline
        await pipeline.exec();
    }

    async consume(refreshTokenHash: string) {
        const result = await this.redisService.getdel<Session>(
            this.refreshKey(refreshTokenHash),
            true,
        );

        if (!result) return result;

        const pipeline = this.redisService.multi();

        pipeline.srem(this.sessionsKey(result.userId), refreshTokenHash);
        pipeline.del(this.sessionIdKey(result.id));

        await pipeline.exec();

        return result;
    }

    async findByUserId(userId: string) {
        const sessionsKeys = await this.redisService.smembers(
            this.sessionsKey(userId),
            false,
        );

        if (sessionsKeys.length === 0) return [];

        const sessions = await this.redisService.mget<Session>(
            sessionsKeys.map((key) => this.refreshKey(key)),
            true,
        );

        const foundSessions: Session[] = [];
        const notFoundedKeys: string[] = [];

        sessions.forEach((ses, idx) => {
            if (ses) {
                foundSessions.push(ses);
            } else {
                notFoundedKeys.push(sessionsKeys[idx]);
            }
        });

        if (notFoundedKeys.length > 0) {
            await this.redisService.srem(
                this.sessionsKey(userId),
                ...notFoundedKeys,
            );
        }

        return foundSessions;
    }

    async findBySessionId(sessionId: string) {
        const refreshHash = await this.redisService.get(
            this.sessionIdKey(sessionId),
            false,
        );

        if (!refreshHash) return null;

        return this.redisService.get<Session>(
            this.refreshKey(refreshHash),
            true,
        );
    }
}
