import { IsOptional, IsString, IsUrl } from 'class-validator';

// 定义风格大类
export enum MajorStyle {
  UNLIMITED = '不限定风格',
  ART_PAINTING = '艺术绘画类',
  GAME_ANIME = '游戏动漫类',
  PROFESSIONAL_REALISM = '专业写实类'
}

// 定义每一大类中的风格细项及对应编号
export interface StyleDetails {
  [key: string]: {
    [key: string]: string;
  };
}

export const styleDetails: StyleDetails = {
  [MajorStyle.UNLIMITED]: {
    不限定风格: '000'
  },
  [MajorStyle.ART_PAINTING]: {
    水墨画: '101',
    概念艺术: '102',
    油画1: '103',
    '油画2（梵高）': '118',
    水彩画: '104',
    像素画: '105',
    厚涂风格: '106',
    插图: '107',
    剪纸风格: '108',
    '印象派1（莫奈）': '109',
    印象派2: '119',
    '2.5D': '110',
    古典肖像画: '111',
    黑白素描画: '112',
    赛博朋克: '113',
    科幻风格: '114',
    暗黑风格: '115',
    '3D': '116',
    蒸汽波: '117'
  },
  [MajorStyle.GAME_ANIME]: {
    日系动漫: '201',
    怪兽风格: '202',
    唯美古风: '203',
    复古动漫: '204',
    游戏卡通手绘: '301'
  },
  [MajorStyle.PROFESSIONAL_REALISM]: {
    通用写实风格: '401'
  }
};

// 定义类型别名用于描述风格项
export type StyleItem = {
  major: MajorStyle;
  detail: string;
  code: string;
};

export class AIDrawDto {
  // 绘图的提示词
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  ng_text?: string;

  @IsOptional()
  @IsString()
  major_style?: MajorStyle;

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsString()
  resolution_ratio?: string;
}
