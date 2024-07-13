import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
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
import { MicroservicesModule } from './microservice/microservice.module';
import { LogModule } from './log/log.module';
import { ContextModule } from './context/context.module';
import { ContextMiddleware } from './common/middleware/ContextMiddleWare';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 注册 DevtoolsModule 没啥卵用
    // DevtoolsModule.register({
    //   http: process.env.NODE_ENV !== 'production',
    //   port: 3000
    // }),
    // 注册微服务
    MicroservicesModule,
    // 注册全局基础使用模块
    PrismaModule,
    LogModule,
    ContextModule,
    // 注册程序模块
    AuthModule,
    PermissionModule,
    UserModule,
    RoleModule
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
