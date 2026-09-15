PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_course_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`rating` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_course_reviews`("id", "course_id", "user_id", "rating", "created_at", "updated_at") SELECT "id", "course_id", "user_id", "rating", "created_at", "updated_at" FROM `course_reviews`;--> statement-breakpoint
DROP TABLE `course_reviews`;--> statement-breakpoint
ALTER TABLE `__new_course_reviews` RENAME TO `course_reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `course_reviews_course_user_unique` ON `course_reviews` (`course_id`,`user_id`);