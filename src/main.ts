import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger/dist/swagger-module";
import { DocumentBuilder } from "@nestjs/swagger/dist/document-builder";
import cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) =>
                new UnprocessableEntityException(errors),
        }),
    );

    const config = new DocumentBuilder()
        .setTitle("Fake Forum API")
        .setDescription("The API for the Fake Forum project")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
