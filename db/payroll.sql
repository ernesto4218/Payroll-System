-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 06, 2025 at 05:49 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `payroll`
--

-- --------------------------------------------------------

--
-- Table structure for table `dtr`
--

CREATE TABLE `dtr` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `morning_time_in` time DEFAULT NULL,
  `morning_time_out` time DEFAULT NULL,
  `afternoon_time_in` time DEFAULT NULL,
  `afternoon_time_out` time DEFAULT NULL,
  `message` varchar(250) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `b_id` int(11) NOT NULL,
  `b_name` varchar(100) NOT NULL,
  `type` enum('full-time','part-time') NOT NULL,
  `designation` varchar(250) DEFAULT NULL,
  `monthly_salary` decimal(10,2) DEFAULT 0.00,
  `hourly_salary` decimal(10,2) DEFAULT 0.00,
  `sss` int(11) DEFAULT 0,
  `microdev` decimal(10,2) DEFAULT 0.00,
  `pagibig` decimal(10,2) DEFAULT 0.00,
  `first_name` varchar(250) DEFAULT NULL,
  `middle_name` varchar(250) DEFAULT NULL,
  `last_name` varchar(250) DEFAULT NULL,
  `last_edited` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_added` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `b_id`, `b_name`, `type`, `designation`, `monthly_salary`, `hourly_salary`, `sss`, `microdev`, `pagibig`, `first_name`, `middle_name`, `last_name`, `last_edited`, `date_added`) VALUES
(1, 30735, 'ernesto', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'ernesto', 'cotales', 'sabornido', '2025-11-17 03:49:41', '2025-08-15 04:31:09'),
(2, 29589, 'yator', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Rosie', 'NA', 'Yator', '2025-11-17 01:18:04', '2025-08-15 14:02:10'),
(3, 3, 'lanterna', 'full-time', 'Instruct / Program Head', 12000.00, 0.00, 500, 0.00, 0.00, 'Richard', 'A', 'Lanterna', '2025-08-17 07:46:23', '2025-08-15 14:02:29'),
(12, 22345, 'Shiela', 'full-time', 'Library Staff', 10000.00, 0.00, 0, 0.00, 0.00, 'Shiela', 'C.', 'Adorna', '2025-11-17 01:05:54', '2025-11-17 01:05:54'),
(13, 30733, 'Merryl', 'full-time', 'Instructor', 11000.00, 0.00, 0, 0.00, 0.00, 'Merryl', 'R.', 'Parreño', '2025-11-17 01:06:33', '2025-11-17 01:06:33'),
(14, 30178, 'Marialie', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Marialie', 'D.', 'Superable', '2025-11-17 01:07:14', '2025-11-17 01:07:14'),
(15, 30180, 'Rennier', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Rennier Mark', 'B.', 'Villanoza', '2025-11-17 01:07:55', '2025-11-17 01:07:55'),
(16, 30734, 'Christine', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Christine', 'P.', 'Rodriguez', '2025-11-17 01:08:28', '2025-11-17 01:08:28'),
(17, 28850, 'Gellan', 'full-time', 'Registrar Staff', 10000.00, 0.00, 0, 0.00, 0.00, 'Gellan', 'L.', 'Mangumpit', '2025-11-17 01:09:14', '2025-11-17 01:09:14'),
(18, 30170, 'Mark', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Mark Niño', 'B.', 'Magracia', '2025-11-17 01:10:12', '2025-11-17 01:10:12'),
(19, 30736, 'John', 'full-time', 'Instructor', 11000.00, 0.00, 0, 0.00, 0.00, 'John Lloyd', 'M.', 'Toledo', '2025-11-17 01:11:19', '2025-11-17 01:11:19'),
(20, 30724, 'Marlyn', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Marlyn Jane', 'R.', 'Conturno', '2025-11-17 01:12:07', '2025-11-17 01:12:07'),
(21, 30732, 'Jeannette', 'full-time', 'Instructor', 11000.00, 0.00, 0, 0.00, 0.00, 'Jeannette', 'A.', 'Monton', '2025-11-17 01:12:41', '2025-11-17 01:12:41'),
(22, 28952, 'Maria', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Maria Cris', 'A.', 'Filosofo', '2025-11-17 01:13:21', '2025-11-17 01:13:21'),
(23, 30728, 'Philip', 'full-time', 'Registrar Staff', 10000.00, 0.00, 0, 0.00, 0.00, 'Philip James', 'S.', 'Gumera', '2025-11-17 01:14:04', '2025-11-17 01:14:04'),
(24, 23401, 'Roselgen', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Roselgen', 'A.', 'Castolo', '2025-11-17 01:14:40', '2025-11-17 01:14:40'),
(25, 24779, 'Gilbert', 'full-time', 'ROTC', 10000.00, 0.00, 0, 0.00, 0.00, 'Gilbert', 'A.', 'Bautista', '2025-11-17 01:15:13', '2025-11-17 01:15:13'),
(26, 30316, 'Christian', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Christian Joy', 'R.', 'Yap', '2025-11-17 01:15:48', '2025-11-17 01:15:48'),
(27, 23410, 'Balmonte', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Balmonte', 'B.', 'Balmonte', '2025-11-17 01:16:22', '2025-11-17 01:16:22'),
(28, 28897, 'Gladys', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Gladys Ann', 'E.', 'Mag-usara', '2025-11-17 01:16:51', '2025-11-17 01:16:51'),
(29, 29553, 'Charita', 'full-time', 'Janitor', 10000.00, 0.00, 0, 0.00, 0.00, 'Charita', 'S.', 'Miranda', '2025-11-17 01:17:25', '2025-11-17 01:17:25'),
(30, 30528, 'JN', 'full-time', 'Campus Dean', 70000.00, 0.00, 0, 0.00, 0.00, 'Jehuel Nathan', 'R', 'Daculio', '2025-12-05 08:50:48', '2025-12-05 08:50:48');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `start` varchar(250) NOT NULL,
  `end` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `date_added` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `start`, `end`, `description`, `date_added`) VALUES
(22, '2025-10-31', '2025-10-31', 'Holiday', '2025-11-04 15:00:07'),
(23, '2025-12-08', '2025-12-08', 'Birthday nako', '2025-12-01 06:13:16'),
(24, '2025-11-11', '2025-11-11', 'Birthday nako', '2025-12-01 06:13:47');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_loads`
--

CREATE TABLE `faculty_loads` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `days` varchar(100) DEFAULT NULL,
  `date_added` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty_loads`
--

INSERT INTO `faculty_loads` (`id`, `teacher_id`, `subject_id`, `start_time`, `end_time`, `days`, `date_added`) VALUES
(4, 5, 3, '17:00:00', '19:00:00', 'SUN', '2025-09-18 02:06:03'),
(5, 5, 3, '17:00:00', '20:00:00', 'MON', '2025-09-18 02:06:22'),
(6, 1, 3, '08:00:00', '12:00:00', 'TUE, WED, THU, FRI, SAT', '2025-09-18 02:07:49'),
(7, 6, 5, '07:00:00', '12:00:00', 'SAT', '2025-10-10 04:22:02'),
(8, 6, 5, '13:00:00', '18:00:00', 'SAT', '2025-10-10 04:22:32'),
(9, 6, 6, '07:00:00', '12:00:00', 'SUN', '2025-10-10 04:23:09'),
(10, 6, 6, '13:00:00', '18:00:00', 'SUN', '2025-10-10 04:23:35'),
(11, 6, 6, '17:30:00', '20:30:00', 'FRI', '2025-10-10 04:24:02'),
(12, 6, 6, '18:00:00', '20:00:00', 'SAT', '2025-10-10 04:24:26'),
(13, 7, 7, '17:30:00', '20:30:00', 'THU', '2025-10-10 04:26:05'),
(14, 7, 7, '17:30:00', '20:30:00', 'FRI', '2025-10-10 04:26:28'),
(15, 8, 8, '07:00:00', '12:00:00', 'SAT', '2025-10-10 04:27:53'),
(16, 8, 8, '13:00:00', '18:00:00', 'SAT', '2025-10-10 04:28:11');

-- --------------------------------------------------------

--
-- Table structure for table `file_upload`
--

CREATE TABLE `file_upload` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `path` varchar(500) NOT NULL,
  `date_added` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `file_upload`
--

INSERT INTO `file_upload` (`id`, `file_name`, `path`, `date_added`) VALUES
(1, 'AGL_Mon_Nov_17_2025_13-19-38.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Mon_Nov_17_2025_13-19-38.TXT', '2025-11-17 13:19:38'),
(2, 'AGL_Mon_Nov_17_2025_15-34-13.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Mon_Nov_17_2025_15-34-13.TXT', '2025-11-17 15:34:13'),
(3, 'AGL_Mon_Dec_01_2025_13-49-09.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Mon_Dec_01_2025_13-49-09.TXT', '2025-12-01 13:49:09'),
(4, 'AGL_Mon_Dec_01_2025_14-07-20.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Mon_Dec_01_2025_14-07-20.TXT', '2025-12-01 14:07:20'),
(5, 'AGL_Fri_Dec_05_2025_16-52-32.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Fri_Dec_05_2025_16-52-32.TXT', '2025-12-05 16:52:32'),
(6, 'AGL_Fri_Dec_05_2025_17-05-40.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Fri_Dec_05_2025_17-05-40.TXT', '2025-12-05 17:05:40'),
(7, 'AGL_Sat_Dec_06_2025_11-16-03.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Sat_Dec_06_2025_11-16-03.TXT', '2025-12-06 11:16:04');

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` int(11) NOT NULL,
  `amount_total` decimal(10,2) NOT NULL,
  `date_added` varchar(20) NOT NULL,
  `date_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payroll`
--

INSERT INTO `payroll` (`id`, `amount_total`, `date_added`, `date_updated`) VALUES
(1, 184117.50, 'November 2025', '2025-12-05 17:01:12'),
(24, 63668.01, 'December 2025', '2025-12-01 14:10:42');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_added` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `code`, `description`, `date_added`) VALUES
(3, '104', 'Programming 2', '2025-09-15'),
(4, '123', 'DATA MINING', '2025-10-03'),
(5, 'IS 103', 'Computer Programming 1', '2025-10-10'),
(6, 'IS 201', 'Data Structure and Algorithm', '2025-10-10'),
(7, 'IS 303', 'Business Process Management', '2025-10-10'),
(8, 'IS 202', 'Organization and Management Concepts', '2025-10-10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  `date_added` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `auth_token`, `date_added`) VALUES
(1, 'admin@gmail.com', '$2b$10$JHXrTHrcLFnnBGaQ4gmte.gZtSZtHy5wbjXskiEVZ1AqiqvjzfPfu', 'administrator', '3etrWgbLfidzQmDZjpKUNAeeI6966fmbD/3PvyqGagE=', '2025-06-28 19:38:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dtr`
--
ALTER TABLE `dtr`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_date` (`employee_id`,`date`),
  ADD UNIQUE KEY `unique_dtr` (`date`,`employee_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faculty_loads`
--
ALTER TABLE `faculty_loads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `file_upload`
--
ALTER TABLE `file_upload`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date_added` (`date_added`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dtr`
--
ALTER TABLE `dtr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `faculty_loads`
--
ALTER TABLE `faculty_loads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `file_upload`
--
ALTER TABLE `file_upload`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
