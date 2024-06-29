"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFF_JWT = exports.IS_OFF_JWT = void 0;
const common_1 = require("@nestjs/common");
exports.IS_OFF_JWT = 'is_off_jwt';
const OFF_JWT = () => (0, common_1.SetMetadata)(exports.IS_OFF_JWT, true);
exports.OFF_JWT = OFF_JWT;
//# sourceMappingURL=off_jwt.dectory.js.map