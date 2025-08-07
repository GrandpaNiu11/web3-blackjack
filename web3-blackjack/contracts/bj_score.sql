/*
 Navicat Premium Dump SQL

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50723 (5.7.23-log)
 Source Host           : localhost:3306
 Source Schema         : web3_balckjak

 Target Server Type    : MySQL
 Target Server Version : 50723 (5.7.23-log)
 File Encoding         : 65001

 Date: 07/08/2025 11:54:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bj_score
-- ----------------------------
DROP TABLE IF EXISTS `bj_score`;
CREATE TABLE `bj_score`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mataMaskId` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `score` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bj_score
-- ----------------------------
INSERT INTO `bj_score` VALUES (2, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', '0');
INSERT INTO `bj_score` VALUES (3, '0x3BD0f411081292989F0274b7fdFca145c8b2C311', '500');
INSERT INTO `bj_score` VALUES (4, '0xc1F16aEf8e698467E797B7e4E2992D10852D80fF', '500');
INSERT INTO `bj_score` VALUES (5, '0x1EF85dB5743944Bd1e172Ef747961B9d014F6F22', '500');

SET FOREIGN_KEY_CHECKS = 1;
