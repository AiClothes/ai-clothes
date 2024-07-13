import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  AllExceptionsFilter,
  APPLICATION_PORTS,
  MICROSERVICE_PORTS
} from '@one-server/core';
import { HttpException, ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';

// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 程序测试记录 1 启动单一微服务
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: '127.0.0.1',
  //       port: 8000
  //     }
  //   }
  // );
  // await app.listen();

  // 程序测试记录 2 启动单一框架服务
  // const app = await NestFactory.create(AppModule);
  // await app.listen(8001);

  // 启动混合模式服务
  const app = await NestFactory.create(AppModule, {
    // 开启GUI检查程序
    snapshot: true
  });

  // 安全防护
  app.use(helmet());
  // 跨域
  app.enableCors();

  // 全局基础路由前缀
  app.setGlobalPrefix('api-user');
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
      port: MICROSERVICE_PORTS.USER_SERVICE
    }
  });

  // 启动所有微服务
  await app.startAllMicroservices();

  // 绑定全局的验证器 确保所有端点都免受接收错误数据的影响
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // 参数校验错误时状态代码 422 Unprocessable Entity
      errorHttpStatusCode: 422,
      // 错误抛出时的异常转换
      exceptionFactory: (errors) => {
        // 处理错误信息，将其转换为自定义格式
        const messages = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints
        }));

        // 使用自定义格式抛出异常，这里以HttpException为例
        throw new HttpException(
          {
            message: '参数校验失败',
            errors: messages
          },
          422
        );
      }
    })
  );

  // 注册全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 设置 Swagger 文档
  // const config = new DocumentBuilder()
  //   .setTitle('用户模块 API 文档')
  //   .setDescription('仅针对用户模块发起的API文档swagger说明')
  //   .setVersion('1.0')
  //   .addTag('users')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('/api-user/doc', app, document);

  await app.listen(APPLICATION_PORTS.USER);
}

bootstrap();
