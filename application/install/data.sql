
CREATE TABLE IF NOT EXISTS `tn_account` (
  `uid` smallint(6) unsigned NOT NULL,
  `pid` smallint(6) unsigned NOT NULL,
  `level` tinyint(1) NOT NULL,
  `sign` varchar(50) DEFAULT NULL,
  KEY `groupId` (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;