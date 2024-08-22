import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { QueryProductDto } from './dto/query-product.dto';
import { combineSpecifications } from './utils/combine_specifications';
import {
  APPLICATION_PORTS,
  OperateObjectType,
  OperateType
} from '@one-server/core';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductSpecificationValueDto } from './dto/create-product-specification-value.dto';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationCombinationDto } from './dto/update-product-specification-combination.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { UpdateProductSpecificationValueDto } from './dto/update-product-specification-value.dto';
import { CreateProductSellImageDto } from './dto/create-product-sell-image.dto';
import { UpdateProductSellImageDto } from './dto/update-product-sell-image.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private log: LogService
  ) {}

  // 创建商品
  async create(data: CreateProductDto) {
    const {
      category_id,
      name,
      price,
      quantity,
      description = '',
      unit,
      status,
      product_images = [],
      product_specifications = [],
      product_specification_combinations = [],
      product_sell_long_images = []
    } = data;
    const main_image = product_images.find((item) => item.is_main);
    if (!main_image) {
      throw new Error('主页图不能为空');
    }
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      // 创建商品
      const product = await prisma.product.create({
        data: {
          category_id,
          name,
          price,
          // 没有产品属性的，则在这里填写数量
          ...(quantity ? { quantity } : {}),
          description,
          unit,
          // 商品状态 0: 下架 1: 上架 默认下架=未上架
          status: status ? status : 0,
          image: main_image?.url || ''
        }
      });
      console.log('product', product);
      // 创建商品图片
      const images = await Promise.all(
        product_images.map(async (item) => {
          return prisma.productImage.create({
            data: {
              product_id: product.id,
              url: item.url,
              is_main: item.is_main
            }
          });
        })
      );
      console.log('images', images);
      const sell_long_images = await Promise.all(
        product_sell_long_images.map(async (item) => {
          return prisma.productSellLongImage.create({
            data: {
              product_id: product.id,
              url: item.url,
              sort: item.sort
            }
          });
        })
      );
      console.log('sell_long_images', sell_long_images);
      // 创建商品的规格 batch create
      const specifications = await Promise.all(
        product_specifications.map(async (item) => {
          // 创建商品规格
          const productSpecification = await prisma.productSpecification.create(
            {
              data: {
                product_id: product.id,
                name: item.name
              }
            }
          );
          console.log('productSpecification', productSpecification);
          // 创建商品规格值
          const product_specification_values = await Promise.all(
            item.product_specification_values.map(async (value) => {
              return prisma.productSpecificationValue.create({
                data: {
                  specification_id: productSpecification.id,
                  value: value.value
                }
              });
            })
          );
          console.log(
            'product_specification_values',
            product_specification_values
          );
          return {
            ...productSpecification,
            product_specification_values: product_specification_values
          };
        })
      );
      console.log('specifications', specifications);
      // 创建商品规格组合
      const _combineSpecifications = combineSpecifications(specifications);
      console.log('_combineSpecifications', _combineSpecifications);
      const productSpecificationCombinations = await Promise.all(
        _combineSpecifications.map(async (item) => {
          const specification_value_ids = item.map(
            (value) => value.specification_value_id
          );
          const specification_value_values = item.map((value) => value.value);
          // 查找当前组合是否已经存在外部的设定内，用来获取用户设定的数量
          const current_combine = product_specification_combinations.find(
            (value) =>
              value.specification_values.sort().join(',') ===
              specification_value_values.sort().join(',')
          );
          const productSpecificationCombination =
            await prisma.productSpecificationCombination.create({
              data: {
                product_id: product.id,
                specification_value_ids: specification_value_ids.join(','),
                quantity: current_combine?.quantity || 0,
                image: current_combine?.image,
                draw_image: current_combine?.draw_image,
                draw_image_back: current_combine?.draw_image_back,
                price: current_combine?.price
              }
            });
          console.log(
            'productSpecificationCombination',
            productSpecificationCombination
          );
          return {
            ...productSpecificationCombination,
            specification_value_ids
          };
        })
      );
      console.log(
        'productSpecificationCombinations',
        productSpecificationCombinations
      );
      // 创建商品组合详情
      const productSpecificationCombinationDetails = await Promise.all(
        productSpecificationCombinations.map(async (item) => {
          const product_specification_combination_details = await Promise.all(
            item.specification_value_ids.map(async (specification_value_id) => {
              return prisma.productSpecificationCombinationDetail.create({
                data: {
                  combination_id: item.id,
                  specification_value_id: specification_value_id
                }
              });
            })
          );
          return {
            ...item,
            product_specification_combination_details
          };
        })
      );
      console.log(
        'productSpecificationCombinationDetails',
        productSpecificationCombinationDetails
      );
      const r = {
        ...product,
        product_images: images,
        product_sell_long_images: sell_long_images,
        product_specifications: specifications,
        product_specification_combinations: productSpecificationCombinations
      };
      // 记录日志
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.PRODUCT,
        operate_object_id: r.id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    });
  }

  // 查询商品列表
  async findAll(query: QueryProductDto) {
    const { current = 1, page_size = 20, name, status } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.product.findMany({
      where: {
        deleted_at: null,
        name: {
          contains: name
        },
        ...(status ? { status } : {})
      },
      include: {
        product_category: {
          include: {
            parent: true
          }
        },
        product_images: {
          // 只查询有的
          where: {
            deleted_at: null
          }
        },
        product_sell_long_images: {
          // 只查询有的
          where: {
            deleted_at: null
          }
        },
        product_specifications: {
          // 只查询有的
          where: {
            deleted_at: null
          },
          include: {
            product_specification_values: {
              // 只查询有的
              where: {
                deleted_at: null
              }
            }
          }
        },
        product_specification_combinations: {
          // 只查询有的
          where: {
            deleted_at: null
          },
          include: {
            product_specification_combination_details: {
              // 只查询有的
              where: {
                deleted_at: null
              },
              include: {
                specification_value: true
              }
            }
          }
        }
      },
      orderBy: {
        // created_at: 'desc'
        sort: 'asc'
      },
      skip: skip,
      take: take
    });
  }

  // 数量查询
  async count(query: QueryProductDto) {
    const { name, status, is_virtual_goods = [0, 1] } = query;
    return this.prisma.product.count({
      where: {
        deleted_at: null,
        name: {
          contains: name
        },
        ...(status ? { status } : {}),
        product_category: {
          is_virtual_goods: {
            in: is_virtual_goods
          }
        }
      }
    });
  }

  // 查询商品列表 [简单]
  async findSimpleAll(query: QueryProductDto) {
    const {
      current = 1,
      page_size = 10,
      name,
      status,
      category_id,
      is_virtual_goods = [0, 1]
    } = query;
    // const skip = (current - 1) * page_size;
    // const take = page_size;
    return this.prisma.product.findMany({
      where: {
        deleted_at: null,
        name: {
          contains: name
        },
        ...(status ? { status } : {}),
        ...(category_id ? { category_id } : {}),
        product_category: {
          is_virtual_goods: {
            in: is_virtual_goods
          }
        }
      },
      select: {
        id: true,
        name: true,
        status: true,
        product_category: true,
        description: true,
        price: true,
        image: true,
        sort: true,
        pay_account: true
      },
      orderBy: {
        // created_at: 'desc'
        sort: 'asc'
      }
      // skip: skip,
      // take: take
    });
  }

  async findWXAll(query: QueryProductDto) {
    const { current = 1, page_size = 10, name, status, category_id } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.product.findMany({
      where: {
        deleted_at: null,
        name: {
          contains: name
        },
        ...(status ? { status } : {}),
        ...(category_id ? { category_id } : {})
      },
      select: {
        id: true,
        name: true,
        status: true,
        product_category: true,
        description: true,
        price: true,
        image: true
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: skip,
      take: take
    });
  }

  // 查询商品详情
  async findOne(id: number) {
    console.log('id', id);
    return this.prisma.product.findUnique({
      where: {
        id: id
      },
      include: {
        product_category: {
          include: {
            parent: true
          }
        },
        product_images: {
          // 只查询有的
          where: {
            deleted_at: null
          }
        },
        product_sell_long_images: {
          // 只查询有的
          where: {
            deleted_at: null
          }
        },
        product_specifications: {
          // 只查询有的
          where: {
            deleted_at: null
          },
          include: {
            product_specification_values: {
              // 只查询有的
              where: {
                deleted_at: null
              }
            }
          }
        },
        product_specification_combinations: {
          // 只查询有的
          where: {
            deleted_at: null
          },
          include: {
            product_specification_combination_details: {
              // 只查询有的
              where: {
                deleted_at: null
              },
              include: {
                specification_value: true
              }
            }
          }
        }
      }
    });
  }

  // 更新的是商品基础信息
  async update(data: UpdateProductDto) {
    const {
      name,
      description,
      unit,
      status,
      category_id,
      price,
      sort,
      pay_account
    } = data;
    const old = await this.findOne(data.id);
    const r = await this.prisma.product.update({
      where: {
        id: data.id
      },
      data: {
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(unit ? { unit } : {}),
        ...(status || status === 0 ? { status } : {}),
        ...(category_id ? { category_id } : {}),
        ...(price || price === 0 ? { price } : {}),
        ...(sort || sort === 0 ? { sort } : {}),
        ...(pay_account || pay_account === 0 ? { pay_account } : {})
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.PRODUCT,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 设置deleted_at时间为真
  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.product.update({
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
      operate_object_type: OperateObjectType.PRODUCT,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 查询图片详情
  async findImage(id: number) {
    return this.prisma.productImage.findUnique({
      where: {
        id: id
      }
    });
  }

  // 创建商品图片
  async createImage(data: CreateProductImageDto) {
    const { product_id, url, is_main } = data;
    const r = await this.prisma.productImage.create({
      data: {
        product_id,
        url,
        is_main
      }
    });
    if (is_main) {
      await this.prisma.product.update({
        where: {
          id: product_id
        },
        data: {
          image: r.url
        }
      });
      // 同时移除其他的主图
      await this.prisma.productImage.updateMany({
        where: {
          product_id: product_id,
          id: {
            not: r.id
          }
        },
        data: {
          is_main: false
        }
      });
    }
    this.log.system_operate({
      success: true,
      operate_type: OperateType.CREATE,
      operate_object_type: OperateObjectType.PRODUCT_IMAGE,
      operate_object_id: r.id,
      operate_content: '',
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 更新商品图片
  async updateImage(r: { images: UpdateProductImageDto[] }) {
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      const { images } = r;
      const results = [];
      const has_main =
        images.filter((r) => r.is_main && !r.is_delete).length > 0;
      if (!has_main) {
        throw new Error('至少需要一个主图');
      }
      for (let i = 0; i < images.length; i++) {
        const { id, is_main, url, product_id, is_delete = false } = images[i];
        if (!id) {
          // 创建新的
          const r = await prisma.productImage.create({
            data: {
              product_id,
              url,
              is_main
            }
          });
          if (is_main) {
            await prisma.product.update({
              where: {
                id: product_id
              },
              data: {
                image: r.url
              }
            });
            // 同时移除其他的主图
            await prisma.productImage.updateMany({
              where: {
                product_id: product_id,
                id: {
                  not: r.id
                }
              },
              data: {
                is_main: false
              }
            });
          }
          this.log.system_operate({
            success: true,
            operate_type: OperateType.CREATE,
            operate_object_type: OperateObjectType.PRODUCT_IMAGE,
            operate_object_id: r.id,
            operate_content: '',
            operate_result: JSON.stringify(r)
          });
          results.push(r);
          continue;
        }

        const old = await this.findImage(id);

        if (is_delete) {
          const r = await prisma.productImage.update({
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
            operate_object_type: OperateObjectType.PRODUCT_IMAGE,
            operate_object_id: r.id,
            operate_content: JSON.stringify(old),
            operate_result: JSON.stringify(r)
          });
          results.push(r);
          continue;
        }
        const r = await prisma.productImage.update({
          where: {
            id: id
          },
          data: {
            ...(is_main ? { is_main } : {}),
            ...(url ? { url } : {})
          }
        });
        if (is_main) {
          await prisma.product.update({
            where: {
              id: r.product_id
            },
            data: {
              image: r.url
            }
          });
          // 同时移除其他的主图
          await prisma.productImage.updateMany({
            where: {
              product_id: r.product_id,
              id: {
                not: r.id
              }
            },
            data: {
              is_main: false
            }
          });
        }
        this.log.system_operate({
          success: true,
          operate_type: OperateType.UPDATE,
          operate_object_type: OperateObjectType.PRODUCT_IMAGE,
          operate_object_id: r.id,
          operate_content: JSON.stringify(old),
          operate_result: JSON.stringify(r)
        });
        results.push(r);
      }
    });
  }

  // 删除商品图片
  // 设置deleted_at时间为真
  async removeImage(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.productImage.update({
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
      operate_object_type: OperateObjectType.PRODUCT_IMAGE,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 创建商品销售图片
  async createSellLongImage(data: CreateProductSellImageDto) {
    const { product_id, url, sort } = data;
    const r = await this.prisma.productSellLongImage.create({
      data: {
        product_id,
        url,
        sort
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.CREATE,
      operate_object_type: OperateObjectType.PRODUCT_IMAGE,
      operate_object_id: r.id,
      operate_content: '',
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 更新商品销售图片
  async updateSellLongImage(r: { images: UpdateProductSellImageDto[] }) {
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      const { images } = r;
      const results = [];
      for (let i = 0; i < images.length; i++) {
        const { id, url, product_id, sort, is_delete = false } = images[i];
        if (!id) {
          // 创建新的
          const r = await prisma.productSellLongImage.create({
            data: {
              product_id,
              url,
              sort
            }
          });
          this.log.system_operate({
            success: true,
            operate_type: OperateType.CREATE,
            operate_object_type: OperateObjectType.PRODUCT_IMAGE,
            operate_object_id: r.id,
            operate_content: '',
            operate_result: JSON.stringify(r)
          });
          results.push(r);
          continue;
        }

        const old = await this.findImage(id);

        if (is_delete) {
          const r = await prisma.productSellLongImage.update({
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
            operate_object_type: OperateObjectType.PRODUCT_IMAGE,
            operate_object_id: r.id,
            operate_content: JSON.stringify(old),
            operate_result: JSON.stringify(r)
          });
          results.push(r);
          continue;
        }
        const r = await prisma.productSellLongImage.update({
          where: {
            id: id
          },
          data: {
            ...(url ? { url } : {}),
            ...(sort || sort === 0 ? { sort } : {})
          }
        });
        this.log.system_operate({
          success: true,
          operate_type: OperateType.UPDATE,
          operate_object_type: OperateObjectType.PRODUCT_IMAGE,
          operate_object_id: r.id,
          operate_content: JSON.stringify(old),
          operate_result: JSON.stringify(r)
        });
        results.push(r);
      }
    });
  }

  // 删除商品销售图片
  // 设置deleted_at时间为真
  async removeSellLongImage(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.productSellLongImage.update({
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
      operate_object_type: OperateObjectType.PRODUCT_IMAGE,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 新增规格
  async createSpecification(data: CreateProductSpecificationDto) {
    const {
      product_id,
      product_specifications = [],
      product_specification_combinations = []
      // name,
      // product_specification_values: _product_specification_values = [],
    } = data;
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      // 删除历史规格
      await prisma.productSpecification.updateMany({
        data: {
          deleted_at: new Date()
        },
        where: {
          product_id: product_id
        }
      });
      // 创建商品的规格 batch create
      const specifications = await Promise.all(
        product_specifications.map(async (item) => {
          // 创建商品规格
          const productSpecification = await prisma.productSpecification.create(
            {
              data: {
                product_id: product_id,
                name: item.name
              }
            }
          );
          console.log('productSpecification', productSpecification);
          // 创建商品规格值
          const product_specification_values = await Promise.all(
            item.product_specification_values.map(async (value) => {
              return prisma.productSpecificationValue.create({
                data: {
                  specification_id: productSpecification.id,
                  value: value.value
                }
              });
            })
          );
          console.log(
            'product_specification_values',
            product_specification_values
          );
          return {
            ...productSpecification,
            product_specification_values: product_specification_values
          };
        })
      );
      console.log('specifications', specifications);
      // 创建商品规格组合
      const _combineSpecifications = combineSpecifications(specifications);
      console.log('_combineSpecifications', _combineSpecifications);
      // 查询已存在的组合(不需要了，这种时候，其实已经是删除重建了，因为多了一堆新组合)
      const historyProductSpecificationCombinations =
        await prisma.productSpecificationCombination.findMany({
          where: {
            product_id: product_id,
            deleted_at: null
          }
        });
      // 删除历史组合
      await prisma.productSpecificationCombination.updateMany({
        data: {
          deleted_at: new Date()
        },
        where: {
          product_id: product_id
        }
      });
      // 删除历史组合详情
      await prisma.productSpecificationCombinationDetail.updateMany({
        data: {
          deleted_at: new Date()
        },
        where: {
          combination_id: {
            in: historyProductSpecificationCombinations.map((value) => value.id)
          }
        }
      });
      let productSpecificationCombinations = await Promise.all(
        _combineSpecifications.map(async (item) => {
          const specification_value_ids = item.map(
            (value) => value.specification_value_id
          );
          const specification_value_values = item.map((value) => value.value);
          // 查找历史是否存在(不需要了，这种时候，其实已经是删除重建了，因为多了一堆新组合)
          // const _history = historyProductSpecificationCombinations.find(
          //   (value) => {
          //     return (
          //       value.specification_value_ids ===
          //       specification_value_ids.join(',')
          //     );
          //   }
          // );
          // if (_history) {
          //   return null;
          // }
          // 查找当前组合是否已经存在外部的设定内，用来获取用户设定的数量
          const current_combine = product_specification_combinations.find(
            (value) =>
              value.specification_values.sort().join(',') ===
              specification_value_values.sort().join(',')
          );
          const productSpecificationCombination =
            await prisma.productSpecificationCombination.create({
              data: {
                product_id: product_id,
                specification_value_ids: specification_value_ids.join(','),
                quantity: current_combine?.quantity || 0,
                image: current_combine?.image,
                draw_image: current_combine?.draw_image,
                draw_image_back: current_combine?.draw_image_back,
                price: current_combine?.price
              }
            });
          return {
            ...productSpecificationCombination,
            specification_value_ids
          };
        })
      );
      // 过滤掉null
      productSpecificationCombinations =
        productSpecificationCombinations.filter((item) => item);
      console.log(
        'productSpecificationCombinations',
        productSpecificationCombinations
      );
      // 创建商品组合详情
      const productSpecificationCombinationDetails = await Promise.all(
        productSpecificationCombinations.map(async (item) => {
          const product_specification_combination_details = await Promise.all(
            item.specification_value_ids.map(async (specification_value_id) => {
              return prisma.productSpecificationCombinationDetail.create({
                data: {
                  combination_id: item.id,
                  specification_value_id: specification_value_id
                }
              });
            })
          );
          return {
            ...item,
            product_specification_combination_details
          };
        })
      );
      console.log(
        'productSpecificationCombinationDetails',
        productSpecificationCombinationDetails
      );
      const r = {
        product_specifications: specifications,
        product_specification_combinations: productSpecificationCombinations
      };
      // 记录日志
      this.log.system_operate({
        success: true,
        operate_type: OperateType.UPDATE,
        operate_object_type: OperateObjectType.PRODUCT_SPECIFICATION,
        operate_object_id: product_id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    });
  }

  // 修改规格
  /*async updateSpecification(data: UpdateProductSpecificationDto) {
    const { id, name } = data;
    const old = await this.prisma.productSpecification.findUnique({
      where: {
        id: id
      }
    });
    const r = await this.prisma.productSpecification.update({
      where: {
        id: id
      },
      data: {
        ...(name ? { name } : {})
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.PRODUCT_SPECIFICATION,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }*/

  // 新增规格值
  async createSpecificationValue(data: CreateProductSpecificationValueDto) {
    // 新增规格值，要额外增加处理，要增加规格组合,规格组合详情
    const {
      product_specification_id,
      value,
      product_specification_combinations = []
    } = data;
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      // 查询规格
      const productSpecification = await prisma.productSpecification.findUnique(
        {
          where: {
            id: product_specification_id
          }
        }
      );
      if (!productSpecification) {
        throw new Error('规格不存在');
      }
      const { product_id } = productSpecification;
      // 创建商品规格值
      const product_specification_value =
        await prisma.productSpecificationValue.create({
          data: {
            specification_id: product_specification_id,
            value
          }
        });
      console.log('product_specification_value', product_specification_value);
      // 查询商品规格
      const specifications = await prisma.productSpecification.findMany({
        where: {
          product_id: product_id,
          deleted_at: null
        },
        include: {
          product_specification_values: {
            where: {
              deleted_at: null
            }
          }
        }
      });
      console.log('specifications', specifications);
      // 创建商品规格组合
      const _combineSpecifications = combineSpecifications(specifications);
      console.log('_combineSpecifications', _combineSpecifications);
      // 查询已存在的组合
      const historyProductSpecificationCombinations =
        await prisma.productSpecificationCombination.findMany({
          where: {
            product_id: product_id,
            deleted_at: null
          }
        });
      let productSpecificationCombinations = await Promise.all(
        _combineSpecifications.map(async (item) => {
          const specification_value_ids = item.map(
            (value) => value.specification_value_id
          );
          const specification_value_values = item.map((value) => value.value);
          // 查找历史是否存在
          const _history = historyProductSpecificationCombinations.find(
            (value) => {
              return (
                value.specification_value_ids ===
                specification_value_ids.join(',')
              );
            }
          );
          if (_history) {
            return null;
          }
          // 查找当前组合是否已经存在外部的设定内，用来获取用户设定的数量
          const current_combine = product_specification_combinations.find(
            (value) =>
              value.specification_values.sort().join(',') ===
              specification_value_values.sort().join(',')
          );
          const productSpecificationCombination =
            await prisma.productSpecificationCombination.create({
              data: {
                product_id: product_id,
                specification_value_ids: specification_value_ids.join(','),
                quantity: current_combine?.quantity || 0,
                image: current_combine?.image,
                draw_image: current_combine?.draw_image,
                draw_image_back: current_combine?.draw_image_back,
                price: current_combine?.price
              }
            });
          return {
            ...productSpecificationCombination,
            specification_value_ids
          };
        })
      );
      // 过滤掉null
      productSpecificationCombinations =
        productSpecificationCombinations.filter((item) => item);
      console.log(
        'productSpecificationCombinations',
        productSpecificationCombinations
      );
      // 创建商品组合详情
      const productSpecificationCombinationDetails = await Promise.all(
        productSpecificationCombinations.map(async (item) => {
          const product_specification_combination_details = await Promise.all(
            item.specification_value_ids.map(async (specification_value_id) => {
              return prisma.productSpecificationCombinationDetail.create({
                data: {
                  combination_id: item.id,
                  specification_value_id: specification_value_id
                }
              });
            })
          );
          return {
            ...item,
            product_specification_combination_details
          };
        })
      );
      console.log(
        'productSpecificationCombinationDetails',
        productSpecificationCombinationDetails
      );
      const r = {
        product_specifications: specifications,
        product_specification_combinations: productSpecificationCombinations
      };
      // 记录日志
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.PRODUCT_SPECIFICATION_VALUE,
        operate_object_id: product_specification_value.id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    });
  }

  // 修改规格值
  async updateSpecificationValue(data: UpdateProductSpecificationValueDto) {
    const { id, value } = data;
    const old = await this.prisma.productSpecificationValue.findUnique({
      where: {
        id: id
      }
    });
    const r = await this.prisma.productSpecificationValue.update({
      where: {
        id: id
      },
      data: {
        ...(value ? { value } : {})
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.PRODUCT_SPECIFICATION_VALUE,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 修改规格组合
  async updateSpecificationCombination(
    data: UpdateProductSpecificationCombinationDto
  ) {
    const { id, status, quantity, image, price } = data;
    const old = await this.prisma.productSpecificationCombination.findUnique({
      where: {
        id: id
      }
    });
    const r = await this.prisma.productSpecificationCombination.update({
      where: {
        id: id
      },
      data: {
        ...(status || status === 0 ? { status } : {}),
        ...(quantity || quantity === 0 ? { quantity } : {}),
        ...(image ? { image } : {}),
        ...(price ? { price } : {})
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.DELETE,
      operate_object_type: OperateObjectType.PRODUCT_SPECIFICATION_COMBINATION,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 售出
  async updateSpecificationCombinationQuantity(
    data: UpdateProductSpecificationCombinationDto
  ) {
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      const { id, quantity } = data;
      const old = await prisma.productSpecificationCombination.findUnique({
        where: {
          id: id
        }
      });
      const r = await prisma.productSpecificationCombination.update({
        where: {
          id: id
        },
        data: {
          quantity: old.quantity - quantity
        }
      });
      const _op_type = OperateObjectType.PRODUCT_SPECIFICATION_COMBINATION;
      this.log.system_operate({
        success: true,
        operate_type: OperateType.UPDATE,
        operate_object_type: _op_type,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify(r),
        request: {
          ip: `127.0.0.1`
        }
      });
      console.log('r', r);
      return r;
    });
  }
}
