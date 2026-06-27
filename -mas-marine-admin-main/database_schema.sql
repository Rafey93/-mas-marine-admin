-- Andros Marine Institute Database Schema
-- Run this SQL script to create all tables

-- Users table
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Students table
CREATE TABLE IF NOT EXISTS `Student` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `rank` VARCHAR(191) NOT NULL,
  `course` VARCHAR(191) NOT NULL,
  `enrollmentDate` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `progress` INT NOT NULL DEFAULT 0,
  `riskScore` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Courses table
CREATE TABLE IF NOT EXISTS `Course` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL UNIQUE,
  `category` VARCHAR(191) NOT NULL,
  `duration` VARCHAR(191) NOT NULL,
  `enrolledCount` INT NOT NULL DEFAULT 0,
  `completionRate` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(191) NOT NULL,
  `color` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Certificates table
CREATE TABLE IF NOT EXISTS `Certificate` (
  `id` VARCHAR(191) NOT NULL,
  `studentName` VARCHAR(191) NOT NULL,
  `courseName` VARCHAR(191) NOT NULL,
  `issueDate` DATETIME(3) NOT NULL,
  `expiryDate` DATETIME(3) NOT NULL,
  `certificateNo` VARCHAR(191) NOT NULL UNIQUE,
  `status` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Campaigns table
CREATE TABLE IF NOT EXISTS `Campaign` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `assignedGroup` VARCHAR(191) NOT NULL,
  `coursesJson` JSON NOT NULL,
  `deadline` DATETIME(3) NOT NULL,
  `completionRate` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(191) NOT NULL,
  `totalAssigned` INT NOT NULL DEFAULT 0,
  `completed` INT NOT NULL DEFAULT 0,
  `description` LONGTEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- SmartGroups table
CREATE TABLE IF NOT EXISTS `SmartGroup` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL UNIQUE,
  `criteria` LONGTEXT NOT NULL,
  `memberCount` INT NOT NULL DEFAULT 0,
  `avgRiskScore` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Exams table
CREATE TABLE IF NOT EXISTS `Exam` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `duration` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ExamQuestions table
CREATE TABLE IF NOT EXISTS `ExamQuestion` (
  `id` VARCHAR(191) NOT NULL,
  `examId` VARCHAR(191) NOT NULL,
  `question` LONGTEXT NOT NULL,
  `optionsJson` JSON NOT NULL,
  `correctAnswer` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`)
) ENGINE=InnoDB;

-- ExamSessions table
CREATE TABLE IF NOT EXISTS `ExamSession` (
  `id` VARCHAR(191) NOT NULL,
  `examId` VARCHAR(191) NOT NULL,
  `studentId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `startTime` DATETIME(3) NOT NULL,
  `endTime` DATETIME(3),
  `score` INT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`)
) ENGINE=InnoDB;

-- Delete existing admin user if it exists (to update password)
DELETE FROM `User` WHERE `username` = 'maya';

-- Insert admin user (username: maya, password hashed using bcrypt)
-- Password: Easy@1234 (bcrypt hash)
INSERT INTO `User` (`id`, `name`, `username`, `passwordHash`, `role`, `createdAt`, `updatedAt`)
VALUES (
  'admin-maya-001',
  'Maya',
  'maya',
  '$2a$10$gxVSxz3qj7sxWj/rXQjxieLqg0rEhWJLXjGSx2p8JxJlQgMhVd7nO',
  'admin',
  NOW(3),
  NOW(3)
);
