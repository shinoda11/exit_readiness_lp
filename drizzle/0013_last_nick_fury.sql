CREATE TABLE `notyetFollowup` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`fitGateResponseId` int NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notyetFollowup_id` PRIMARY KEY(`id`)
);
