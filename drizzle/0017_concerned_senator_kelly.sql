CREATE TABLE `inviteTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`type` enum('PASS') NOT NULL DEFAULT 'PASS',
	`expiresAt` timestamp NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`usedAt` timestamp,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inviteTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `inviteTokens_token_unique` UNIQUE(`token`)
);
