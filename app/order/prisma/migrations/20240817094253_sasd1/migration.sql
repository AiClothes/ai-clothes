/*
  Warnings:

  - Added the required column `user_info` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `user_info` TEXT NOT NULL,
    ADD COLUMN `work_info` TEXT NULL;
