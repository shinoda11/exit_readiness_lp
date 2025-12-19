CREATE TABLE `jobLocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobName` varchar(64) NOT NULL,
	`lockedAt` timestamp NOT NULL DEFAULT (now()),
	`lockedBy` varchar(255),
	CONSTRAINT `jobLocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `jobLocks_jobName_unique` UNIQUE(`jobName`)
);
