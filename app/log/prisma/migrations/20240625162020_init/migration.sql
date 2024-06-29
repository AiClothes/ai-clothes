-- CreateTable
CREATE TABLE `use_third_api_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `api_url` VARCHAR(255) NOT NULL,
    `request_params` TEXT NOT NULL,
    `response_result` TEXT NOT NULL,
    `user_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_operate_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `operate_type` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `operate_user` INTEGER NULL,
    `operate_object_id` INTEGER NULL,
    `operate_object_type` ENUM('USER', 'PRODUCT', 'ORDER', 'COMMENT') NOT NULL,
    `operate_content` TEXT NOT NULL,
    `operate_result` TEXT NOT NULL,
    `operate_success` BOOLEAN NOT NULL DEFAULT false,
    `operate_ip` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `system_operate_logs_created_at_idx`(`created_at`),
    INDEX `system_operate_logs_operate_user_idx`(`operate_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
