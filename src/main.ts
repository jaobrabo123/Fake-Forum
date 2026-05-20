import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { PrismaClientExceptionFilter } from "./common/filters/prisma-client-exception.filter";
import { UnknownExceptionFilter } from "./common/filters/unknown-exception.filter";
import { SuccessResponseInterceptor } from "./common/interceptors/success-response.interceptor";
import { corsConfig } from "./configs/cors.config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) =>
                new UnprocessableEntityException(errors),
        }),
    );

    app.useGlobalFilters(
        new UnknownExceptionFilter(),
        new PrismaClientExceptionFilter(),
    );

    app.useGlobalInterceptors(new SuccessResponseInterceptor());

    app.enableCors(corsConfig);

    const config = new DocumentBuilder()
        .setTitle("Fake Forum API")
        .setDescription("The API for the Fake Forum project")
        .setVersion("1.0")
        .addCookieAuth("accessToken")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
