-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 25, 2025 at 04:28 AM
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

--
-- Dumping data for table `dtr`
--

INSERT INTO `dtr` (`id`, `employee_id`, `morning_time_in`, `morning_time_out`, `afternoon_time_in`, `afternoon_time_out`, `message`, `date`) VALUES
(922, 1950, NULL, NULL, '13:58:38', '14:00:22', NULL, '2025-10-23'),
(923, 1951, NULL, NULL, '13:58:47', '14:00:31', NULL, '2025-10-23');

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
(1, 1, 'ernesto', 'full-time', 'Instructor', 10000.00, 0.00, 500, 300.00, 0.00, 'ernesto', 'cotales', 'sabornido', '2025-09-21 03:16:03', '2025-08-15 04:31:09'),
(2, 2, 'yator', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'Rosie', 'NA', 'Yator', '2025-10-10 04:34:49', '2025-08-15 14:02:10'),
(3, 3, 'lanterna', 'full-time', 'Instruct / Program Head', 12000.00, 0.00, 500, 0.00, 0.00, 'Richard', 'A', 'Lanterna', '2025-08-17 07:46:23', '2025-08-15 14:02:29'),
(6, 6, 'Janrell', 'part-time', 'Instructor', 0.00, 100.00, 0, 0.00, 0.00, 'Janrell', 'H', 'Dumanon', '2025-10-10 04:20:09', '2025-10-10 04:20:09'),
(7, 7, 'Flaviano', 'part-time', 'Instructor', 0.00, 100.00, 0, 0.00, 0.00, 'Flaviano', 'S', 'Fucoy III', '2025-10-10 04:25:29', '2025-10-10 04:25:29'),
(8, 8, 'Honey', 'part-time', 'Instructor', 0.00, 100.00, 0, 0.00, 0.00, 'Honey Joy', 'B', 'Lao', '2025-10-10 04:27:10', '2025-10-10 04:27:10'),
(9, 123, 'dimple', 'part-time', 'Instructor', 0.00, 0.00, 600, 600.00, 0.00, 'dimple', 'echavez', 'banguis', '2025-10-14 08:27:44', '2025-10-14 08:27:44'),
(10, 1950, 'lesly', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'lesly', 'alboleras', 'batingal', '2025-10-23 06:07:36', '2025-10-23 06:07:36'),
(11, 1951, 'dimple', 'full-time', 'Instructor', 10000.00, 0.00, 0, 0.00, 0.00, 'dimple', 'echavez', 'banguis', '2025-10-23 06:08:27', '2025-10-23 06:08:27');

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
(14, '2025-08-25', '2025-08-25', 'HOLIDAY', '2025-09-05 00:41:16'),
(15, '2025-08-21', '2025-08-21', 'HOLIDAY', '2025-09-05 00:41:25'),
(16, '2025-09-26', '2025-09-26', 'test', '2025-09-25 03:52:37'),
(17, '2025-09-11', '2025-09-11', 'BIRTHDAY NAKO', '2025-10-03 03:25:20'),
(18, '2025-10-06', '2025-10-06', 'Holiday', '2025-10-03 13:35:56'),
(19, '2025-10-14', '2025-10-17', 'Defense', '2025-10-10 04:40:13'),
(20, '2025-08-11', '2025-08-11', 'birthday', '2025-10-14 06:37:59');

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
(6, 5, 3, '17:00:00', '19:00:00', 'TUE, WED, THU, FRI, SAT', '2025-09-18 02:07:49'),
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
(5, 'AGL_20250815T141624813Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250815T141624813Z.TXT', '2025-08-15 22:16:24'),
(6, 'AGL_20250815T142148594Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250815T142148594Z.TXT', '2025-08-15 22:21:48'),
(7, 'AGL_Invalid Date.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Invalid Date.TXT', '2025-08-15 22:35:07'),
(8, 'AGL_20250815T232603986Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250815T232603986Z.TXT', '2025-08-16 07:26:04'),
(9, 'AGL_20250815T232831089Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250815T232831089Z.TXT', '2025-08-16 07:28:31'),
(10, 'AGL_20250818T034640219Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250818T034640219Z.TXT', '2025-08-18 11:46:40'),
(11, 'AGL_20250818T063537751Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250818T063537751Z.TXT', '2025-08-18 14:35:37'),
(12, 'AGL_20250905T003354261Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250905T003354261Z.TXT', '2025-09-05 08:33:54'),
(13, 'AGL_20250905T003518010Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250905T003518010Z.TXT', '2025-09-05 08:35:18'),
(14, 'AGL_20250905T003603536Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250905T003603536Z.TXT', '2025-09-05 08:36:03'),
(15, 'AGL_20250905T003703966Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250905T003703966Z.TXT', '2025-09-05 08:37:04'),
(16, 'AGL_20250905T003910407Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250905T003910407Z.TXT', '2025-09-05 08:39:10'),
(17, 'AGL_20250920T124249442Z.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250920T124249442Z.TXT', '2025-09-20 20:42:49'),
(18, 'AGL_20250920T125251413Z.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250920T125251413Z.txt', '2025-09-20 20:52:51'),
(19, 'AGL_20250920T134433468Z.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250920T134433468Z.txt', '2025-09-20 21:44:33'),
(20, 'AGL_20250920T134910399Z.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20250920T134910399Z.txt', '2025-09-20 21:49:10'),
(21, 'AGL_20251013T152803946Z.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20251013T152803946Z.txt', '2025-10-13 23:28:04'),
(22, 'AGL_20251013T153506693Z.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_20251013T153506693Z.txt', '2025-10-13 23:35:06'),
(23, 'AGL_Mon_Oct_13_2025_23-41-35.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Mon_Oct_13_2025_23-41-35.txt', '2025-10-13 23:41:35'),
(24, 'AGL_Tue_Oct_14_2025_14-35-42.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Tue_Oct_14_2025_14-35-42.txt', '2025-10-14 14:35:42'),
(25, 'AGL_Tue_Oct_14_2025_16-34-08.txt', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Tue_Oct_14_2025_16-34-08.txt', '2025-10-14 16:34:08'),
(26, 'AGL_Thu_Oct_23_2025_14-16-01.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Thu_Oct_23_2025_14-16-01.TXT', '2025-10-23 14:16:01'),
(27, 'AGL_Thu_Oct_23_2025_14-18-22.TXT', '/Users/ernesto/Documents/Capstone Projects/Payroll System/routes/uploads/AGL_Thu_Oct_23_2025_14-18-22.TXT', '2025-10-23 14:18:22');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_added` date DEFAULT current_timestamp()
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
(1, 'admin@gmail.com', '$2b$10$JHXrTHrcLFnnBGaQ4gmte.gZtSZtHy5wbjXskiEVZ1AqiqvjzfPfu', 'administrator', 'nZxra67CK/2COo+fhBlJf54aHfAOTScYa/LWKmEGGSg=', '2025-06-28 19:38:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dtr`
--
ALTER TABLE `dtr`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=924;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `faculty_loads`
--
ALTER TABLE `faculty_loads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `file_upload`
--
ALTER TABLE `file_upload`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

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
