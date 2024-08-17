import { PrismaService } from '../prisma/prisma.service';
import { LogService } from '../log/log.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { QueryProductCategoryDto } from './dto/query-system_operate_log.dto';
export declare class ProductCategoryService {
    private prisma;
    private log;
    constructor(prisma: PrismaService, log: LogService);
    create(data: CreateProductCategoryDto): Promise<{
        id: number;
        name: string;
        sort: number;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
    findAll(query: QueryProductCategoryDto): import(".prisma/client").Prisma.PrismaPromise<({
        parent: {
            id: number;
            name: string;
            sort: number;
            parent_id: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        };
        children: {
            id: number;
            name: string;
            sort: number;
            parent_id: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    } & {
        id: number;
        name: string;
        sort: number;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    })[]>;
    count(query: QueryProductCategoryDto): import(".prisma/client").Prisma.PrismaPromise<number>;
    findTree(query: object): import(".prisma/client").Prisma.PrismaPromise<({
        children: {
            id: number;
            name: string;
            sort: number;
            parent_id: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    } & {
        id: number;
        name: string;
        sort: number;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ProductCategoryClient<{
        id: number;
        name: string;
        sort: number;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }, null, import(".prisma/client/runtime/library").DefaultArgs>;
    update(data: UpdateProductCategoryDto): Promise<{
        id: number;
        name: string;
        sort: number;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        sort: number;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
}
