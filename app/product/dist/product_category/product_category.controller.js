"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryController = void 0;
const common_1 = require("@nestjs/common");
const product_category_service_1 = require("./product_category.service");
const create_product_category_dto_1 = require("./dto/create-product_category.dto");
const query_system_operate_log_dto_1 = require("./dto/query-system_operate_log.dto");
const update_product_category_dto_1 = require("./dto/update-product_category.dto");
const core_1 = require("@one-server/core");
let ProductCategoryController = class ProductCategoryController {
    constructor(productCategoryService) {
        this.productCategoryService = productCategoryService;
    }
    async create(data) {
        try {
            return await this.productCategoryService.create(data);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query) {
        try {
            const count = await this.productCategoryService.count({
                is_virtual_goods: [0, 1],
                ...query
            });
            const list = await this.productCategoryService.findAll({
                is_virtual_goods: [0, 1],
                ...query
            });
            return { count, list };
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findTree(query) {
        try {
            return await this.productCategoryService.findTree(query);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            return await this.productCategoryService.findOne(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(data) {
        try {
            return await this.productCategoryService.update(data);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            return await this.productCategoryService.remove(id);
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllWX(query) {
        try {
            const count = await this.productCategoryService.count(query);
            const list = await this.productCategoryService.findAll(query);
            return { count, list };
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ProductCategoryController = ProductCategoryController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_category_dto_1.CreateProductCategoryDto]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('find-all'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_system_operate_log_dto_1.QueryProductCategoryDto]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('find-tree'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "findTree", null);
__decorate([
    (0, common_1.Post)('find-one'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_category_dto_1.UpdateProductCategoryDto]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('remove'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "remove", null);
__decorate([
    (0, core_1.OFF_JWT)(),
    (0, common_1.Post)('wx-find-all'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_system_operate_log_dto_1.QueryProductCategoryDto]),
    __metadata("design:returntype", Promise)
], ProductCategoryController.prototype, "findAllWX", null);
exports.ProductCategoryController = ProductCategoryController = __decorate([
    (0, common_1.Controller)('product-category'),
    __metadata("design:paramtypes", [product_category_service_1.ProductCategoryService])
], ProductCategoryController);
//# sourceMappingURL=product_category.controller.js.map