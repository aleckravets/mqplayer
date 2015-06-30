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
  CONSTRAINT `FK_account_service_id` FOREIGN KEY (`service`) REFERENCES `service` (`id`),
  CONSTRAINT `FK_account_user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `playlist` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `userId` bigint NOT NULL,
  CONSTRAINT `FK_playlist_user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `record` (
  `service` varchar(10) NOT NULL,
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `playlistId` bigint NOT NULL,
  CONSTRAINT `FK_record_playlist_id` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`),
  CONSTRAINT `FK_record_service_id` FOREIGN KEY (`service`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert service
  select 'drive' union
  select 'dropbox';

insert user select 1;

insert account (service, email, token, userid)
  select 'drive', 'alec.kravets@gmail.com', '123', 1;

insert playlist(id, name, userId)
select 1, 'Led Zeppelin', 1;

insert record(service, id, name, url, playlistId)
select 'drive', '1', 'Good times, bad times', 'http://drive.com/good-times', 1 union
select 'drive', '2', 'Babe, I\'m gonna quite you..', 'http://drive/babe', 1;