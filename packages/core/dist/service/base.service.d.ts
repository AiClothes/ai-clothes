export declare class BaseService {
    model: any;
    constructor(model: any);
    list(query: {
        current: number;
        page_size: number;
    }): Promise<any>;
    cursor_list(query: {
        cursor: number;
        page_size: number;
    }): Promise<any>;
    count(): Promise<any>;
    detail(data: {
        id: number;
    }): Promise<any>;
    create(data: {
        [key: string]: any;
    }): Promise<any>;
    update(data: {
        id: number;
        [key: string]: any;
    }): Promise<any>;
    delete(data: {
        id: number;
    }): Promise<any>;
}
