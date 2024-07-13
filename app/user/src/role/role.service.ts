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
    const { name } = query;
    return this.prisma.role.findMany({
      where: {
        deleted_at: null,
        name: {
          contains: name
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
      // skip: skip,
      // take: take
    });
  }

  // 数量查询
  count(query: QueryRoleDto) {
    const { name } = query;
    return this.prisma.role.count({
      where: {
        deleted_at: null,
        name: {
          contains: name
        }
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

  async bindPermission(data: { role_id: number; permission_id: number }) {
    const { role_id, permission_id } = data;
    const role = await this.prisma.role.findUnique({
      where: {
        id: role_id
      }
    });
    if (!role) {
      throw new Error('未知角色！');
    }
    const permission = await this.prisma.permission.findUnique({
      where: {
        id: permission_id
      }
    });
    if (!permission) {
      throw new Error('未知权限！');
    }
    const link = await this.prisma.rolePermissionLinks.findFirst({
      where: {
        role_id: role_id,
        permission_id: permission_id
      }
    });
    if (link) {
      throw new Error('权限已经绑定！');
    }
    console.log('role', role);
    console.log('permission', permission);
    const r = await this.prisma.rolePermissionLinks.create({
      data: {
        role_id: role_id,
        permission_id: permission_id
      }
    });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.ROLE,
        operate_object_id: r.role_id,
        operate_content: JSON.stringify(data),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.CREATE);
  }

  async unBindPermission(data: { role_id: number; permission_id: number }) {
    const { role_id, permission_id } = data;
    const link = await this.prisma.rolePermissionLinks.findFirst({
      where: {
        role_id: role_id,
        permission_id: permission_id
      }
    });
    if (!link) {
      throw new Error('错误的权限配置！');
    }
    // 这里基本是只删除一个
    const r = await this.prisma.rolePermissionLinks.deleteMany({
      where: {
        role_id: role_id,
        permission_id: permission_id
      }
    });
    console.log('r', r);
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.DELETE,
        operate_object_type: OperateObjectType.ROLE,
        operate_object_id: role_id,
        operate_content: JSON.stringify(data),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.DELETE);
  }
}
