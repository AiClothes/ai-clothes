import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSecretKeyDto } from './dto/create-secret_key.dto';
import { UpdateSecretKeyDto } from './dto/update-secret_key.dto';
import { OperateObjectType, OperateType } from '@one-server/core';
import { LogService } from '../log/log.service';
import { PrismaService } from '../prisma/prisma.service';
import { QuerySecretKeyDto } from './dto/query-secret_key.dto';

@Injectable()
export class SecretKeyService {
  constructor(
    private prisma: PrismaService,
    private log: LogService
  ) {}

  async create(data: CreateSecretKeyDto) {
    const r = await this.prisma.secretKey.create({
      data: {
        ...data
      }
    });
    return r;
  }

  async createBatch(data: { batch: CreateSecretKeyDto[] }) {
    return this.prisma.secretKey.createMany({
      data: data.batch.map((key) => ({ ...key })),
      skipDuplicates: true // 跳过重复的键
    });
  }

  async findAll(query: QuerySecretKeyDto) {
    const { current = 1, page_size = 20 } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.secretKey.findMany({
      where: {
        deleted_at: null
      },
      orderBy: {
        // created_at: 'desc'
      },
      include: {
        Transaction: {
          include: {
            user: true
          }
        }
      },
      skip: skip,
      take: take
    });
  }

  // 数量查询
  count(query: QuerySecretKeyDto) {
    const {} = query;
    return this.prisma.secretKey.count({
      where: {
        deleted_at: null
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.secretKey.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdateSecretKeyDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.secretKey.update({
      where: {
        id: data.id
      },
      data: data
    });
    return r;
  }

  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.secretKey.update({
      where: {
        id: id
      },
      data: {
        deleted_at: new Date()
      }
    });
    return r;
  }

  async useKey(data: { key: string; user_id: number }) {
    const r = await this.prisma.$transaction(async (prisma) => {
      // 读取用户的gold
      const user = await prisma.frontUser.findUnique({
        where: { id: data.user_id }
      });

      if (!user) {
        throw new Error('用户不存在');
      }

      const secretKey = await prisma.secretKey.findUnique({
        where: { key: data.key }
      });

      if (!secretKey || secretKey.consumed) {
        throw new Error('秘钥无效或已被消费');
      }

      await prisma.transaction.create({
        data: {
          user_id: data.user_id,
          secret_key_id: secretKey.id
        }
      });

      const updatedSecretKey = await prisma.secretKey.update({
        where: { id: secretKey.id },
        data: { consumed: true }
      });

      const { gold } = secretKey;
      const { gold: userGold } = user;

      await prisma.frontUser.update({
        where: { id: data.user_id },
        data: { gold: gold + userGold }
      });

      return [updatedSecretKey];
    });
    return r;
  }
}
