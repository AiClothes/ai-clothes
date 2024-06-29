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

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    console.log('sum log');
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Get('product_to_log')
  calculate(): Observable<number> {
    console.log('product_to_log');
    return this.logClient.send<number>('product_to_log', [1, 2, 3, 4, 5, 6]);
  }
}
