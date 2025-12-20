CREATE TABLE `testSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`currentHousing` enum('賃貸','持ち家') NOT NULL,
	`incomeRange` enum('1000-1500','1500-2000','2000-3000','3000以上') NOT NULL,
	`propertyRange` enum('賃貸継続','6000','8000','1億以上') NOT NULL,
	`goalMode` enum('守り','ゆるExit','フルFIRE視野') NOT NULL,
	`preferredTime` varchar(64),
	`notes` text,
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`utmContent` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `waitlist`;