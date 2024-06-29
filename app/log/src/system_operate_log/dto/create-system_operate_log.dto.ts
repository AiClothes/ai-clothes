import { IsNotEmpty } from 'class-validator';
import { OperateObjectType, OperateType } from '@one-server/core';

// enum OperateType {
//   CREATE
//   UPDATE
//   DELETE
// }
//
// enum OperateObjectType {
//   USER
//   PRODUCT
//   ORDER
//   COMMENT
// }
//
// // 程序操作日志【这个是程序本身的记录型日志，定期清理】
// model SystemOperateLog {
//   id           Int         @id @default(autoincrement())
//   // 操作类型
//   operate_type OperateType
//   // 操作人
//   operate_user Int?        @db.Int
//   // 操作对象原始id
//   operate_object_id   Int?              @db.Int
//   // 操作对象类型
//   operate_object_type OperateObjectType
//   // 操作内容[原始]
//   operate_content     String            @db.Text
//   // 操作结果[变更]
//   operate_result      String            @db.Text
//
//   // 操作是否成功
//   operate_success Boolean @default(false) @db.TinyInt
//
//   // 操作时的用户ip
//   operate_ip String @db.VarChar(255)
//
//   // 操作时间 = 创建时间
//   created_at DateTime  @default(now())
//   // 占位用
//   updated_at DateTime  @updatedAt
//   // 占位用
//   deleted_at DateTime?
//
//   @@index([created_at])
//   @@index([operate_user])
//   @@map("system_operate_logs")
// }

export class CreateSystemOperateLogDto {
  @IsNotEmpty({ message: 'operate_type is required' })
  operate_type: OperateType;

  @IsNotEmpty({ message: 'operate_user is required' })
  operate_user: number;

  operate_object_id?: number;

  @IsNotEmpty({ message: 'operate_object_type is required' })
  operate_object_type: OperateObjectType;

  operate_content?: string;

  @IsNotEmpty({ message: 'operate_result is required' })
  operate_result: string;

  @IsNotEmpty({ message: 'operate_success is required' })
  operate_success: boolean;

  @IsNotEmpty({ message: 'operate_ip is required' })
  operate_ip: string;
}
