CREATE TABLE `account` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `playlist` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `accountId` bigint NOT NULL,
  CONSTRAINT `FK_playlist_account_id` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `record` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `playlistId` bigint,
  CONSTRAINT `FK_record_playlist_id` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;