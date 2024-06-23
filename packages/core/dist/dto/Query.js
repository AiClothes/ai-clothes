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
exports.QueryDetailDto = exports.QueryCursorListDto = exports.QueryListDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class QueryListDto {
}
exports.QueryListDto = QueryListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '当前页数',
        example: 1,
        default: 1,
        minimum: 1,
        type: Number
    }),
    (0, class_validator_1.IsInt)({ message: '当前页数必须为整数' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryListDto.prototype, "current", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '每页数量',
        example: 10,
        default: 10,
        minimum: 1,
        type: Number
    }),
    (0, class_validator_1.IsInt)({ message: '每页数量必须为整数' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryListDto.prototype, "page_size", void 0);
class QueryCursorListDto {
}
exports.QueryCursorListDto = QueryCursorListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '游标 默认为id的游标',
        example: 1,
        default: 1,
        minimum: 1,
        type: Number
    }),
    (0, class_validator_1.IsInt)({ message: '固定游标必须是数据库的id，且为数字自增的内容查询' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], QueryCursorListDto.prototype, "cursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '每页数量',
        example: 10,
        default: 10,
        minimum: 1,
        type: Number
    }),
    (0, class_validator_1.IsInt)({ message: '每页数量必须为整数' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryCursorListDto.prototype, "page_size", void 0);
class QueryDetailDto {
}
exports.QueryDetailDto = QueryDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'id',
        example: 1,
        default: 1,
        minimum: 1,
        type: Number
    }),
    (0, class_validator_1.IsInt)({ message: '固定详情查询必须是数据库的id，且为数字自增的内容查询' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryDetailDto.prototype, "id", void 0);
//# sourceMappingURL=Query.js.map