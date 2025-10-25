-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 25, 2025 at 04:09 AM
-- Server version: 8.0.41-0ubuntu0.22.04.1
-- PHP Version: 8.1.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `peassessment`
--

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int NOT NULL,
  `auth_token` text COLLATE utf8mb4_general_ci,
  `photo_path` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `middle_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `course` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acc_status` enum('active','inactive','suspended') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_added` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `auth_token`, `photo_path`, `first_name`, `middle_name`, `last_name`, `email`, `password`, `course`, `acc_status`, `last_updated`, `date_added`) VALUES
(1, '8uOwOW1EpowQBU95R3KOXoHN8QgYpkBpUEgwkCGugbQ=', 'uploads/1760364725362-182675829.jpeg', 'Rhemie', 'A', 'Balido', 'rhemie@gmail.com', 'balido', 'BSIS', 'active', '2025-10-13 14:13:50', '2025-10-13 22:12:05'),
(2, '/nxiLr+UyvXK9o+OOkDoaDAeyOPHRgbsuL7pSnNm93g=', 'uploads/1760413564045-527240216.jpg', 'Cristy Jane', 'P', 'Bualron', 'janebularonc@gmail.com', '123456', 'BSIS', 'active', '2025-10-24 05:12:08', '2025-10-14 11:46:04'),
(3, 'aTX4ZLZn8sEErdFtleXVoJlX+OpJJH0XLUFaQazZi+Y=', 'uploads/1761284624795-896279426.png', 'Janrell', 'A', 'Dumanon', 'Janrell@gmail.com', 'password', 'BSIS', 'active', '2025-10-24 05:44:27', '2025-10-24 13:43:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
