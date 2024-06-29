import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { ErrorInfo, OperateObjectType, OperateType } from '@one-server/core';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LogService
  ) {}

  async create(data: CreateRoleDto) {
    const r = await this.prisma.role
      .create({
        data: {
          ...data
        }
      })
      .catch((e) => {
        console.log(
          `${new Date().toLocaleDateString()} [RoleService][create] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.ROLE,
        operate_object_id: r.id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.CREATE);
  }

  findAll(query: QueryRoleDto) {
    const {} = query;
    return this.prisma.role.findMany({
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
    return this.prisma.role.count({
      where: {
        deleted_at: null
      }
    });
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdateRoleDto) {
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
          `${new Date().toLocaleDateString()} [RoleService][update] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.UPDATE,
        operate_object_type: OperateObjectType.ROLE,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.UPDATE);
  }

  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.role
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
          `${new Date().toLocaleDateString()} [RoleService][remove] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.DELETE,
        operate_object_type: OperateObjectType.ROLE,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.DELETE);
  }
}
