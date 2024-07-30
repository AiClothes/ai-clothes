import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { ErrorInfo, OperateObjectType, OperateType } from '@one-server/core';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LogService
  ) {}

  async create(data: CreateUserDto) {
    const {
      password = '123456',
      username,
      email,
      phone,
      role_ids = [],
      ...rest
    } = data;
    console.log('data', data);
    // 检查用户名、邮箱、手机号是否重复
    const check = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username
          },
          {
            email
          },
          {
            phone
          }
        ]
      }
    });
    if (check) {
      throw new Error(`相同的用户名\\邮箱\\手机号已存在`);
    }
    const r = await this.prisma.user
      .create({
        data: {
          username,
          email,
          phone,
          password,
          ...rest,
          roles: {
            // 创建用户的同时可以直接绑定角色
            create: role_ids.map((r) => ({ role_id: r }))
          }
        }
      })
      .catch((e) => {
        console.log(
          `${new Date().toLocaleDateString()} [UserService][create] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.USER,
        operate_object_id: r.id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.CREATE);
  }

  async findAll(query: QueryUserDto) {
    const { current = 1, page_size = 20, email, phone } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.user.findMany({
      where: {
        deleted_at: null,
        email: {
          contains: email
        },
        phone: {
          contains: phone
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      skip: skip,
      take: take
    });
  }

  // 数量查询
  async count(query: QueryUserDto) {
    const { email, phone } = query;
    return this.prisma.user.count({
      where: {
        deleted_at: null,
        email: {
          contains: email
        },
        phone: {
          contains: phone
        }
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id
      },
      // 多级关联
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async findUniqueByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username: username
      }
    });
  }

  async update(data: UpdateUserDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.user
      .update({
        where: {
          id: data.id
        },
        data: data
      })
      .catch((e) => {
        console.log(
          `${new Date().toLocaleDateString()} [UserService][update] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.UPDATE,
        operate_object_type: OperateObjectType.USER,
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
    const r = await this.prisma.user
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
          `${new Date().toLocaleDateString()} [UserService][remove] e:`,
          e.message
        );
      });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.DELETE,
        operate_object_type: OperateObjectType.USER,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.DELETE);
  }

  async bindRole(data: { role_id: number; user_id: number }) {
    const { role_id, user_id } = data;
    const old = await this.findOne(user_id);
    if (!old) {
      throw new Error('用户不存在');
    }
    const role = await this.prisma.role.findUnique({
      where: {
        id: role_id
      }
    });
    if (!role) {
      throw new Error('角色不存在');
    }
    const check = await this.prisma.userRoleLinks.findFirst({
      where: {
        role_id,
        user_id
      }
    });
    if (check) {
      throw new Error('用户已绑定该角色');
    }
    const r = await this.prisma.userRoleLinks.create({
      data: {
        role_id,
        user_id
      }
    });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.USER,
        operate_object_id: user_id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.CREATE);
  }

  async unbindRole(data: { role_id: number; user_id: number }) {
    const { role_id, user_id } = data;
    const old = await this.findOne(user_id);
    if (!old) {
      throw new Error('用户不存在');
    }
    const role = await this.prisma.role.findUnique({
      where: {
        id: role_id
      }
    });
    if (!role) {
      throw new Error('角色不存在');
    }
    const check = await this.prisma.userRoleLinks.findFirst({
      where: {
        role_id,
        user_id
      }
    });
    if (!check) {
      throw new Error('用户未绑定该角色');
    }
    const r = await this.prisma.userRoleLinks.deleteMany({
      where: {
        user_id: user_id,
        role_id: role_id
      }
    });
    if (r) {
      this.log.system_operate({
        success: true,
        operate_type: OperateType.DELETE,
        operate_object_type: OperateObjectType.USER,
        operate_object_id: user_id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r)
      });
      return r;
    }
    throw new Error(ErrorInfo.UPDATE);
  }

  async findWXOne(id: number, openid: string) {
    return this.prisma.frontUser.findUnique({
      where: {
        id: id,
        openid: openid
      },
      // 过滤部分显示内容
      select: {
        id: true,
        openid: true,
        nickname: true,
        avatar: true,
        created_at: true,
        phone: true
      }
    });
  }
}
