-- CreateTable
CREATE TABLE `galleries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL,
    `registered_at` DATETIME(3) NULL,
    `modified_at` DATETIME(3) NULL,
    `published_at` DATETIME(3) NULL,
    `unpublished_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_looks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `galleryId` INTEGER NOT NULL,
    `lookId` INTEGER NOT NULL,
    `isFeatured` BOOLEAN NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `gallery_looks_galleryId_key`(`galleryId`),
    UNIQUE INDEX `gallery_looks_lookId_key`(`lookId`),
    UNIQUE INDEX `gallery_looks_galleryId_lookId_key`(`galleryId`, `lookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `looks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mediaKey` VARCHAR(191) NOT NULL,
    `mediaUrl` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL,
    `shouldDisplayProduct` BOOLEAN NOT NULL,
    `registeredAt` DATETIME(3) NULL,
    `modifiedAt` DATETIME(3) NULL,
    `publishedAt` DATETIME(3) NULL,
    `unpublishedAt` DATETIME(3) NULL,
    `modelDescription` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `look_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lookId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productHandle` VARCHAR(191) NOT NULL,
    `spotX` INTEGER NULL,
    `spotY` INTEGER NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `accountOwner` BOOLEAN NOT NULL,
    `locale` VARCHAR(191) NULL,
    `collaborator` BOOLEAN NOT NULL,
    `emailVerified` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_galleriesTolooks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_galleriesTolooks_AB_unique`(`A`, `B`),
    INDEX `_galleriesTolooks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gallery_looks` ADD CONSTRAINT `gallery_looks_galleryId_fkey` FOREIGN KEY (`galleryId`) REFERENCES `galleries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gallery_looks` ADD CONSTRAINT `gallery_looks_lookId_fkey` FOREIGN KEY (`lookId`) REFERENCES `looks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `look_products` ADD CONSTRAINT `look_products_lookId_fkey` FOREIGN KEY (`lookId`) REFERENCES `looks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_galleriesTolooks` ADD CONSTRAINT `_galleriesTolooks_A_fkey` FOREIGN KEY (`A`) REFERENCES `galleries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_galleriesTolooks` ADD CONSTRAINT `_galleriesTolooks_B_fkey` FOREIGN KEY (`B`) REFERENCES `looks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
