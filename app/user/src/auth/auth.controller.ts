import {
  Body,
  Controller,
  Request,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { OFF_JWT } from '@one-server/core';
import { OnlineWxUserDto } from './dto/online-wx-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  @OFF_JWT()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log('signInDto', signInDto);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @OFF_JWT()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.signUp({
      username: signUpDto.username,
      password: signUpDto.password,
      email: signUpDto.email,
      nickname: signUpDto.nickname
    });
  }

  // 登出
  @Post('logout')
  logout(@Request() req) {
    console.log('req.user', req);
    return this.authService.logout(req);
  }

  // @UseGuards(AuthGuard)
  @Post('profile')
  @Get('profile')
  async getProfile(@Request() req) {
    const { user } = req;
    const { user_id, username, ...reset } = user;
    console.log('user', user);
    // 获取完整用户信息
    const fullData = await this.userService.findOne(user_id);
    return { id: user_id, user_id: user_id, username, ...reset, ...fullData };
  }

  // 判断当前用户是否有某个权限
  @Post('access')
  async hasAccess(@Request() req, @Body() body: { permission: string }) {
    // console.log('body', body);
    const { user } = req;
    const { user_id, username, ...reset } = user;
    // console.log('user', user);
    // 获取完整用户信息
    const fullData = await this.userService.findOne(user_id);
    let access = false;
    // 查询绑定的角色
    // console.log('fullData', fullData);
    if (!fullData.is_super) {
      const { roles } = fullData;
      roles.forEach((r) => {
        if (access) {
          return;
        }
        const { permissions } = r.role;
        permissions.forEach((p) => {
          if (access) {
            return;
          }
          if (p.permission.name === body.permission) {
            access = true;
          }
        });
      });
    } else {
      if (fullData.is_super) {
        access = true;
      }
    }
    console.log('access', access);
    return {
      access: access
    };
  }

  @OFF_JWT()
  @Post('online-wx-user')
  async onlineWXUser(@Body() data: OnlineWxUserDto) {
    try {
      return await this.authService.onlineWXUser(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
