-- CreateTable
CREATE TABLE `logistics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_no` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `consignee` VARCHAR(191) NOT NULL,
    `consignee_phone` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NOT NULL,
    `payment_time` DATETIME(3) NULL,
    `delivery_time` DATETIME(3) NULL,
    `sign_time` DATETIME(3) NULL,
    `cancel_time` DATETIME(3) NULL,
    `cancel_reason` VARCHAR(255) NULL,
    `refund_time` DATETIME(3) NULL,
    `refund_reason` VARCHAR(255) NULL,
    `return_time` DATETIME(3) NULL,
    `return_reason` VARCHAR(255) NULL,
    `complete_time` DATETIME(3) NULL,
    `payment_id` INTEGER NOT NULL,
    `logistic_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `orders_order_no_key`(`order_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `product_image` VARCHAR(191) NOT NULL,
    `specification_combination_id` INTEGER NOT NULL,
    `specification_value_id` VARCHAR(191) NOT NULL,
    `specification_value_name` VARCHAR(191) NOT NULL,
    `product_price` DOUBLE NOT NULL,
    `product_total_price` DOUBLE NOT NULL,
    `product_num` INTEGER NOT NULL,
    `final_total_price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_logistic_id_fkey` FOREIGN KEY (`logistic_id`) REFERENCES `logistics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_products` ADD CONSTRAINT `order_products_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
