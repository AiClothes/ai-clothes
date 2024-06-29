import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private request: any;

  setRequest(request: any) {
    this.request = request;
  }

  getRequest(): any {
    return this.request;
  }
}
