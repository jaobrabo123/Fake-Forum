import { ForbiddenException } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (
            [
                "http://localhost:5173",
                "http://localhost:2923",
                "http://localhost:3000",
            ].includes(origin ?? "")
        ) {
            callback(null, true);
        } else {
            callback(new ForbiddenException("Não permitido pelo CORS."));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204,
    credentials: true,
    maxAge: 86400,
};
