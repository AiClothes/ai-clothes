# AI-Clothes 微信小程序后端项目文档

## 项目简介

本项目为AI服装微信小程序的后端，采用 **NestJS** 框架，TypeScript 编写，支持多模块、微服务架构，涵盖用户、商品、订单、日志等核心业务。

---

## 目录结构

```
ai-clothes/
├── app/                # 业务服务目录（微服务架构，每个子目录为一个服务）
│   ├── user/           # 用户服务
│   ├── product/        # 商品服务
│   ├── order/          # 订单服务
│   ├── log/            # 日志服务
│   └── common/         # 公共服务
├── packages/           # 公共核心包
│   └── core/           # 通用控制器、服务、DTO等
├── pnpm-workspace.yaml # pnpm 多包管理配置
├── package.json        # 根依赖与脚本
└── ...
```

---

## 技术栈

- **Node.js** + **NestJS**（主框架）
- **TypeScript**（类型安全）
- **Prisma**（数据库ORM）
- **Swagger**（自动API文档）
- **Jest**（单元测试）
- **pnpm**（多包管理）

---

## 启动与开发

1. 安装依赖  
   ```bash
   pnpm install
   ```

2. 启动开发环境（以user服务为例）  
   ```bash
   cd app/user
   pnpm start:dev
   ```

3. 访问Swagger文档  
   各服务启动后访问 `http://localhost:<port>/api` 查看接口文档。

---

## 主要服务与API说明

### 1. 用户服务（user）

- 路径：`/user`
- 主要接口：
  - `POST /user/create` 创建用户
  - `POST /user/find-all` 分页查询用户
  - `POST /user/find-one` 查询单个用户
  - `POST /user/update` 更新用户
  - `POST /user/remove` 删除用户
  - `POST /user/bind-role` 绑定角色
  - `POST /user/unbind-role` 解绑角色
  - `POST /user/find-front-user` 查询前端用户
  - `POST /user/find-front-all` 查询前端用户列表
  - `POST /user/find-front-all-count` 前端用户总数
  - `POST /user/update-front-user` 更新前端用户
  - `POST /user/wx-update-front-user` 微信端更新用户（需带token）
  - `POST /user/wx-profile` 获取微信端用户信息

- 典型请求参数（以创建用户为例）：
  ```json
  {
    "username": "string",
    "password": "string"
    // ... 其他字段
  }
  ```

---

### 2. 商品服务（product）

- 路径：`/product`
- 主要接口：
  - `POST /product/create` 创建商品
  - `POST /product/find-all` 分页查询商品
  - `POST /product/find-simple-all` 查询简要商品列表
  - `POST /product/find-one` 查询单个商品
  - `POST /product/update` 更新商品
  - `POST /product/remove` 删除商品
  - `POST /product/create-image` 创建商品图片
  - `POST /product/update-image` 更新商品图片
  - `POST /product/delete-image` 删除商品图片
  - `POST /product/create-sell-image` 创建商品销售长图
  - `POST /product/update-sell-image` 更新商品销售长图
  - `POST /product/delete-sell-image` 删除商品销售长图
  - `POST /product/create-specification` 创建商品规格
  - `POST /product/create-specification-value` 创建规格值
  - `POST /product/update-specification-value` 更新规格值
  - `POST /product/update-specification-combination` 更新规格组合
  - `POST /product/find-simple-all-wx` 微信端简要商品列表
  - `POST /product/find-all-wx` 微信端商品列表
  - `POST /product/find-one-wx` 微信端商品详情

- 典型请求参数（以创建商品为例）：
  ```json
  {
    "name": "string",
    "price": 100
    // ... 其他字段
  }
  ```

---

### 3. 订单服务（order）

- 路径：`/order`
- 主要接口：
  - `POST /order/create` 创建订单
  - `POST /order/create-wx` 微信端创建订单
  - `POST /order/find-all` 分页查询订单
  - `POST /order/find-all-count` 查询订单总数
  - `POST /order/find-one` 查询单个订单
  - `POST /order/update` 更新订单
  - `POST /order/remove` 删除订单
  - `POST /order/total-sales` 查询总销售额
  - `POST /order/order-count-by-date` 按日期统计订单量
  - `POST /order/wxpay` 微信支付下单
  - `POST /order/wxpay_callback` 微信支付回调

- 典型请求参数（以创建订单为例）：
  ```json
  {
    "user_id": 1,
    "product_id": 2,
    "quantity": 1
    // ... 其他字段
  }
  ```

---

### 4. 日志服务（log）

- 路径：`/system-operate-log`
- 主要接口：
  - `POST /system-operate-log/create` 创建操作日志
  - `POST /system-operate-log/find-all` 查询日志列表
  - `POST /system-operate-log/find-one` 查询单条日志
  - `POST /system-operate-log/update` 更新日志
  - `POST /system-operate-log/remove` 删除日志

---

## 通用API规范

- 所有接口均返回统一格式：
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {...}
  }
  ```
- 错误时返回：
  ```json
  {
    "message": "错误信息",
    "errors": {...}
  }
  ```
- 参数校验失败或业务异常时，HTTP状态码为400。

---

## 认证与权限

- 微信端接口需带token（如`@WX()`装饰器标记的接口）。
- 后台管理接口可结合JWT等方式做权限控制。

---

## 数据库与ORM

- 使用Prisma进行数据库操作，模型定义见各服务下的`prisma`目录。

---

## 开发建议

- 新增业务建议以微服务方式扩展，复用`packages/core`中的基础控制器和服务。
- 所有DTO（数据传输对象）均在各模块`dto`目录下定义，便于前后端对接。
- 推荐通过Swagger文档查看所有接口的详细参数和返回值说明。

---

## 其他说明

- 微服务间通过消息队列（如`@MessagePattern`、`@EventPattern`）进行通信，具体见各controller实现。
- 日志、权限、角色、支付等功能均有独立模块，详见源码。
- 如需更详细的API参数说明或某个模块的接口文档，请告知具体模块或接口名称。 