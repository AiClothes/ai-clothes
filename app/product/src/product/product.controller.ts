import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductSpecificationValueDto } from './dto/create-product-specification-value.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationCombinationDto } from './dto/update-product-specification-combination.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { UpdateProductSpecificationValueDto } from './dto/update-product-specification-value.dto';
import { MessagePattern } from '@nestjs/microservices';
import { OFF_JWT, WX } from '@one-server/core';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() data: CreateProductDto) {
    try {
      return await this.productService.create(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-simple-all')
  async findSimpleAll(@Body() query: QueryProductDto) {
    try {
      const count = await this.productService.count(query);
      const list = await this.productService.findSimpleAll(query);
      return { count, list };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('find-all')
  async findAll(@Body() query: QueryProductDto) {
    try {
      const count = await this.productService.count(query);
      const list = await this.productService.findAll(query);
      return { count, list };
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
      return await this.productService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @MessagePattern('find_product_by_id')
  async findOne_message(id: number) {
    try {
      return await this.productService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @MessagePattern('update_product_quantity')
  async updateSpecificationCombination_message(
    data: UpdateProductSpecificationCombinationDto
  ) {
    try {
      return await this.productService.updateSpecificationCombinationQuantity(
        data
      );
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('update')
  async update(@Body() data: UpdateProductDto) {
    try {
      return await this.productService.update(data);
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
      return await this.productService.remove(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 创建商品图片
  @Post('create-image')
  async createImage(@Body() data: CreateProductImageDto) {
    try {
      return await this.productService.createImage(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 更新商品图片
  @Post('update-image')
  async updateImage(@Body() data: { images: UpdateProductImageDto[] }) {
    try {
      return await this.productService.updateImage(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 删除图片
  @Post('delete-image')
  async removeImage(@Body('id') id: number) {
    try {
      return await this.productService.removeImage(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 创建商品规格 删除其他，重新创建
  @Post('create-specification')
  async createSpecification(@Body() data: CreateProductSpecificationDto) {
    try {
      return await this.productService.createSpecification(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 修改商品规格 只修改名称
  /*@Post('update-specification')
  async updateSpecification(@Body() data: UpdateProductSpecificationDto) {
    try {
      return await this.productService.updateSpecification(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }*/

  // 创建商品规格值 会添加一个新的，但是旧的不会删
  @Post('create-specification-value')
  async createSpecificationValue(
    @Body() data: CreateProductSpecificationValueDto
  ) {
    try {
      return await this.productService.createSpecificationValue(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 修改商品规格值 修改名称
  @Post('update-specification-value')
  async updateSpecificationValue(
    @Body() data: UpdateProductSpecificationValueDto
  ) {
    try {
      return await this.productService.updateSpecificationValue(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // 修改商品规格值组合配置 修改组合的实际内容
  @Post('update-specification-combination')
  async updateSpecificationCombination(
    @Body() data: UpdateProductSpecificationCombinationDto
  ) {
    try {
      return await this.productService.updateSpecificationCombination(data);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @OFF_JWT()
  @Post('wx-find-all')
  async findSimpleAllWX(@Body() query: QueryProductDto) {
    try {
      if (!query.category_id) {
        throw new Error('无法查询商品信息！');
      }
      const _query = {
        category_id: query.category_id,
        status: 1
      };
      const count = await this.productService.count(_query);
      const list = await this.productService.findSimpleAll(_query);
      return { count, list };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('wx-find-list')
  async findAllWX(@Body() query: QueryProductDto) {
    try {
      if (!query.category_id) {
        throw new Error('无法查询商品信息！');
      }
      const _query = {
        category_id: query.category_id,
        status: 1
      };
      const count = await this.productService.count(_query);
      const list = await this.productService.findSimpleAll(_query);
      return { count, list };
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @WX()
  @Post('wx-find-one')
  async findOneWX(@Body('id') id: number) {
    try {
      return await this.productService.findOne(id);
    } catch (e) {
      throw new HttpException(
        { message: e.message, errors: e },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
