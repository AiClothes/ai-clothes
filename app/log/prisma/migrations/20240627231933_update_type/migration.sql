-- AlterTable
ALTER TABLE `system_operate_logs` MODIFY `operate_object_type` ENUM('USER', 'FRONT_USER', 'PERMISSION', 'ROLE', 'USER_WORK', 'PRODUCT', 'PRODUCT_CATEGORY', 'ORDER', 'COMMENT') NOT NULL;
