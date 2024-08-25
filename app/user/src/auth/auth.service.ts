import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { OnlineWxUserDto } from './dto/online-wx-user.dto';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import * as qs from 'querystring';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  // 登录
  async signIn(username: string, password: string): Promise<any> {
    console.log('username', username);
    const user = await this.userService.findUniqueByUsername(username);
    // console.log('user', user);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = {
      user_id: user.id,
      username: user.username,
      __admin_a318: true
    };
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
    // TODO 清除jwt 将jwt加入到指定的黑名单中即可
    return {
      message: '登出成功'
    };
  }

  // 微信小程序相关
  async onlineWXUser(onlineWxUserDto: OnlineWxUserDto): Promise<any> {
    // 微信小程序登录
    let login_url = 'https://api.weixin.qq.com/sns/jscode2session';
    const appid = process.env.WX_APPID;
    const secret = process.env.WX_SECRET;
    const { code } = onlineWxUserDto;
    const grant_type = 'authorization_code';

    if (!code) {
      throw new Error('微信登录异常！请检查账户信息！');
    }

    const config: AxiosRequestConfig = {
      // headers: {
      //   ['Content-Type']: 'application/json'
      // },
      method: 'GET', // 等具体的HTTP方法
      responseType: 'json'
    };

    // appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grant_type}
    const body = {
      appid,
      secret,
      js_code: code,
      grant_type
    };

    login_url = `${login_url}?${qs.stringify(body)}`;
    console.log(`login_url`, login_url);

    const response = await this.httpService.axiosRef
      .request({ url: login_url, ...config })
      .then((res) => res)
      .catch((err) => {
        console.error(err.response.data);
        throw err;
      });

    // {
    //   "openid":"xxxxxx",
    //   "session_key":"xxxxx",
    //   "unionid":"xxxxx",
    //   "errcode":0,
    //   "errmsg":"xxxxx"
    // }

    console.log('[onlineWXUser] response', response.data);
    const { openid, session_key, unionid } = response.data;

    if (openid && session_key) {
      // 查询前端用户是否存在
      let user = await this.prisma.frontUser.findUnique({
        where: {
          openid: openid
        }
      });

      // 创建新的前端用户
      if (!user) {
        user = await this.prisma.frontUser.create({
          data: {
            openid: openid,
            session_key: session_key,
            nickname: '新用户',
            avatar: '',
            // 默认创建用户的时候赠送100金币
            gold: 100
          }
        });
      } else {
        // 更新session_key
        user = await this.prisma.frontUser.update({
          where: {
            openid: openid
          },
          data: {
            session_key: session_key
          }
        });
      }

      const payload = { user_id: user.id, openid: user.openid };

      return {
        access_token: await this.jwtService.signAsync(payload)
      };
    }

    throw new Error('登陆异常！请检查账户信息！');
  }
}
