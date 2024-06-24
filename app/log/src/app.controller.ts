import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MICROSERVICE } from '@one-server/core';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(MICROSERVICE.USER_SERVICE) private userClient: ClientProxy
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('user_to_log')
  sum(numArr: Array<number>): number {
    console.log('user_to_log');
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Get('log_to_user')
  calculate(): Observable<number> {
    console.log('log_to_user');
    return this.userClient.send<number>('log_to_user', [1, 2, 3, 4, 5, 6]);
  }
}
