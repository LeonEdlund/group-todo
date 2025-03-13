
-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `webb6_projects` (
  `project_id` int NOT NULL,
  `owner_id` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `cover_svg` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `webb6_project_members` (
  `id` int NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `project_id` int NOT NULL,
  `role` enum('owner','member') NOT NULL DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
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
-- Table structure for table `users`
--

CREATE TABLE `webb6_users` (
  `user_id` int UNSIGNED NOT NULL,
  `google_id` char(25) NOT NULL,
  `display_name` varchar(155) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `webb6_projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `projects_owner_id` (`owner_id`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `webb6_project_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `project_members_user` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `webb6_tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `tasks_completed_by_user` (`completed_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `webb6_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `google_id_index` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `webb6_projects`
  MODIFY `project_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `webb6_project_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `webb6_tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `webb6_users`
  MODIFY `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `webb6_projects`
  ADD CONSTRAINT `projects_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `webb6_users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `project_members`
--
ALTER TABLE `webb6_project_members`
  ADD CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `webb6_projects` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_members_user` FOREIGN KEY (`user_id`) REFERENCES `webb6_users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `tasks`
--
ALTER TABLE `webb6_tasks`
  ADD CONSTRAINT `tasks_completed_by_user` FOREIGN KEY (`completed_by`) REFERENCES `webb6_users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `webb6_projects` (`project_id`) ON DELETE CASCADE;
