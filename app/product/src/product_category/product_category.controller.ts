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
      return await this.productCategoryService.findAll(query);
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
}
