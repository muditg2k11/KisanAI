-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2025 at 05:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farmers`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `delivery_address` text NOT NULL,
  `status` varchar(50) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user`, `email`, `mobile`, `items`, `total`, `payment_method`, `delivery_address`, `status`) VALUES
(2, 'consumer', 'consumer@gmail.com', '07844888308', '[{\"description\": \"fgrggrgh grhrhrhrh fheheheth\", \"id\": 2, \"image\": \"http://localhost:5000/uploads/a92e28db-690a-4546-99ef-fe7ce05b2286_6292986.jpg\", \"price\": 135, \"title\": \"fhtehth thetheth\", \"quantity\": 1}, {\"description\": \"erehtjjt\", \"id\": 1, \"image\": \"http://localhost:5000/uploads/c65995a8-28ed-4a25-b983-de1bb05cc3ab_IMG-20241008-WA0001.jpg\", \"price\": 123, \"title\": \"grerhhtjt\", \"quantity\": 1}]', 258.00, 'COD', '25 ayushri bhawan 9th cross\n1st main indragandhi street mahadevpura', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` float NOT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_path`) VALUES
(1, 'grerhhtjt', 'erehtjjt', 123, 'uploads\\c65995a8-28ed-4a25-b983-de1bb05cc3ab_IMG-20241008-WA0001.jpg'),
(2, 'fhtehth thetheth', 'fgrggrgh grhrhrhrh fheheheth', 135, 'uploads\\a92e28db-690a-4546-99ef-fe7ce05b2286_6292986.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(5, 'ppp', 'ppp@gmail.com', 'ac0993bdb8f880f7648f5cb66efadb46177cdd848c9f3e3b4a', 'farmer'),
(6, 'rahul', 'engg.rahulkhare.it@gmail.com', '687f6da20de59091e67f594827cdee268125feb3aed1c3bad7', 'consumer'),
(7, 'farmer', 'farmer@gmail.com', '26c07fc7be1668f8ea7e3801d4ffdbf33de487a593a6902893', 'farmer'),
(8, 'far', 'far@gmail.com', 'dda2fbb4236e00726d4feffaa35ff1bbd673fb0b896668ad45', 'farmer'),
(9, 'rahul', 'rahulkhare@gmail.com', '687f6da20de59091e67f594827cdee268125feb3aed1c3bad7', 'farmer'),
(11, 'consumer', 'consumer@gmail.com', '4c40c66a1be8c03ff6c5f2455bb5d99d4447c80a905a729b51', 'consumer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
