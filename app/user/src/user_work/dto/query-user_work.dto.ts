import { WorkCreateType } from '../../common/enum/WorkCreateType';

export class QueryUserWorkDto {
  // 基础分页
  current?: number;
  page_size?: number;

  // 查询条件
  // 是否是收藏的
  is_collect?: boolean;
  create_type?: WorkCreateType[];
}
