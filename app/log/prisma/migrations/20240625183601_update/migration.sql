-- AlterTable
ALTER TABLE `system_operate_logs` MODIFY `operate_object_type` ENUM('USER', 'PRODUCT', 'PRODUCT_CATEGORY', 'ORDER', 'COMMENT') NOT NULL;
