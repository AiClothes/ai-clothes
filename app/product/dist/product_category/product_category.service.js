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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const log_service_1 = require("../log/log.service");
const core_1 = require("@one-server/core");
let ProductCategoryService = class ProductCategoryService {
    constructor(prisma, log) {
        this.prisma = prisma;
        this.log = log;
    }
    async create(data) {
        const r = await this.prisma.productCategory.create({
            data: {
                ...data
            }
        });
        this.log.system_operate({
            success: true,
            operate_type: core_1.OperateType.CREATE,
            operate_object_type: core_1.OperateObjectType.PRODUCT_CATEGORY,
            operate_object_id: r.id,
            operate_content: '',
            operate_result: JSON.stringify(r)
        });
        return r;
    }
    findAll(query) {
        const { current = 1, page_size = 20, name, parent_id } = query;
        return this.prisma.productCategory.findMany({
            where: {
                deleted_at: null,
                name: {
                    contains: name
                },
                ...(parent_id ? { parent_id: parent_id } : {})
            },
            include: {
                parent: true,
                children: true
            }
        });
    }
    count(query) {
        const { name, parent_id } = query;
        return this.prisma.productCategory.count({
            where: {
                deleted_at: null,
                name: {
                    contains: name
                },
                ...(parent_id ? { parent_id: parent_id } : {})
            }
        });
    }
    findTree(query) {
        return this.prisma.productCategory.findMany({
            where: {
                deleted_at: null,
                parent_id: null
            },
            include: {
                children: true
            }
        });
    }
    findOne(id) {
        return this.prisma.productCategory.findUnique({
            where: {
                id: id
            }
        });
    }
    async update(data) {
        const old = await this.findOne(data.id);
        const r = await this.prisma.productCategory.update({
            where: {
                id: data.id
            },
            data: data
        });
        this.log.system_operate({
            success: true,
            operate_type: core_1.OperateType.UPDATE,
            operate_object_type: core_1.OperateObjectType.PRODUCT_CATEGORY,
            operate_object_id: r.id,
            operate_content: JSON.stringify(old),
            operate_result: JSON.stringify(r)
        });
        return r;
    }
    async remove(id) {
        const old = await this.findOne(id);
        const r = await this.prisma.productCategory.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            }
        });
        this.log.system_operate({
            success: true,
            operate_type: core_1.OperateType.DELETE,
            operate_object_type: core_1.OperateObjectType.PRODUCT_CATEGORY,
            operate_object_id: r.id,
            operate_content: JSON.stringify(old),
            operate_result: JSON.stringify(r)
        });
        return r;
    }
};
exports.ProductCategoryService = ProductCategoryService;
exports.ProductCategoryService = ProductCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        log_service_1.LogService])
], ProductCategoryService);
//# sourceMappingURL=product_category.service.js.map