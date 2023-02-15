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
-- 資料庫： `abba_materialmanag`
--

-- --------------------------------------------------------

--
-- 資料表結構 `activereaders`
--

CREATE TABLE `activereaders` (
  `ARSN` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mac` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `group` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `model` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uiorder` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `activereaders`
--

INSERT INTO `activereaders` (`ARSN`, `name`, `ip`, `mac`, `group`, `model`, `uiorder`, `description`) VALUES
('AR0001', 'AL1320T01,7F入口', '192.168.249.106', '00-50-56-C0-00-08', 'block_A', 'AL1320', '0001', 'test'),
('AR0002', 'AL1320T02,辦公室1', '192.168.249.108', '00-50-56-C0-00-08', 'block_A', 'AL1320', '0002', 'test'),
('AR0003', 'AL1320T03,辦公室2', '192.168.249.119', '00-50-56-C0-00-08', 'block_A', 'AL1320', '0003', 'test'),
('AR0004', 'AL1320T04,辦公室3', '192.168.249.120', '00-50-56-C0-00-08', 'block_A', 'AL1320', '0004', 'test'),
('AR0005', 'AL1320T05,實驗室1', '192.168.249.81', '00-50-56-C0-00-08', 'block_A', 'AL1320', '0005', 'test');

-- --------------------------------------------------------

--
-- 資料表結構 `activetagids`
--

CREATE TABLE `activetagids` (
  `ATSN` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `aid` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `pid` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `activetagids`
--

INSERT INTO `activetagids` (`ATSN`, `aid`, `pid`, `name`, `description`) VALUES
('AT0001', 'B330000083', 'AAAAAAAAAAAAAAB330000083', 'apTag,中文名稱1', 'aptag'),
('AT0002', 'B430000084', 'AAAAAAAAAAAAAAB430000084', 'apTag,中文名稱1', 'aptag'),
('AT0003', 'B530000085', 'AAAAAAAAAAAAAAB530000085', 'apTag,中文名稱1', 'aptag'),
('AT0004', 'B630000086', 'AAAAAAAAAAAAAAB630000086', 'apTag,中文名稱1', 'aptag'),
('AT0005', 'B730000087', 'AAAAAAAAAAAAAAB730000087', 'apTag,中文名稱1', 'aptag'),
('AT0006', 'B830000088', 'AAAAAAAAAAAAAAB830000088', 'apTag,中文名稱1', 'aptag'),
('AT0007', 'B930000089', 'AAAAAAAAAAAAAAB930000089', 'apTag,中文名稱1', 'aptag'),
('AT0008', 'BA3000008A', 'AAAAAAAAAAAAAABA3000008A', 'apTag,中文名稱1', 'aptag'),
('AT0009', 'BB3000008B', 'AAAAAAAAAAAAAABB3000008B', 'apTag,中文名稱1', 'aptag'),
('AT0010', 'BC3000008C', 'AAAAAAAAAAAAAABC3000008C', 'apTag,中文名稱1', 'aptag'),
('AT0011', 'BD3000008D', 'AAAAAAAAAAAAAABD3000008D', 'apTag,中文名稱1', 'aptag'),
('AT0012', 'BE3000008E', 'AAAAAAAAAAAAAABE3000008E', 'apTag,中文名稱1', 'aptag'),
('AT0013', 'BF3000008F', 'AAAAAAAAAAAAAABF3000008F', 'apTag,中文名稱1', 'aptag'),
('AT0014', 'DF300000AF', 'AAAAAAAAAAAAAADF300000AF', 'apTag,中文名稱1', 'aptag'),
('AT0015', '3330000FF3', 'AAAAAAAAAAAAAA3330000FF3', 'apTag,中文名稱1', 'aptag'),
('AT0016', 'E8300000B8', 'AAAAAAAAAAAAAAE8300000B8', 'apTag,中文名稱1', 'aptag'),
('AT0017', 'E7300000B7', 'AAAAAAAAAAAAAAED300000BD', 'apTag,中文名稱1', 'aptag'),
('AT0018', 'EA300000BA', 'AAAAAAAAAAAAAAEA300000BA', 'apTag,中文名稱1', 'aptag'),
('AT0019', 'ED300000BD', 'AAAAAAAAAAAAAAED300000BD', 'apTag,中文名稱1', 'aptag'),
('AT0020', 'E9300000B9', 'AAAAAAAAAAAAAAE9300000B9', 'apTag,中文名稱1', 'aptag'),
('AT0021', 'AE3000009E', 'AAAAAAAAAAAAAAAE3000007E', 'apTag,中文名稱1', 'aptag');

-- --------------------------------------------------------

--
-- 資料表結構 `activetagids_t1`
--

CREATE TABLE `activetagids_t1` (
  `ATSN` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `aid` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `pid` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `activetagids_t1`
--

INSERT INTO `activetagids_t1` (`ATSN`, `aid`, `pid`, `name`, `description`) VALUES
('AT0001', 'B330000083', 'AAAAAAAAAAAAAAB330000083', 'apTag,中文名稱1', 'aptag'),
('AT0002', 'B430000084', 'AAAAAAAAAAAAAAB430000084', 'apTag,中文名稱1', 'aptag'),
('AT0003', 'B530000085', 'AAAAAAAAAAAAAAB530000085', 'apTag,中文名稱1', 'aptag'),
('AT0004', 'B630000086', 'AAAAAAAAAAAAAAB630000086', 'apTag,中文名稱1', 'aptag'),
('AT0005', 'B730000087', 'AAAAAAAAAAAAAAB730000087', 'apTag,中文名稱1', 'aptag'),
('AT0006', 'B830000088', 'AAAAAAAAAAAAAAB830000088', 'apTag,中文名稱1', 'aptag'),
('AT0007', 'B930000089', 'AAAAAAAAAAAAAAB930000089', 'apTag,中文名稱1', 'aptag'),
('AT0008', 'BA3000008A', 'AAAAAAAAAAAAAABA3000008A', 'apTag,中文名稱1', 'aptag'),
('AT0009', 'BB3000008B', 'AAAAAAAAAAAAAABB3000008B', 'apTag,中文名稱1', 'aptag'),
('AT0010', 'BC3000008C', 'AAAAAAAAAAAAAABC3000008C', 'apTag,中文名稱1', 'aptag'),
('AT0011', 'BD3000008D', 'AAAAAAAAAAAAAABD3000008D', 'apTag,中文名稱1', 'aptag'),
('AT0012', 'BE3000008E', 'AAAAAAAAAAAAAABE3000008E', 'apTag,中文名稱1', 'aptag'),
('AT0013', 'BF3000008F', 'AAAAAAAAAAAAAABF3000008F', 'apTag,中文名稱1', 'aptag'),
('AT0014', 'DF300000AF', 'AAAAAAAAAAAAAADF300000AF', 'apTag,中文名稱1', 'aptag'),
('AT0015', '3330000FF3', 'AAAAAAAAAAAAAA3330000FF3', 'apTag,中文名稱1', 'aptag'),
('AT0016', 'E8300000B8', 'AAAAAAAAAAAAAAE8300000B8', 'apTag,中文名稱1', 'aptag'),
('AT0017', 'E7300000B7', 'AAAAAAAAAAAAAAED300000BD', 'apTag,中文名稱1', 'aptag'),
('AT0018', 'EA300000BA', 'AAAAAAAAAAAAAAEA300000BA', 'apTag,中文名稱1', 'aptag'),
('AT0019', 'ED300000BD', 'AAAAAAAAAAAAAAED300000BD', 'apTag,中文名稱1', 'aptag'),
('AT0020', 'E9300000B9', 'AAAAAAAAAAAAAAE9300000B9', 'apTag,中文名稱1', 'aptag'),
('AT0021', 'AE3000007E', 'AAAAAAAAAAAAAAAE3000007E', 'apTag,中文名稱1', 'aptag');

-- --------------------------------------------------------

--
-- 資料表結構 `activetagid_binds`
--

CREATE TABLE `activetagid_binds` (
  `aid` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `ard` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `activetagid_binds`
--

INSERT INTO `activetagid_binds` (`aid`, `ard`, `description`) VALUES
('AT0014', 'AR0001', 'Tag.description'),
('AT0014', 'AR0003', 'Tag.description'),
('AT0015', 'AR0001', 'Tag.description'),
('AT0015', 'AR0002', 'Tag.description'),
('AT0015', 'AR0003', 'Tag.description'),
('AT0015', 'AR0004', 'Tag.description'),
('AT0016', 'AR0001', 'Tag.description'),
('AT0016', 'AR0002', 'Tag.description'),
('AT0016', 'AR0003', 'Tag.description'),
('AT0016', 'AR0004', 'Tag.description'),
('AT0017', 'AR0001', 'Tag.description'),
('AT0017', 'AR0002', 'Tag.description'),
('AT0017', 'AR0003', 'Tag.description'),
('AT0017', 'AR0004', 'Tag.description'),
('AT0018', 'AR0001', 'Tag.description'),
('AT0018', 'AR0002', 'Tag.description'),
('AT0018', 'AR0003', 'Tag.description'),
('AT0018', 'AR0004', 'Tag.description'),
('AT0019', 'AR0001', 'Tag.description'),
('AT0019', 'AR0002', 'Tag.description'),
('AT0019', 'AR0003', 'Tag.description'),
('AT0019', 'AR0004', 'Tag.description'),
('AT0020', 'AR0001', 'Tag.description'),
('AT0020', 'AR0002', 'Tag.description'),
('AT0020', 'AR0003', 'Tag.description'),
('AT0021', 'AR0005', 'Tag.description');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `activereaders`
--
ALTER TABLE `activereaders`
  ADD PRIMARY KEY (`ARSN`);

--
-- 資料表索引 `activetagids`
--
ALTER TABLE `activetagids`
  ADD PRIMARY KEY (`ATSN`);

--
-- 資料表索引 `activetagids_t1`
--
ALTER TABLE `activetagids_t1`
  ADD PRIMARY KEY (`ATSN`) USING BTREE;

--
-- 資料表索引 `activetagid_binds`
--
ALTER TABLE `activetagid_binds`
  ADD PRIMARY KEY (`aid`,`ard`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
