-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.3.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for test_project
CREATE DATABASE IF NOT EXISTS `test_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `test_project`;

-- Dumping structure for table test_project.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `role` enum('admin','superAdmin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `createdBy` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissions` text COLLATE utf8mb4_unicode_ci,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Admin_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table test_project.admin: ~0 rows (approximately)
INSERT INTO `admin` (`id`, `name`, `email`, `password`, `refreshToken`, `isDeleted`, `role`, `createdBy`, `permissions`, `createdAt`, `updatedAt`) VALUES
	('0dd04091-3428-41ca-a4cd-26cff58f674e', 'Admin', 'admin3@admin.com', '$2b$10$tz41N7uT.m.DMCr4VPz4EOjJPWWl1MPlOLrmLT3y/vZ1uyhqqOq/G', NULL, 0, 'admin', NULL, '[{"module":"04810274-bd2b-11ef-9f9c-00155d380100","permissions":["GET","POST"]}]', '2024-12-18 09:19:58.679000', '2024-12-18 09:19:58.679000'),
	('2c354cfc-1cc4-42f1-a478-2f5af58a1313', 'Admin', 'admin2@admin.com', '$2b$10$ERRjS1YggSG.AqSQtv1sGOaEr/sEB8hQvmVQlhbYzbsKA.q2n3FKq', NULL, 0, 'admin', NULL, '[{"module":"04810274-bd2b-11ef-9f9c-00155d380100","permissions":["GET"]}]', '2024-12-18 08:33:59.984000', '2024-12-18 08:33:59.984000'),
	('2e096fe1-f088-4345-8066-ad0077de98ea', 'Admin', 'admin1@admin.com', '$2b$10$EzxqU8M9hRMI6gCOPRPpZeFxpEFlvenuJUvWrqcFiqoICoLBqZbv.', NULL, 0, 'superAdmin', NULL, '[{"module":"04810274-bd2b-11ef-9f9c-00155d380100","permissions":["GET","POST","DELETE","PUT","PATCH"]}]', '2024-12-18 08:31:34.765000', '2024-12-18 08:31:34.765000'),
	('bf77b66e-bcb2-4d61-9407-5cb17a5b7594', 'Admin', 'admin4@admin.com', '$2b$10$gtknnevYAm3omEzcnggJ.evYoIS4fGEhMWlA6.JU08UUPLVmVZ3we', NULL, 0, 'admin', NULL, '[{"module":"04810274-bd2b-11ef-9f9c-00155d380100","permissions":["GET","POST"]}]', '2024-12-18 09:21:08.180000', '2024-12-18 09:21:08.180000'),
	('f088d690-b0ae-4629-acba-8a5b5251b95f', 'Admin', 'admin6@admin.com', '$2b$10$2fLh2tDdKH0.Ai0gmY2dGOP7GlyVCImImkTfWX3ZS2Xmj39fPZHYa', NULL, 0, 'admin', NULL, '[{"module":"04810274-bd2b-11ef-9f9c-00155d380100","permissions":["GET","POST"]}]', '2024-12-18 09:25:52.880000', '2024-12-18 09:25:52.880000');

-- Dumping structure for table test_project.module
CREATE TABLE IF NOT EXISTS `module` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Module_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table test_project.module: ~0 rows (approximately)
INSERT INTO `module` (`id`, `name`) VALUES
	('04810274-bd2b-11ef-9f9c-00155d380100', 'users');

-- Dumping structure for table test_project.otp
CREATE TABLE IF NOT EXISTS `otp` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `expiresAt` timestamp(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Otp_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table test_project.otp: ~1 rows (approximately)

-- Dumping structure for table test_project.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshToken` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `profileImage` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table test_project.user: ~1 rows (approximately)
INSERT INTO `user` (`id`, `name`, `email`, `password`, `refreshToken`, `profileImage`, `isDeleted`, `isVerified`, `createdAt`, `updatedAt`) VALUES
	('74597e52-f2a5-4cd4-8da5-33f212644653', 'Prince', 'iprincepurohit@gmail.com', '$2b$10$xDKgiDB7TqBsQAn6FmK6ouD8102mIszjm7pmMrk2zxL34aDH439IO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NTk3ZTUyLWYyYTUtNGNkNC04ZGE1LTMzZjIxMjY0NDY1MyIsImVtYWlsIjoiaXByaW5jZXB1cm9oaXRAZ21haWwuY29tIiwibmFtZSI6IlBhcmlrc2hpdCBQdXJvaGl0IiwiaWF0IjoxNzM0NTQwODYxLCJleHAiOjE3MzU0MDQ4NjF9.NexlNgc4ArX8ppw-u1SvExAF-CNpD3jdV8F91pRaP-c', '1734540890298-profileImage.png', 0, 1, '2024-12-18 11:16:52.730000', '2024-12-18 11:24:50.321000');

-- Dumping structure for table test_project._prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table test_project._prisma_migrations: ~1 rows (approximately)
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('4f8c1f8c-d11a-48b6-bf07-3b4e38a29b53', 'd9ed6bc5b2c3853c6df5abe7f68de781043090aa80e0db4c14559f37eb8c9347', '2024-12-18 13:55:52.422', '20241218135552_add_permission_action_model', NULL, NULL, '2024-12-18 13:55:52.270', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
