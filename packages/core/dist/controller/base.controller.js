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
exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
class BaseController {
    constructor(service) {
        this.service = service;
    }
    async list(query) {
        const { current, page_size } = query;
        const list = await this.service.list({
            current,
            page_size
        });
        const count = await this.service.count();
        return {
            list: list,
            count: count
        };
    }
    async cursor_list(query) {
        const { cursor, page_size } = query;
        const list = await this.service.cursor_list({
            cursor,
            page_size
        });
        return {
            list: list
        };
    }
    async count() {
        const count = await this.service.count();
        return {
            count: count
        };
    }
    async detail(query) {
        const detail = await this.service.detail({
            id: query.id
        });
        return {
            detail: detail
        };
    }
    async create(data) {
        try {
            const r = await this.service.create(data);
            return r;
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(data) {
        try {
            const r = await this.service.update(data);
            return r;
        }
        catch (e) {
            throw new common_1.HttpException({ message: e.message, errors: e }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
}
exports.BaseController = BaseController;
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryListDto]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('cursor_list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryCursorListDto]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "cursor_list", null);
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "count", null);
__decorate([
    (0, common_1.Get)('detail'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryDetailDto]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "update", null);
//# sourceMappingURL=base.controller.js.map