-- AlterTable
ALTER TABLE `user_works` ADD COLUMN `is_delete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `product_id` INTEGER NULL,
    MODIFY `cover` VARCHAR(191) NULL,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1,
    MODIFY `source` ENUM('BUILD', 'UPLOAD', 'BUILD_PRODUCT') NOT NULL,
    MODIFY `create_type` ENUM('NONE', 'CREATE_BY_IMAGE', 'CREATE_BY_TEXT', 'PHOTOSHOP', 'COMPOSITE') NOT NULL;

-- CreateTable
CREATE TABLE `user_work_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `work_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_work_images` ADD CONSTRAINT `user_work_images_work_id_fkey` FOREIGN KEY (`work_id`) REFERENCES `user_works`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
