"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(model) {
        this.model = model;
    }
    async list(query) {
        return this.model.findMany({
            where: {
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc'
            },
            skip: (query.current - 1) * query.page_size,
            take: query.page_size
        });
    }
    async cursor_list(query) {
        return this.model.findMany({
            where: {
                deleted_at: null
            },
            cursor: {
                id: query.cursor
            },
            orderBy: {
                created_at: 'desc'
            },
            skip: 1,
            take: query.page_size
        });
    }
    async count() {
        return this.model.count({
            where: {
                deleted_at: null
            }
        });
    }
    async detail(data) {
        return this.model.findFirst({
            where: {
                id: data.id
            }
        });
    }
    async create(data) {
        return this.model.create({
            data: {
                ...data
            }
        });
    }
    async update(data) {
        const { id, ...rest } = data;
        return this.model.update({
            where: {
                id: id
            },
            data: {
                ...rest
            }
        });
    }
    async delete(data) {
        return this.model.update({
            where: {
                id: data.id
            },
            data: {
                deleted_at: new Date()
            }
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map