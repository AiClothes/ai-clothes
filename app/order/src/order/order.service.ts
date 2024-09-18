import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { MICROSERVICE, OperateObjectType, OperateType } from '@one-server/core';
import { ClientProxy } from '@nestjs/microservices';
import { QueryOrderDto } from './dto/query-order.dto';
import { Prisma } from '@prisma/client';
import WxPay from 'wechatpay-node-v3';
import * as dayjs from 'dayjs';

import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private log: LogService,
    @Inject(MICROSERVICE.PRODUCT_SERVICE) private productClient: ClientProxy,
    @Inject(MICROSERVICE.USER_SERVICE) private userClient: ClientProxy,
    @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay
  ) {}

  async create(data: CreateOrderDto) {
    const {
      order_no,
      user_id,
      user_info,
      // status,
      address,
      consignee,
      consignee_phone,
      remark,
      payment_time,
      delivery_time,
      sign_time,
      cancel_time,
      complete_time,
      payment_id,
      logistic_id,
      trades,
      order_products
    } = data;
    if (!order_products || order_products.length === 0) {
      throw new Error('下单时必须含有商品！');
    }
    let _real_user_info = null;
    try {
      _real_user_info = JSON.parse(user_info);
    } catch (e) {
      throw new Error('用户信息不存在！');
    }
    if (!_real_user_info || !_real_user_info.id) {
      throw new Error('用户信息不存在!!!');
    }
    console.log('order', data);
    // 使用事务 交互式创建商品
    const order_create = await this.prisma.$transaction(async (prisma) => {
      // 创建订单
      const order = await prisma.order.create({
        data: {
          order_no,
          user_id,
          user_info,
          status: trades && trades.length > 0 ? 1 : 0,
          address,
          consignee,
          consignee_phone,
          remark,
          payment_time: trades && trades.length > 0 ? new Date() : null,
          delivery_time,
          sign_time,
          cancel_time,
          complete_time,
          payment_id,
          logistic_id
        }
      });
      console.log('order', order);
      // 查询订单信息
      const products = await Promise.all(
        order_products.map(async (item) => {
          const productDataObservable = this.productClient.send(
            'find_product_by_id',
            item.product_id
          );
          // let productData: any = null;
          // try {
          // console.log('productDataObservable', productDataObservable);
          const productData: any = await lastValueFrom(productDataObservable);
          // console.log('productData', productData);
          // } catch (e) {
          //   console.log('productData error', e);
          // }
          if (!productData) {
            throw new Error('商品信息不存在！');
          }
          return productData;
        })
      );
      if (products.length !== order_products.length) {
        throw new Error('商品信息不正确！');
      }
      // 保存交易凭证
      const _trades = await Promise.all(
        (trades || []).map(async (trade) => {
          return prisma.orderTrade.create({
            data: {
              order_id: order.id,
              trade_url: trade.trade_url
            }
          });
        })
      );
      // 创建订单商品信息
      const _products = await Promise.all(
        order_products.map(async (item) => {
          const { product_num, product_id, work_info } = item;
          // 找到对应的产品
          const product = products.find((p) => p.id === product_id);
          const { price, product_specification_combinations } = product;
          const target_psc = product_specification_combinations.find(
            (psc) => psc.id === item.specification_combination_id
          );
          console.log('target_psc', target_psc);
          if (!target_psc) {
            throw new Error('商品规格信息不正确！');
          }
          if (target_psc.quantity < product_num) {
            throw new Error('商品库存不足！');
          }
          // 不做校验
          // if (target_psc.status !== 1) {
          //   throw new Error('商品规格已下架！');
          // }
          // 减少库存
          const _qObservable: any = this.productClient.send(
            'update_product_quantity',
            {
              id: item.specification_combination_id,
              quantity: product_num
            }
          );
          const _q: any = await lastValueFrom(_qObservable);
          console.log('_q', _q);
          if (!_q) {
            throw new Error('商品库存更新失败！');
          }
          const {
            price: psc_price,
            specification_value_ids,
            product_specification_combination_details = []
          } = target_psc || {};
          const _price = psc_price || price;
          console.log('target_psc', target_psc);
          console.log('_price', _price);

          // 如果是金币，则给用户加金币
          if (product_id === 1) {
            console.log('确实是金币更新', _price * item.product_num);
            // 给用户添加金币
            const uug: any = this.userClient.send('update_user_gold', {
              user_id: _real_user_info.id,
              // 10 为了放大10倍 1:1000
              gold: _price * item.product_num * 10
            });
            const _q: any = await lastValueFrom(uug);
            console.log('_q', _q);
            if (!uug) {
              throw new Error('用户金币更新失败！');
            }
          }

          try {
            return prisma.orderProduct.create({
              data: {
                order_id: order.id,
                product_id: item.product_id,
                product_name: item.product_name,
                product_image: item.product_image,
                specification_combination_id: item.specification_combination_id,
                specification_value_id: specification_value_ids,
                specification_value_name:
                  product_specification_combination_details
                    .map((r) => {
                      const { specification_value } = r;
                      const { value } = specification_value;
                      return value;
                    })
                    .join(','),
                product_price: _price,
                product_num: item.product_num,
                product_total_price: _price * item.product_num,
                ...(item.final_total_price
                  ? { final_total_price: item.final_total_price }
                  : { final_total_price: _price * item.product_num }),
                work_info: work_info
              }
            });
          } catch (e) {
            console.log('create orderProduct error', e);
          }
        })
      );
      // 通知
      console.log('_products', _products);
      const r = {
        ...order,
        order_trades: _trades,
        order_products: _products
      };
      // 记录日志
      this.log.system_operate({
        success: true,
        operate_type: OperateType.CREATE,
        operate_object_type: OperateObjectType.ORDER,
        operate_object_id: r.id,
        operate_content: '',
        operate_result: JSON.stringify(r)
      });
      return r;
    });

    return order_create;
  }

  // 查询订单列表
  async findAll(query: QueryOrderDto) {
    const { current = 1, page_size = 20, order_no, user_id, status } = query;
    const skip = (current - 1) * page_size;
    const take = page_size;
    return this.prisma.order.findMany({
      where: {
        deleted_at: null,
        ...(order_no ? { order_no } : {}),
        ...(user_id ? { user_id } : {}),
        ...(status ? { status } : {})
      },
      include: {
        order_products: true,
        payment: true,
        logistic: true,
        trades: true
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: skip,
      take: take
    });
  }

  // 数量查询
  async count(query: QueryOrderDto) {
    const { order_no, user_id, status } = query;
    return this.prisma.order.count({
      where: {
        deleted_at: null,
        ...(order_no ? { order_no } : {}),
        ...(user_id ? { user_id } : {}),
        ...(status ? { status } : {})
      }
    });
  }

  // 查询商品详情
  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id: id
      },
      include: {
        order_products: true,
        payment: true,
        logistic: true
      }
    });
  }

  async update(data: UpdateOrderDto) {
    // 订单商品不修改，必须创建新订单或者取消订单
    const {
      id,
      address,
      consignee,
      consignee_phone,
      logistic_id,
      remark,
      status,
      payment_id,
      trades,
      cancel_reason,
      refund_reason,
      return_reason
    } = data;
    // 使用事务 交互式创建商品
    return this.prisma.$transaction(async (prisma) => {
      const old = await this.findOne(id);
      if (!old) {
        throw new Error('订单不存在！');
      }
      // 更新订单状态
      const _update: any = {
        ...(status ? { status } : {}),
        ...(address ? { address: address } : {}),
        ...(consignee ? { consignee: consignee } : {}),
        ...(consignee_phone ? { consignee_phone: consignee_phone } : {}),
        ...(remark ? { remark: remark } : {}),
        ...(logistic_id ? { logistic_id: logistic_id } : {})
      };
      const other: any = {};
      if (_update.status === 1) {
        _update.payment_time = new Date();
        _update.payment_id = payment_id;
        if (trades && trades.length > 0) {
          // 保存交易凭证
          other.trades = await Promise.all(
            trades.map(async (trade) => {
              return prisma.orderTrade.create({
                data: {
                  order_id: id,
                  trade_url: trade.trade_url
                }
              });
            })
          );
        }
      }
      if (_update.status === 2) {
        _update.delivery_time = new Date();
      }
      if (_update.status === 3) {
        _update.sign_time = new Date();
      }
      if (_update.status === 4) {
        _update.cancel_time = new Date();
        if (!cancel_reason) {
          throw new Error('取消订单必须填写取消原因！');
        }
        _update.cancel_reason = cancel_reason;
        // 通知库存退回
      }
      if (_update.status === 5) {
        _update.return_time = new Date();
        if (!return_reason) {
          throw new Error('退货订单必须填写退货原因！');
        }
        _update.return_reason = return_reason;
        // 通知库存退回
      }
      if (_update.status === 6) {
        _update.refund_time = new Date();
        if (!refund_reason) {
          throw new Error('退款订单必须填写退款原因！');
        }
        _update.refund_reason = refund_reason;
        // 通知库存退回
      }
      if (_update.status === 7) {
        _update.return_time = new Date();
        _update.refund_time = new Date();
        if (!return_reason) {
          throw new Error('退货退款订单必须填写退货原因！');
        }
        _update.return_reason = return_reason;
        if (!refund_reason) {
          throw new Error('退货退款订单必须填写退款原因！');
        }
        _update.refund_reason = refund_reason;
        // 通知库存退回
      }
      if (_update.status === 100) {
        _update.complete_time = new Date();
      }
      const r = await prisma.order.update({
        where: {
          id: id
        },
        data: {
          ..._update
        }
      });
      this.log.system_operate({
        success: true,
        operate_type: OperateType.UPDATE,
        operate_object_type: OperateObjectType.ORDER,
        operate_object_id: r.id,
        operate_content: JSON.stringify(old),
        operate_result: JSON.stringify({ ...r, ...other })
      });
      return r;
    });
  }

  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.order.update({
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
      operate_object_type: OperateObjectType.ORDER,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 计算总销售额
  async totalSales() {
    return this.prisma
      .$queryRaw`SELECT SUM(product_total_price) as total_sales FROM \`order_products\` WHERE deleted_at IS NULL`;
  }

  // 按日期查询订单数量[范围内的每日订单量]
  async countByDateRange(startDate: string, endDate: string) {
    const sql = Prisma.sql`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as order_count 
      FROM 
        orders 
      WHERE 
        created_at BETWEEN ${new Date(startDate)} AND ${new Date(endDate)} 
        AND deleted_at IS NULL 
      GROUP BY 
        DATE(created_at)
      ORDER BY 
        DATE(created_at) ASC
    `;
    const result: any[] = await this.prisma.$queryRaw(sql);

    // 生成日期范围内的所有日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d).toISOString().split('T')[0]);
    }

    // 将查询结果与日期范围合并
    const resultMap = new Map(
      result.map((item) => [item.date, item.order_count])
    );
    const finalResult = dateRange.map((date) => ({
      date,
      order_count: resultMap.get(date) || 0
    }));

    return finalResult;
  }

  // 创建微信订单
  async createWxOrder(data: any) {
    const {
      // 用户id
      userId,
      // 支付者
      openid,
      // 订单号
      orderNumber,
      // product_id
      productId,
      // 总费用
      // totalFee,
      // 金币描述
      description,
      // 1-6
      specification_combination_id,
      self
    } = data;

    // 读取specification_combination_id

    const totalFee =
      specification_combination_id === 6
        ? Number(self)
        : specification_combination_id * 100;

    console.log('createWxOrder', totalFee, data);
    // // 订单号
    // // 获取当前时间戳
    // const timestamp = dayjs().format('YYYYMMDDHHmmss');
    // // 生成一个 100000 到 999999 的随机数
    // const randomNumber =
    //   Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // // 组合成订单号
    // const orderNumber = `${timestamp}${randomNumber}`;
    try {
      const nonce_str = Math.random().toString(36).substr(2, 15); // 随机字符串
      const timestamp = parseInt(+new Date() / 1000 + '').toString(); // 时间戳 秒
      const url = '/v3/pay/transactions/jsapi';

      const params = {
        notify_url: 'https://api.chishenai.cn/api-order/order/wxpay_callback',
        description: `金币充值-小程序支付-${description}`,
        out_trade_no: orderNumber,
        amount: {
          // 实际金额是分，所以要乘以100
          total: totalFee * 100,
          currency: 'CNY'
        },
        payer: {
          openid
        }
      };

      console.log('params', params);

      // // 生成小程序支付需要的字段
      // const signature = this.wxPay.getSignature(
      //   'POST',
      //   nonce_str,
      //   timestamp,
      //   url,
      //   params
      // );
      // // 获取头部authorization 参数
      // const authorization = this.wxPay.getAuthorization(
      //   nonce_str,
      //   timestamp,
      //   signature
      // );

      const result = await this.wxPay.transactions_jsapi(params);
      const { data, status } = result || {};

      console.log('result', result);
      if (status !== 200) {
        throw new Error(`订单创建失败！`);
      }

      const { paySign } = data;
      if (!paySign) {
        throw new Error(`订单创建失败！`);
      }

      return {
        ...data
      };
    } catch (error) {
      throw new Error(`创建订单失败: ${error.message}`);
    }
  }
}
