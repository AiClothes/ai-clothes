import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { OperateObjectType, OperateType } from '@one-server/core';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private log: LogService
  ) {}

  async create(data: CreatePaymentDto) {
    const r = await this.prisma.payment.create({
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

  async findAll(query: QueryPaymentDto) {
    const { current = 1, page_size = 20, name } = query;
    // const skip = (current - 1) * page_size;
    // const take = page_size;
    return this.prisma.payment.findMany({
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
  count(query: QueryPaymentDto) {
    const { name } = query;
    return this.prisma.payment.count({
      where: {
        deleted_at: null,
        name: {
          contains: name
        }
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.payment.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdatePaymentDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.payment.update({
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
    const r = await this.prisma.payment.update({
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
