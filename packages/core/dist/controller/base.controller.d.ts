import { QueryCursorListDto, QueryDetailDto, QueryListDto } from '../dto';
export declare class BaseController<CreateDTO, UpdateDTO> {
    service: any;
    constructor(service: any);
    list(query: QueryListDto): Promise<{
        list: any;
        count: any;
    }>;
    cursor_list(query: QueryCursorListDto): Promise<{
        list: any;
    }>;
    count(): Promise<{
        count: any;
    }>;
    detail(query: QueryDetailDto): Promise<{
        detail: any;
    }>;
    create(data: CreateDTO): Promise<any>;
    update(data: UpdateDTO): Promise<any>;
}
