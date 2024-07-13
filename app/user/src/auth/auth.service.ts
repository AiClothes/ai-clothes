import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // 登录
  async signIn(username: string, password: string): Promise<any> {
    console.log('username', username);
    const user = await this.userService.findUniqueByUsername(username);
    // console.log('user', user);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { user_id: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  // 注册(单点前端用户登录)
  async signUp({
    username,
    password,
    email,
    nickname
  }: {
    username: string;
    password: string;
    email: string;
    nickname: string;
  }): Promise<any> {
    // const user = await this.userService.create({
    //   username,
    //   password,
    //   email
    // });
    // const payload = { user_id: user.id, username: user.username };
    // return {
    //   access_token: await this.jwtService.signAsync(payload)
    // };
    return {};
  }

  // 登出 前端清除
  async logout(req: any): Promise<any> {
    // 清除jwt 将jwt加入到指定的黑名单中即可
    return {
      message: '登出成功'
    };
  }
}
