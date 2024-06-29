import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ErrorInfo, OperateObjectType, OperateType } from '@one-server/core';

@Injectable()
export class PermissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LogService
  ) {}

  async create(data: CreatePermissionDto) {
    const r = await this.prisma.permission
      .create({
        data: {
          ...data
        }
      })
      .catch((e) => {
        console.log(
          `${new Date().toLocaleDateString()} [PermissionService][create] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.PERMISSION,
        operate_object_id: r.id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.CREATE);
  }

  // findAll全部用来使用分页查询方案
  findAll(query: QueryPermissionDto) {
    const {} = query;
    return this.prisma.permission.findMany({
      where: {
        deleted_at: null
      },
      orderBy: {
        created_at: 'desc'
      }
      // skip: skip,
      // take: take
    });
  }

  // 数量查询
  count() {
    return this.prisma.permission.count({
      where: {
        deleted_at: null
      }
    });
  }

  findOne(id: number) {
    return this.prisma.permission.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdatePermissionDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.permission
      .update({
        where: {
          id: data.id
        },
        data: data
      })
      .catch((e) => {
        console.log(
          `${new Date().toLocaleDateString()} [PermissionService][update] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.UPDATE,
        operate_object_type: OperateObjectType.PERMISSION,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.UPDATE);
  }

  // 设置deleted_at时间为真
  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.permission
      .update({
        where: {
          id: id
        },
        data: {
          deleted_at: new Date()
        }
      })
      .catch((e) => {
        console.log(
          `${new Date().toLocaleDateString()} [PermissionService][remove] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.DELETE,
        operate_object_type: OperateObjectType.PERMISSION,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.DELETE);
  }
}
