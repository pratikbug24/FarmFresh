-- FarmFresh Foods database schema
--
-- The static site stores demo accounts in the browser. Point the PHP backend
-- at this schema to persist real users, orders and order lines.
--
--   mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS `farmfresh`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `farmfresh`;

-- ------------------------------------------------------------------ users
CREATE TABLE IF NOT EXISTS `users` (
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `user_name`     VARCHAR(50)  NOT NULL,
    `email`         VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `name`          VARCHAR(255) NOT NULL,
    `phone`         VARCHAR(32)  DEFAULT NULL,
    `address`       TEXT         DEFAULT NULL,
    `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uniq_user_name` (`user_name`),
    UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------- orders
CREATE TABLE IF NOT EXISTS `orders` (
    `id`             INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`        INT          NOT NULL,
    `reference`      VARCHAR(32)  NOT NULL,
    `status`         VARCHAR(32)  NOT NULL DEFAULT 'Confirmed',
    `payment_method` VARCHAR(64)  NOT NULL DEFAULT 'Cash on delivery',
    `address`        TEXT         NOT NULL,
    `notes`          TEXT         DEFAULT NULL,
    `total`          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `placed_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uniq_reference` (`reference`),
    KEY `idx_orders_user` (`user_id`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------ order_items
CREATE TABLE IF NOT EXISTS `order_items` (
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `order_id`   INT           NOT NULL,
    `product_id` INT           NOT NULL,
    `name`       VARCHAR(255)  NOT NULL,
    `unit`       VARCHAR(32)   NOT NULL DEFAULT 'kg',
    `price`      DECIMAL(10,2) NOT NULL,
    `quantity`   INT           NOT NULL DEFAULT 1,
    KEY `idx_items_order` (`order_id`),
    CONSTRAINT `fk_items_order` FOREIGN KEY (`order_id`)
        REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------- products
CREATE TABLE IF NOT EXISTS `products` (
    `id`             INT AUTO_INCREMENT PRIMARY KEY,
    `name`           VARCHAR(255)  NOT NULL,
    `category`       VARCHAR(32)   NOT NULL,
    `price`          DECIMAL(10,2) NOT NULL,
    `original_price` DECIMAL(10,2) DEFAULT NULL,
    `unit`           VARCHAR(32)   NOT NULL DEFAULT 'kg',
    `image`          VARCHAR(255)  NOT NULL,
    `description`    TEXT          DEFAULT NULL,
    `badge`          VARCHAR(32)   DEFAULT NULL,
    `rating`         DECIMAL(2,1)  DEFAULT NULL
) ENGINE=InnoDB;

INSERT INTO `products` (`name`, `category`, `price`, `original_price`, `unit`, `image`, `badge`, `rating`) VALUES
    ('Fresh Apples',    'fruits',     120, 150, 'kg',    'assets/images/apple.png',    'Fresh',     4.5),
    ('Ripe Tomatoes',   'vegetables',  50,  60, 'kg',    'assets/images/tomato.png',   'Organic',   4.3),
    ('Fresh Cucumbers', 'vegetables',  40,  50, 'kg',    'assets/images/cucumber.png', 'Local',     4.2),
    ('Sweet Oranges',   'fruits',      80, 100, 'kg',    'assets/images/Oranges.jpeg', 'Vitamin C', 4.6),
    ('Fresh Bananas',   'fruits',      60,  70, 'dozen', 'assets/images/Bananas.jpeg', 'Energy',    4.4),
    ('Green Spinach',   'vegetables',  30,  40, 'bunch', 'assets/images/cucumber.png', 'Iron Rich', 4.1);
