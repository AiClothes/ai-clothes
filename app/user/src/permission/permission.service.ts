import { Injectable } from '@nestjs/common';
import { BaseService } from '@one-server/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionService extends BaseService {
  constructor(private prisma: PrismaService) {
    super(prisma.permission);
  }

  // todo 其他权限相关操作
}
