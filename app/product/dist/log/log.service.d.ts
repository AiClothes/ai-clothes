import { ClientProxy } from '@nestjs/microservices';
import { ContextService } from '../context/context.service';
import { CreateLogDto } from './dto/create-log.dto';
export declare class LogService {
    private logClient;
    private readonly requestContextService;
    constructor(logClient: ClientProxy, requestContextService: ContextService);
    system_operate(data: CreateLogDto): void;
}
