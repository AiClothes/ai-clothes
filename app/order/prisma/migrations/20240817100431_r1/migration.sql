/*
  Warnings:

  - You are about to drop the column `work_info` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order_products` ADD COLUMN `work_info` TEXT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `work_info`;
