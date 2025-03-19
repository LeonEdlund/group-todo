-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 18, 2025 at 12:27 PM
-- Server version: 9.2.0
-- PHP Version: 8.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `group_todo`
--

-- --------------------------------------------------------

--
-- Table structure for table `webb6_projects`
--

CREATE TABLE `webb6_projects` (
  `project_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `cover_svg` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `webb6_projects`
--

-- --------------------------------------------------------

--
-- Table structure for table `webb6_project_members`
--

CREATE TABLE `webb6_project_members` (
  `id` int NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `project_id` int NOT NULL,
  `role` enum('owner','member') NOT NULL DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `webb6_tasks`
--

CREATE TABLE `webb6_tasks` (
  `task_id` int NOT NULL,
  `project_id` int NOT NULL,
  `completed_by` int UNSIGNED DEFAULT NULL,
  `score` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `webb6_users`
--

CREATE TABLE `webb6_users` (
  `user_id` int UNSIGNED NOT NULL,
  `google_id` char(25) NOT NULL,
  `display_name` varchar(155) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `webb6_projects`
--
ALTER TABLE `webb6_projects`
  ADD PRIMARY KEY (`project_id`);

--
-- Indexes for table `webb6_project_members`
--
ALTER TABLE `webb6_project_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`project_id`),
  ADD KEY `webb6_project_members_ibfk_2` (`project_id`);

--
-- Indexes for table `webb6_tasks`
--
ALTER TABLE `webb6_tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `tasks_completed_by_user` (`completed_by`);

--
-- Indexes for table `webb6_users`
--
ALTER TABLE `webb6_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `google_id_index` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `webb6_projects`
--
ALTER TABLE `webb6_projects`
  MODIFY `project_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `webb6_project_members`
--
ALTER TABLE `webb6_project_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `webb6_tasks`
--
ALTER TABLE `webb6_tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `webb6_users`
--
ALTER TABLE `webb6_users`
  MODIFY `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `webb6_project_members`
--
ALTER TABLE `webb6_project_members`
  ADD CONSTRAINT `project_members_user` FOREIGN KEY (`user_id`) REFERENCES `webb6_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `webb6_project_members_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `webb6_projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `webb6_tasks`
--
ALTER TABLE `webb6_tasks`
  ADD CONSTRAINT `tasks_completed_by_user` FOREIGN KEY (`completed_by`) REFERENCES `webb6_users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `webb6_tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `webb6_projects` (`project_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
