-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 
-- 伺服器版本： 8.0.17
-- PHP 版本： 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `micro_dev01`
--

-- --------------------------------------------------------

--
-- 資料表結構 `products`
--

CREATE TABLE `products` (
  `product_no` char(40) NOT NULL,
  `product_name` varchar(120) NOT NULL DEFAULT '',
  `classift` char(10) NOT NULL,
  `specification` varchar(40) NOT NULL DEFAULT '',
  `unit` varchar(6) NOT NULL DEFAULT '',
  `remake` varchar(40) NOT NULL DEFAULT '',
  `attribute1` varchar(40) NOT NULL DEFAULT '',
  `attribute2` varchar(40) NOT NULL DEFAULT '',
  `attribute3` varchar(40) NOT NULL DEFAULT '',
  `attribute4` varchar(40) NOT NULL DEFAULT '',
  `reserve` varchar(40) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `products`
--

INSERT INTO `products` (`product_no`, `product_name`, `classift`, `specification`, `unit`, `remake`, `attribute1`, `attribute2`, `attribute3`, `attribute4`, `reserve`, `createtime`) VALUES
('220309208600000040', 'product_name0000', 'class_0001', 'specification_0000', '支', 'Test0000', '', '', '', '', '', '2023-02-07 11:21:06'),
('220309208600000041', 'product_name0001', 'class_0001', 'specification_0001', '支', 'Test0001', '', '', '', '', '', '2023-02-07 11:21:29'),
('220309208600000042', 'product_name0002', 'class_0002', 'specification_0002', '支', 'Test0002', '', '', '', '', '', '2023-02-07 11:21:29'),
('220309208600000043', 'product_name0003', 'class_0003', 'specification_0002', '包', 'Test0003', '', '', '', '', '', '2023-02-07 11:21:29');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
