import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { APPLICATION_PORTS, MICROSERVICE_PORTS } from '@one-server/core';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局基础路由前缀
  app.setGlobalPrefix('api-log');
  app.enableVersioning({
    // 启用 URI 版本控制
    type: VersioningType.URI,
    // 仅指定版本号前缀，如 'v1', 'v2' 等
    prefix: 'v',
    // 默认版本号
    defaultVersion: '1'
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: MICROSERVICE_PORTS.LOG_SERVICE
    }
  });

  await app.startAllMicroservices();
  await app.listen(APPLICATION_PORTS.LOG);
}

bootstrap();
