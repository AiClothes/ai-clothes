import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE, MICROSERVICE_PORTS } from '@one-server/core';

@Global()
@Module({
  imports: [
    // 注册微服务
    ClientsModule.register([
      {
        name: MICROSERVICE.USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: MICROSERVICE_PORTS.USER_SERVICE
        }
      },
      {
        name: MICROSERVICE.LOG_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: MICROSERVICE_PORTS.LOG_SERVICE
        }
      },
      {
        name: MICROSERVICE.ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: MICROSERVICE_PORTS.ORDER_SERVICE
        }
      }
    ])
  ],
  exports: [ClientsModule] // 导出 ClientsModule
})
export class MicroservicesModule {}
