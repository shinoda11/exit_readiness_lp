CREATE TABLE `fitGateResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320),
	`q1DecisionDeadline` varchar(64),
	`q2HousingStatus` varchar(64),
	`q3PriceRange` varchar(64),
	`q4IncomeRange` varchar(64),
	`q5AssetRange` varchar(64),
	`q6NumberInputTolerance` varchar(128),
	`q7CareerChange` varchar(128),
	`q8LifeEvent` varchar(128),
	`q9CurrentQuestion` varchar(255),
	`q10PreferredApproach` varchar(128),
	`q11PrivacyConsent` boolean NOT NULL,
	`q12BudgetSense` varchar(64),
	`invitationToken` varchar(64),
	`judgmentResult` enum('prep','pass','session'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fitGateResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitationTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`usedBy` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`usedAt` timestamp,
	CONSTRAINT `invitationTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitationTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `prepModeSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prepModeSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `prepModeSubscribers_email_unique` UNIQUE(`email`)
);
