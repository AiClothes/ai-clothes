import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

enum PermissionType {
  MENU = 'MENU',
  API = 'API'
}

async function main() {
  try {
    // 创建权限相关
    const permissions: { name: string; type: PermissionType }[] = [
      { name: '角色管理', type: PermissionType.MENU },
      { name: '用户管理', type: PermissionType.MENU },
      { name: '小程序配置', type: PermissionType.MENU },
      { name: '订单管理', type: PermissionType.MENU },
      { name: '商品管理', type: PermissionType.MENU },
      { name: '作品管理', type: PermissionType.MENU },
      { name: 'AI绘图管理', type: PermissionType.MENU },
      { name: '数据看板', type: PermissionType.MENU },
      { name: '客户管理', type: PermissionType.MENU }
    ];

    const permissionData: any[] = [];

    for (const permission of permissions) {
      const existingPermission = await prisma.permission.upsert({
        where: { name: permission.name },
        create: {
          name: permission.name,
          permission_type: permission.type
        },
        update: {}
      });
      permissionData.push(existingPermission);
      console.log(`权限: ${permission.name} 已存在或被创建。`);
    }

    // 创建角色
    const roles = [
      {
        name: '超级管理员',
        permissions: permissions.map((r) => r.name)
      }
    ];

    const roleData: any[] = [];

    for (const role of roles) {
      const existingRole = await prisma.role.upsert({
        where: { name: role.name },
        create: {
          name: role.name
        },
        update: {}
      });
      roleData.push(existingRole);

      for (const permission of permissionData) {
        await prisma.rolePermissionLinks.upsert({
          where: {
            role_id_permission_id: {
              role_id: existingRole.id,
              permission_id: permission.id
            }
          },
          create: {
            role_id: existingRole.id,
            permission_id: permission.id
          },
          update: {}
        });
        console.log(`角色 ${existingRole.name} 已绑定权限: ${permission.name}`);
      }
    }

    // 创建用户
    const adminEmail = '15323399792@qq.com';
    const nickname = '超级管理员';
    const username = '15323399792';
    const phone = '15323399792';
    const password = 'CHISHEN168';

    const existingUser = await prisma.user.upsert({
      where: {
        email: adminEmail
      },
      create: {
        email: adminEmail,
        nickname: nickname,
        username: username,
        phone: phone,
        password: password,
        is_super: true
      },
      update: {}
    });

    console.log(`超级管理员用户: ${existingUser.email} 已存在或被创建。`);

    for (const role of roleData) {
      await prisma.userRoleLinks.upsert({
        where: {
          user_id_role_id: {
            user_id: existingUser.id,
            role_id: role.id
          }
        },
        create: {
          user_id: existingUser.id,
          role_id: role.id
        },
        update: {}
      });
      console.log(`用户 ${existingUser.username} 已绑定角色: ${role.name}`);
    }
  } catch (error) {
    console.error('初始化过程中出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect().then(() => process.exit(1));
});
