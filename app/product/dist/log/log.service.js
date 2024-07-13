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
exports.LogService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@one-server/core");
const microservices_1 = require("@nestjs/microservices");
const context_service_1 = require("../context/context.service");
let LogService = class LogService {
    constructor(logClient, requestContextService) {
        this.logClient = logClient;
        this.requestContextService = requestContextService;
    }
    system_operate(data) {
        const { success, operate_type, operate_object_type, operate_object_id, operate_content, operate_result, request: selfRequest } = data;
        const request = this.requestContextService.getRequest();
        const { ip, method, url, user } = request || selfRequest || {};
        console.log('system_operate', ip, method, url, user, JSON.stringify(data));
        this.logClient.emit('system_operate_log_created', {
            operate_user: 1,
            operate_type: operate_type,
            operate_object_id: operate_object_id,
            operate_object_type: operate_object_type,
            operate_content: operate_content,
            operate_result: operate_result,
            operate_ip: ip,
            operate_success: success
        });
    }
};
exports.LogService = LogService;
exports.LogService = LogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.MICROSERVICE.LOG_SERVICE)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        context_service_1.ContextService])
], LogService);
//# sourceMappingURL=log.service.js.map