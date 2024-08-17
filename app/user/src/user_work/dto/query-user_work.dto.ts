import { WorkCreateType } from '../../common/enum/WorkCreateType';
import { WorkType } from '../../common/enum/WorkType';

export class QueryUserWorkDto {
  // 基础分页
  current?: number;
  page_size?: number;

  // 查询条件
  // 是否是收藏的
  user_id?: number;
  // 名称
  name?: string;
  // 作品来源
  source?: WorkType;
  // 创作类型
  create_type?: WorkCreateType[];
  // 是否是删除的
  is_deleted?: boolean;
  // 是否是收藏的
  is_collect?: boolean;
}
