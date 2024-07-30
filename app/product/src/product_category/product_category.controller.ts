import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { QueryProductCategoryDto } from './dto/query-system_operate_log.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { OFF_JWT, WX } from '@one-server/core';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}

  @Post('create')
  async create(@Body() data: CreateProductCategoryDto) {
    try {
      return await this.productCategoryService.create(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QueryProductCategoryDto) {
    try {
      const count = await this.productCategoryService.count(query);
      const list = await this.productCategoryService.findAll(query);
      return { count, list };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-tree')
  async findTree(@Body() query: object) {
    try {
      return await this.productCategoryService.findTree(query);
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
      return await this.productCategoryService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateProductCategoryDto) {
    try {
      return await this.productCategoryService.update(data);
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
      return await this.productCategoryService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @OFF_JWT()
  @Post('wx-find-all')
  async findAllWX(@Body() query: QueryProductCategoryDto) {
    try {
      const count = await this.productCategoryService.count(query);
      const list = await this.productCategoryService.findAll(query);
      return { count, list };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
