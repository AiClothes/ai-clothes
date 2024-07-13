import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, TransformInterceptor } from '@one-server/core';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MicroservicesModule } from './microservice/microservice.module';
import { JwtModule } from '@nestjs/jwt';
import { ContextModule } from './context/context.module';
import { LogModule } from './log/log.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { ContextMiddleware } from './common/middleware/ContextMiddleWare';

@Module({
  imports: [
    // 注册微服务
    MicroservicesModule,
    // 注册全局基础使用模块
    PrismaModule,
    LogModule,
    ContextModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        // 超时时间 120s
        // expiresIn: '120s'
        // 超时时间 24小时
        expiresIn: '24h'
      }
    }),
    CommonModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 注入全局拦截器
    {
      provide: APP_INTERCEPTOR,
      // 使用自定义拦截器 返回数据统一化
      useClass: TransformInterceptor
    },
    // 注入全局守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard
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
