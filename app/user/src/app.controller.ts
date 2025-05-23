import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MICROSERVICE } from '@one-server/core';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(MICROSERVICE.LOG_SERVICE) private logClient: ClientProxy
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('log_to_user')
  sum(numArr: Array<number>): number {
    console.log('log_to_user');
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Get('user_to_log')
  calculate(): Observable<number> {
    console.log('user_to_log');
    return this.logClient.send<number>('user_to_log', [1, 2, 3, 4, 5]);
  }
}
