import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextService } from '../../context/context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: ContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.requestContextService.setRequest(req);
    next();
  }
}
