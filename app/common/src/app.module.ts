import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MICROSERVICE,
  MICROSERVICE_PORTS,
  TransformInterceptor
} from '@one-server/core';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    // 注册微服务
    ClientsModule.register([
      {
        name: MICROSERVICE.USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: MICROSERVICE_PORTS.USER_SERVICE
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 注入全局拦截器
    {
      provide: APP_INTERCEPTOR,
      // 使用自定义拦截器 返回数据统一化
      useClass: TransformInterceptor
    }
  ]
})
export class AppModule {}
