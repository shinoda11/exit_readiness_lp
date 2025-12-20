CREATE TABLE `unsubscribe` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`optOut` boolean NOT NULL DEFAULT true,
	`unsubscribedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unsubscribe_id` PRIMARY KEY(`id`),
	CONSTRAINT `unsubscribe_email_unique` UNIQUE(`email`)
);
