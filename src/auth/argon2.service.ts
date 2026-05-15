import { Injectable } from "@nestjs/common";
import argon2 from "argon2";

@Injectable()
export class Argon2Service {
    async hash(password: string) {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 2,
        });
    }

    async compare(hash: string, password: string) {
        return argon2.verify(hash, password);
    }
}
