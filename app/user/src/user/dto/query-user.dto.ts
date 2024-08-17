export class QueryUserDto {
  // 基础分页
  current?: number;
  page_size?: number;

  email?: string;
  phone?: string;
  nickname?: string;
}
