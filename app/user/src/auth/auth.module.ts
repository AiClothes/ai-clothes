import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { APP_GUARD } from '@nestjs/core';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthGuard } from '@one-server/core';
import { HttpModule } from '@nestjs/axios';

// console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        // 超时时间 120s
        // expiresIn: '120s'
        // 超时时间 24小时
        expiresIn: '168h'
      }
    }),
    HttpModule,
    UserModule,
    RoleModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AuthModule {}
