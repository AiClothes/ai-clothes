import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { QueryProductCategoryDto } from './dto/query-system_operate_log.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
export declare class ProductCategoryController {
    private readonly productCategoryService;
    constructor(productCategoryService: ProductCategoryService);
    create(data: CreateProductCategoryDto): Promise<{
        id: number;
        name: string;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
    findAll(query: QueryProductCategoryDto): Promise<{
        count: number;
        list: ({
            parent: {
                id: number;
                name: string;
                parent_id: number;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date;
            };
            children: {
                id: number;
                name: string;
                parent_id: number;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date;
            }[];
        } & {
            id: number;
            name: string;
            parent_id: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        })[];
    }>;
    findTree(query: object): Promise<({
        children: {
            id: number;
            name: string;
            parent_id: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    } & {
        id: number;
        name: string;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
    update(data: UpdateProductCategoryDto): Promise<{
        id: number;
        name: string;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        parent_id: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
}
