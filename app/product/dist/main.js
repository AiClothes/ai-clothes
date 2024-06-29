"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const core_2 = require("@one-server/core");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api-product');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        prefix: 'v',
        defaultVersion: '1'
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: core_2.MICROSERVICE_PORTS.PRODUCT_SERVICE
        }
    });
    await app.startAllMicroservices();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        errorHttpStatusCode: 422,
        exceptionFactory: (errors) => {
            const messages = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints
            }));
            throw new common_1.HttpException({
                message: '参数校验失败',
                errors: messages
            }, 422);
        }
    }));
    app.useGlobalFilters(new core_2.AllExceptionsFilter());
    await app.listen(core_2.APPLICATION_PORTS.PRODUCT);
}
bootstrap();
//# sourceMappingURL=main.js.map