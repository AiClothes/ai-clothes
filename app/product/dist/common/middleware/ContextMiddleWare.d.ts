import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextService } from '../../context/context.service';
export declare class ContextMiddleware implements NestMiddleware {
    private readonly requestContextService;
    constructor(requestContextService: ContextService);
    use(req: Request, res: Response, next: NextFunction): void;
}
