"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_1 = require("@one-server/core");
const core_2 = require("@nestjs/core");
const ContextMiddleWare_1 = require("./common/middleware/ContextMiddleWare");
const prisma_module_1 = require("./prisma/prisma.module");
const log_module_1 = require("./log/log.module");
const context_module_1 = require("./context/context.module");
const product_category_module_1 = require("./product_category/product_category.module");
const microservice_module_1 = require("./microservice/microservice.module");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(ContextMiddleWare_1.ContextMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservice_module_1.MicroservicesModule,
            prisma_module_1.PrismaModule,
            log_module_1.LogModule,
            context_module_1.ContextModule,
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '24h'
                }
            }),
            product_category_module_1.ProductCategoryModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_2.APP_INTERCEPTOR,
                useClass: core_1.TransformInterceptor
            },
            {
                provide: core_2.APP_GUARD,
                useClass: core_1.AuthGuard
            }
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map