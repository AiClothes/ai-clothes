import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { WeChatPayModule } from 'nest-wechatpay-node-v3';
import * as fs from 'fs';

@Module({
  imports: [
    WeChatPayModule.registerAsync({
      useFactory: async () => {
        return {
          appid: process.env.WX_APPID,
          mchid: process.env.WX_MCHID,
          serial_no: process.env.WX_SERIAL_NO,
          publicKey: fs.readFileSync('./apiclient_cert.pem'), // 公钥
          privateKey: fs.readFileSync('./apiclient_key.pem') // 秘钥
        };
      }
    })
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
