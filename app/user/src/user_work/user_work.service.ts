import { Injectable, Request } from '@nestjs/common';
import { CreateUserWorkDto } from './dto/create-user_work.dto';
import { UpdateUserWorkDto } from './dto/update-user_work.dto';
import { OperateObjectType, OperateType } from '@one-server/core';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { QueryUserWorkDto } from './dto/query-user_work.dto';
import { WorkType } from '../common/enum/WorkType';

@Injectable()
export class UserWorkService {
  constructor(
    private prisma: PrismaService,
    private log: LogService
  ) {}

  async create(data: CreateUserWorkDto, user_id: number) {
    const {
      images = [],
      name,
      description,
      create_type,
      content,
      is_collect,
      info,
      is_delete,
      is_public,
      product_id,
      source,
      status,
      cover
    } = data;
    const r = await this.prisma.userWork.create({
      data: {
        user_id: user_id,
        name: name || '未命名',
        description: description || '',
        create_type: create_type,
        content: content,
        is_collect: is_collect,
        info: info || '',
        ...(product_id ? { product_id: product_id } : {}),
        source: source,
        ...(status || status === 0 ? { status: status } : {}),
        ...(cover ? { cover: cover } : {}),
        // 附加图片
        ...(images && images.length > 0
          ? {
              images: {
                create: images
              }
            }
          : {})
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.CREATE,
      operate_object_type: OperateObjectType.USER_WORK,
      operate_object_id: r.id,
      operate_content: '',
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // updateWorkImages用于为产品相关的作品进行保存
  async updateWorkImages(
    data: { work_id: number; url: string; front_type: number },
    user_id: number
  ) {
    const { work_id, url, front_type } = data;
    const images = await this.prisma.userWorkImages.findMany({
      where: {
        id: work_id
      }
    });
    const old = images.find((r) => r.front_type === front_type);
    if (old) {
      const r = await this.prisma.userWorkImages.update({
        where: {
          id: old.id
        },
        data: {
          url: url
        }
      });
      return r;
    }
    const r = await this.prisma.userWorkImages.create({
      data: {
        work_id: work_id,
        url: url,
        front_type: front_type
      }
    });
    return r;
  }

  // findAll全部用来使用分页查询方案
  findAll(query: QueryUserWorkDto) {
    const {
      current = 1,
      page_size = 20,
      user_id,
      name,
      source,
      create_type
    } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.userWork.findMany({
      where: {
        deleted_at: null,
        ...(user_id ? { user_id: user_id } : {}),
        ...(name ? { name: { contains: name } } : {}),
        ...(source ? { source: source } : {}),
        ...(create_type
          ? {
              create_type: {
                in: create_type
              }
            }
          : {})
      },
      include: {
        parent: true,
        children: true,
        user: true,
        images: true
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: skip,
      take: take
    });
  }

  // 数量查询
  count(query: QueryUserWorkDto) {
    const { user_id, name, source, create_type } = query;
    return this.prisma.userWork.count({
      where: {
        deleted_at: null,
        ...(user_id ? { user_id: user_id } : {}),
        ...(name ? { name: { contains: name } } : {}),
        ...(source ? { source: source } : {}),
        ...(create_type
          ? {
              create_type: {
                in: create_type
              }
            }
          : {})
      }
    });
  }

  // 查询具体日志信息
  findOne(id: number) {
    return this.prisma.userWork.findUnique({
      where: {
        id: id
      },
      include: {
        images: true,
        parent: true,
        children: true
      }
    });
  }

  // 查询具体日志信息
  findManyByExt(user_id: number, product_id: number) {
    // 不是用唯一id查询的内容，需要使用findFirst
    return this.prisma.userWork.findMany({
      where: {
        user_id: user_id,
        product_id: product_id,
        source: WorkType.BUILD_PRODUCT
      },
      include: {
        images: true,
        parent: true,
        children: true
      }
    });
  }

  async update(data: UpdateUserWorkDto) {
    const {
      images,
      name,
      description,
      create_type,
      content,
      is_collect,
      info,
      is_delete,
      is_public,
      product_id,
      source,
      status,
      cover
    } = data;

    const old = await this.findOne(data.id);
    const r = await this.prisma.userWork.update({
      where: {
        id: data.id
      },
      data: {
        ...(name ? { name: name } : {}),
        ...(description ? { description: description } : {}),
        ...(product_id ? { product_id: product_id } : {}),
        ...(create_type ? { create_type: create_type } : {}),
        ...(is_delete !== undefined ? { is_delete: is_delete } : {}),
        ...(is_public !== undefined ? { is_public: is_public } : {}),
        ...(is_collect !== undefined ? { is_collect: is_collect } : {}),
        ...(product_id ? { product_id: product_id } : {}),
        ...(status || status === 0 ? { status: status } : {}),
        ...(cover ? { cover: cover } : {})
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.USER_WORK,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 设置deleted_at时间为真
  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.userWork.update({
      where: {
        id: id
      },
      data: {
        deleted_at: new Date()
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.DELETE,
      operate_object_type: OperateObjectType.USER_WORK,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 数量查询
  countMyWorks(query: QueryUserWorkDto, user_id: number) {
    const { is_collect, create_type } = query;
    return this.prisma.userWork.count({
      where: {
        deleted_at: null,
        is_delete: false,
        user_id: user_id,
        ...(is_collect !== undefined ? { is_collect: is_collect } : {}),
        create_type: {
          in: create_type
        }
      }
    });
  }

  async findMyWorks(query: QueryUserWorkDto, user_id: number) {
    const { current = 1, page_size = 10, is_collect, create_type } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.userWork.findMany({
      where: {
        deleted_at: null,
        is_delete: false,
        user_id: user_id,
        ...(is_collect !== undefined ? { is_collect: is_collect } : {}),
        create_type: {
          in: create_type
        }
      },
      include: {
        // 只需要images
        images: true
      },
      orderBy: {
        // 按照创建时间倒序
        // created_at: 'desc',
        // 按照更新时间倒序
        updated_at: 'desc'
      },
      skip: skip,
      take: take
    });
  }

  async findMyWorkDetail(id: number) {
    return this.prisma.userWork.findUnique({
      where: {
        id: id
      },
      include: {
        images: true,
        parent: true,
        children: true
      }
    });
  }
}
