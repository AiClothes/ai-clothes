import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransformInterceptor } from '@one-server/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MicroservicesModule } from './microservice/microservice.module';
import { JwtModule } from '@nestjs/jwt';
import { ContextModule } from './context/context.module';
import { LogModule } from './log/log.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';

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
    }
  ]
})
export class AppModule {}
