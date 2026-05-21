import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionService {
    constructor(private readonly redisService: RedisService) {}

    private createRefreshKey(refreshTokenHash: string) {
        return `refresh:${refreshTokenHash}`;
    }

    private sessionsKey(userId: string) {
        return `user:${userId}:sessions`;
    }

    async create(userId: string, refreshTokenHash: string, session: Session) {
        await Promise.all([
            this.redisService.set(
                this.createRefreshKey(refreshTokenHash),
                session,
                7 * 24 * 60 * 60,
            ),
            this.redisService.saddAndExpire(
                this.sessionsKey(userId),
                7 * 24 * 60 * 60,
                "GT",
                refreshTokenHash,
            ),
        ]);
    }

    async consume(refreshTokenHash: string) {
        const result = await this.redisService.getdel<Session>(
            this.createRefreshKey(refreshTokenHash),
            true,
        );

        if (!result) return result;

        await this.redisService.srem(
            this.sessionsKey(result.userId),
            refreshTokenHash,
        );

        return result;
    }

    async remove(userId: string, refreshTokenHash: string) {
        await Promise.all([
            this.redisService.del(this.createRefreshKey(refreshTokenHash)),
            this.redisService.srem(this.sessionsKey(userId), refreshTokenHash),
        ]);
    }
}
