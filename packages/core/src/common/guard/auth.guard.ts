import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_OFF_JWT } from '../decorators';
import { IS_WX } from '../decorators/is_wx.dectory';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isOffJWT = this.reflector.getAllAndOverride<boolean>(IS_OFF_JWT, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isOffJWT) {
      // 💡 See this condition
      // console.log('isOffJWT', isOffJWT);
      return true;
    }

    // 再加一个给微信小程序使用的token 这个是一个标识
    const isWXToken = this.reflector.getAllAndOverride<boolean>(IS_WX, [
      context.getHandler(),
      context.getClass()
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    // 微信的处理必须校验openid
    if (isWXToken) {
      if (!request['user'].openid) {
        throw new UnauthorizedException();
      }
    } else {
      // 后台程序和小程序分割 没有后台的某个特定值，不给用
      if (!request['user'].__admin_a318) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
