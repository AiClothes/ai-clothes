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

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    console.log('sum log');
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Get('user')
  calculate(): Observable<number> {
    console.log('sum log');
    return this.userClient.send<number>('sum', [1, 2, 3, 4, 5, 6]);
  }
}
