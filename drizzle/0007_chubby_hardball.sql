CREATE TABLE `passOnboarding` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`compareViewed` boolean NOT NULL DEFAULT false,
	`leverChanged` boolean NOT NULL DEFAULT false,
	`memoGenerated` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passOnboarding_id` PRIMARY KEY(`id`),
	CONSTRAINT `passOnboarding_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `passSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`purchaseDate` timestamp NOT NULL DEFAULT (now()),
	`expiryDate` timestamp NOT NULL,
	`price` int NOT NULL,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passSubscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessionCheckouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`checkoutToken` varchar(64) NOT NULL,
	`checkoutUrl` varchar(512) NOT NULL,
	`expiryDate` timestamp NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessionCheckouts_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessionCheckouts_checkoutToken_unique` UNIQUE(`checkoutToken`)
);
--> statement-breakpoint
CREATE TABLE `upgradeRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`requestDate` timestamp NOT NULL DEFAULT (now()),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`approvedAt` timestamp,
	`checkoutUrl` varchar(512),
	`checkoutExpiry` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `upgradeRequests_id` PRIMARY KEY(`id`)
);
