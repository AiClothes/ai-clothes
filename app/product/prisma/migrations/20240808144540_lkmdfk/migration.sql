-- AlterTable
ALTER TABLE `product_categories` ADD COLUMN `sort` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `pay_account` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `sort` INTEGER NOT NULL DEFAULT 0;
