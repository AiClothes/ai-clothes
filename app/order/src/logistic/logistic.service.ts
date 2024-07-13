import { Injectable } from '@nestjs/common';
import { CreateLogisticDto } from './dto/create-logistic.dto';
import { UpdateLogisticDto } from './dto/update-logistic.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { OperateObjectType, OperateType } from '@one-server/core';
import { QueryLogisticDto } from './dto/query-logistic.dto';

@Injectable()
export class LogisticService {
  constructor(
    private prisma: PrismaService,
    private log: LogService
  ) {}

  async create(data: CreateLogisticDto) {
    const r = await this.prisma.logistic.create({
      data: {
        ...data
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.CREATE,
      operate_object_type: OperateObjectType.PAYMENT,
      operate_object_id: r.id,
      operate_content: '',
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  async findAll(query: QueryLogisticDto) {
    const { current = 1, page_size = 20, name } = query;
    // const skip = (current - 1) * page_size;
    // const take = page_size;
    return this.prisma.logistic.findMany({
      where: {
        deleted_at: null,
        name: {
          contains: name
        }
      },
      orderBy: {
        created_at: 'desc'
      }
      // skip: skip,
      // take: take
    });
  }

  // 数量查询
  count(query: QueryLogisticDto) {
    const { name } = query;
    return this.prisma.logistic.count({
      where: {
        deleted_at: null,
        name: {
          contains: name
        }
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.logistic.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdateLogisticDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.logistic.update({
      where: {
        id: data.id
      },
      data: data
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.PAYMENT,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.logistic.update({
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
      operate_object_type: OperateObjectType.PAYMENT,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }
}
