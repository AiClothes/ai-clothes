import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
export declare class AppController {
    private readonly appService;
    private logClient;
    constructor(appService: AppService, logClient: ClientProxy);
    getHello(): string;
    sum(numArr: Array<number>): number;
    calculate(): Observable<number>;
}
