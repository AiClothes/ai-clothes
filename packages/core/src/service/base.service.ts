export class BaseService {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  async list(query: { current: number; page_size: number }) {
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

  async cursor_list(query: { cursor: number; page_size: number }) {
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

  async detail(data: { id: number }) {
    return this.model.findFirst({
      where: {
        id: data.id
      }
    });
  }

  async create(data: { [key: string]: any }) {
    return this.model.create({
      data: {
        ...data
      }
    });
  }

  async update(data: { id: number; [key: string]: any }) {
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

  async delete(data: { id: number }) {
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
