import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  MICROSERVICE,
  MICROSERVICE_PORTS,
  TransformInterceptor
} from '@one-server/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PermissionModule } from './permission/permission.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    // 注册微服务
    ClientsModule.register([
      {
        name: MICROSERVICE.LOG_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: MICROSERVICE_PORTS.LOG_SERVICE
        }
      }
    ]),
    // 注册 DevtoolsModule 没啥卵用
    // DevtoolsModule.register({
    //   http: process.env.NODE_ENV !== 'production',
    //   port: 3000
    // }),
    // 全局注入，后续其他模块就不用再导入了
    PrismaModule,
    PermissionModule
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
