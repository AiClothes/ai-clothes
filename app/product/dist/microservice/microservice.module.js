"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroservicesModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const core_1 = require("@one-server/core");
let MicroservicesModule = class MicroservicesModule {
};
exports.MicroservicesModule = MicroservicesModule;
exports.MicroservicesModule = MicroservicesModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: core_1.MICROSERVICE.USER_SERVICE,
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: '127.0.0.1',
                        port: core_1.MICROSERVICE_PORTS.USER_SERVICE
                    }
                },
                {
                    name: core_1.MICROSERVICE.LOG_SERVICE,
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: '127.0.0.1',
                        port: core_1.MICROSERVICE_PORTS.LOG_SERVICE
                    }
                },
                {
                    name: core_1.MICROSERVICE.ORDER_SERVICE,
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: '127.0.0.1',
                        port: core_1.MICROSERVICE_PORTS.ORDER_SERVICE
                    }
                }
            ])
        ],
        exports: [microservices_1.ClientsModule]
    })
], MicroservicesModule);
//# sourceMappingURL=microservice.module.js.map