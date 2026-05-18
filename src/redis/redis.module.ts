import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [
        {
            provide: "REDIS_CLIENT",
            inject: [ConfigService],
            useFactory: (configService: ConfigService): Redis => {
                return new Redis({
                    host: configService.getOrThrow<string>("REDIS_HOST"),
                    port: configService.getOrThrow<number>("REDIS_PORT"),
                    password: configService.get<string>("REDIS_PASSWORD"),
                });
            },
        },
        RedisService,
    ],
    exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}
