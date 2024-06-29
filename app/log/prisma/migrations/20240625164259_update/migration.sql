/*
  Warnings:

  - Made the column `operate_user` on table `system_operate_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `system_operate_logs` MODIFY `operate_user` INTEGER NOT NULL,
    MODIFY `operate_content` TEXT NULL;
