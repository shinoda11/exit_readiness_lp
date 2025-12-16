CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`currentHousing` enum('賃貸','持ち家') NOT NULL,
	`purchaseStatus` enum('検討中','未検討','購入済') NOT NULL,
	`incomeRange` varchar(64),
	`propertyRange` varchar(64),
	`workStyle` varchar(64),
	`interests` text,
	`oneOnOneInterest` boolean DEFAULT false,
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`utmContent` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`)
);
