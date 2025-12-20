ALTER TABLE `passOnboarding` ADD `task1AppOpened` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `passOnboarding` ADD `task2CompareViewed` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `passOnboarding` ADD `task3MemoGenerated` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `passOnboarding` DROP COLUMN `compareViewed`;--> statement-breakpoint
ALTER TABLE `passOnboarding` DROP COLUMN `leverChanged`;--> statement-breakpoint
ALTER TABLE `passOnboarding` DROP COLUMN `memoGenerated`;