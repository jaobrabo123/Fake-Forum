import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionService {
    constructor(private readonly redisService: RedisService) {}

    private sessionKey(sessionId: string) {
        return `session:${sessionId}`;
    }

    async create(session: Session) {
        await this.redisService.set(
            this.sessionKey(session.id),
            session,
            7 * 24 * 60 * 60,
        );
    }

    async find(sessionId: string): Promise<Session | null> {
        return await this.redisService.get<Session>(
            this.sessionKey(sessionId),
            true,
        );
    }

    async remove(sessionId: string) {
        await this.redisService.del(this.sessionKey(sessionId));
    }
}
