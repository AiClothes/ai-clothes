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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const core_1 = require("@one-server/core");
let AppController = class AppController {
    constructor(appService, logClient) {
        this.appService = appService;
        this.logClient = logClient;
    }
    getHello() {
        return this.appService.getHello();
    }
    sum(numArr) {
        console.log('sum log');
        return numArr.reduce((total, item) => total + item, 0);
    }
    calculate() {
        console.log('product_to_log');
        return this.logClient.send('product_to_log', [1, 2, 3, 4, 5, 6]);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, microservices_1.MessagePattern)('sum'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Number)
], AppController.prototype, "sum", null);
__decorate([
    (0, common_1.Get)('product_to_log'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "calculate", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, common_1.Inject)(core_1.MICROSERVICE.LOG_SERVICE)),
    __metadata("design:paramtypes", [app_service_1.AppService,
        microservices_1.ClientProxy])
], AppController);
//# sourceMappingURL=app.controller.js.map