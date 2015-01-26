CREATE TABLE `user` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `service` (
  `id` varchar(10) PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `account` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `service` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255),
  `userId` bigint NOT NULL,
  UNIQUE KEY `accountId_email` (`service`, `email`),
  CONSTRAINT `FK_account_service_id` FOREIGN KEY (`service`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `playlist` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `userId` bigint NOT NULL,
  CONSTRAINT `FK_playlist_user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `record` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `playlistId` bigint,
  CONSTRAINT `FK_record_playlist_id` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;