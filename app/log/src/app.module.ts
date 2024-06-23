import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE, MICROSERVICE_PORTS } from '@one-server/core';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE.USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: MICROSERVICE_PORTS.USER_SERVICE
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
