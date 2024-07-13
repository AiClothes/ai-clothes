import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { QueryProductCategoryDto } from './dto/query-system_operate_log.dto';
import { OperateObjectType, OperateType } from '@one-server/core';

@Injectable()
export class ProductCategoryService {
  constructor(
    private prisma: PrismaService,
    private log: LogService
  ) {}

  async create(data: CreateProductCategoryDto) {
    const r = await this.prisma.productCategory.create({
      data: {
        ...data
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.CREATE,
      operate_object_type: OperateObjectType.PRODUCT_CATEGORY,
      operate_object_id: r.id,
      operate_content: '',
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // findAll全部用来使用分页查询方案
  findAll(query: QueryProductCategoryDto) {
    const { current = 1, page_size = 20, name, parent_id } = query;
    // 初期分类不需要设置分页
    // const skip = (current - 1) * page_size;
    // const take = page_size;
    return this.prisma.productCategory.findMany({
      where: {
        deleted_at: null,
        name: {
          contains: name
        },
        ...(parent_id ? { parent_id: parent_id } : {})
      },
      include: {
        parent: true,
        children: true
      },
      orderBy: {
        created_at: 'desc'
      }
      // skip: skip,
      // take: take
    });
  }

  // 数量查询
  count(query: QueryProductCategoryDto) {
    const { name, parent_id } = query;
    return this.prisma.productCategory.count({
      where: {
        deleted_at: null,
        name: {
          contains: name
        },
        ...(parent_id ? { parent_id: parent_id } : {})
      }
    });
  }

  findTree(query: object) {
    return this.prisma.productCategory.findMany({
      where: {
        deleted_at: null,
        parent_id: null
      },
      include: {
        children: true
      }
    });
  }

  // 查询具体日志信息
  findOne(id: number) {
    return this.prisma.productCategory.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdateProductCategoryDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.productCategory.update({
      where: {
        id: data.id
      },
      data: data
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.PRODUCT_CATEGORY,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 设置deleted_at时间为真
  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.productCategory.update({
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
      operate_object_type: OperateObjectType.PRODUCT_CATEGORY,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }
}
