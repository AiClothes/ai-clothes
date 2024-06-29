import { Injectable } from '@nestjs/common';
import { CreateSystemOperateLogDto } from './dto/create-system_operate_log.dto';
import { UpdateSystemOperateLogDto } from './dto/update-system_operate_log.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QuerySystemOperateLogDto } from './dto/query-system_operate_log.dto';

@Injectable()
export class SystemOperateLogService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSystemOperateLogDto) {
    return this.prisma.systemOperateLog.create({
      data: {
        ...data
      }
    });
  }

  // findAll全部用来使用分页查询方案
  findAll(query: QuerySystemOperateLogDto) {
    const { current = 1, page_size = 20 } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.systemOperateLog.findMany({
      where: {
        deleted_at: null
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: skip,
      take: take
    });
  }

  // 数量查询
  count() {
    return this.prisma.systemOperateLog.count({
      where: {
        deleted_at: null
      }
    });
  }

  // 查询具体日志信息
  findOne(id: number) {
    return this.prisma.systemOperateLog.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdateSystemOperateLogDto) {
    return this.prisma.systemOperateLog.update({
      where: {
        id: data.id
      },
      data: data
    });
  }

  // 设置deleted_at时间为真
  remove(id: number) {
    return this.prisma.systemOperateLog.update({
      where: {
        id: id
      },
      data: {
        deleted_at: new Date()
      }
    });
  }
}
