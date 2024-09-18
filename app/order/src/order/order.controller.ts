import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OFF_JWT, WX } from '@one-server/core';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() data: CreateOrderDto) {
    try {
      return await this.orderService.create(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('create-wx')
  async createWX(@Body() data: CreateOrderDto) {
    try {
      return await this.orderService.create(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QueryOrderDto) {
    try {
      const list = await this.orderService.findAll(query);
      const count = await this.orderService.count(query);
      return { list, count };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all-count')
  async findAllCount(@Body() query: QueryOrderDto) {
    try {
      return await this.orderService.count(query);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-one')
  async findOne(@Body('id') id: number) {
    try {
      return await this.orderService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateOrderDto) {
    try {
      return await this.orderService.update(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('remove')
  async remove(@Body('id') id: number) {
    try {
      return await this.orderService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 总销售额度
  @Post('total-sales')
  async totalSales() {
    try {
      return await this.orderService.totalSales();
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 按日期查询订单量
  @Post('order-count-by-date')
  async orderCountByDate(
    @Body('start_date') start_date: string,
    @Body('end_date') end_date: string
  ) {
    try {
      return await this.orderService.countByDateRange(start_date, end_date);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('wxpay')
  async wxpay(@Body() data: any) {
    try {
      return await this.orderService.createWxOrder(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @OFF_JWT()
  @Post('wxpay_callback')
  async wxpay_callback(@Body() data: any) {
    try {
      return await this.orderService.createWxOrder(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
