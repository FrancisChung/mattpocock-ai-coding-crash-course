# Database Migrations

<CommitMap>
  <Commit id="try-the-cli">Start the lesson: the repo with the CLI check applied, before any schema change</Commit>
  <Commit id="make-a-schema-change">Follow along: the `notes` column added to `schema.ts`, plus its migration</Commit>
</CommitMap>

This lesson exists because a lot of folks who've taken this course before have run into difficulties on this point. If you're already familiar with what a database is and the difference between a database and source code, you can skip this lesson, but it's pretty essential information, so it's worth covering in depth.

## The Two Units

There are two real units to understand here.

| Unit | What it is | Example |
|---|---|---|
| **Source code** | Files you edit to change the behaviour of your application | `app/db/schema.ts`, `app/components/dev-ui.tsx` |
| **Database** | A separate store of actual data | `data.db` (a file on disk) |

The project uses [SQLite](https://sqlite.org/), and the database is literally just a file on disk called `data.db`. The source code, things like `app/components/course-image.tsx` and `app/components/dev-ui.tsx`, is readable text you can modify to change how the application behaves.

![The file tree showing data.db at the repo root alongside the source code folders](https://res.cloudinary.com/total-typescript/image/upload/v1786014206/ai-hero-images/d8mrvllr88iovnn9vq9w.png)

If we look inside `app/db/schema.ts`, we can see that the source code is actually defining the shape of the database, declaring tables and their columns.

## How Database Migrations Work

There is a directional relationship here:

![Diagram showing the directional relationship between source code and the database, with migrations as the step in between](https://res.cloudinary.com/total-typescript/image/upload/v1786014207/ai-hero-images/bvwx7actgcpdbyxe5zkt.png)

> **The source code defines how the database should look, but you need to manually do something before the database catches up.**

That step is a **database migration**: you manually update the database to match what the schema says it should look like.

The reason this is done manually is because traditionally, the database holds pretty important information: all of your user data, the stuff that's very sacred. In real applications, you need to do a manual migration to synchronise them.

This means your source code and your database need to be versioned together:

- If your source code changes but the database hasn't been migrated to keep up, you'll probably get an error.
- In this project, `app/db/schema.ts` is the source code, and `data.db` is the live state of the database.
- To migrate them, you run:

```
npm run db:migrate
```

## Hands-On Migration Walkthrough

To see this in action, open `app/db/schema.ts` and run `npm run reset` in a fresh terminal. Select the `make-a-schema-change` lesson commit ("Make a Schema Change" in the picker) and reset the current branch.

This makes a very subtle change: it adds a `notes` column to the `courses` table in `schema.ts`.

```diff
  description: text("description").notNull(),
+ notes: text("notes"),
  salesCopy: text("sales_copy"),
```

It has also generated a new migration file inside the `drizzle/` folder, `0003_lean_hex.sql`:

```sql
ALTER TABLE `courses` ADD `notes` text;
```

![The drizzle/ folder showing four migration SQL files](https://res.cloudinary.com/total-typescript/image/upload/v1786014208/ai-hero-images/ryubvk7jelsvsy4nxfis.png)

The `drizzle/` folder is basically the history of all database migrations that have been applied. Reading them newest-to-oldest:

- `0003_lean_hex.sql` - adds `notes` column to `courses` *(just added)*
- `0002_lying_shriek.sql` - adds coupons
- `0001_cynical_sunspot.sql` - adds `github_repo_url` to lessons
- `0000_dizzy_fenris.sql` - the initial migration

The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) is going to be the one responsible for managing these, and they'll grow as the application develops. You won't have to worry too much about them directly.

## Debugging the Schema Mismatch Error

Even this tiny addition is enough to break things if you run the dev server without migrating.

Open `http://localhost:5175` and browse to a specific course. The front page looks fine, but the course detail page errors.

![The course detail page showing an error in the browser](https://res.cloudinary.com/total-typescript/image/upload/v1786014210/ai-hero-images/fjczpgcrhmkkpgp4ucsd.png)

Looking at the terminal, there's a `SqliteError`:

```txt
no such column: notes
```

This is coming from the `getCourseBySlug` function. The schema file has been changed, but `data.db` hasn't been updated to match.

This is something you'll run into a lot when you reset the state of the source code. **`npm run reset` only touches the source code. It doesn't run `db:migrate` for you.**

The fix is to open another terminal and run:

```
npm run db:migrate
```

![Terminal running npm run db:migrate](https://res.cloudinary.com/total-typescript/image/upload/v1786014210/ai-hero-images/s5tl0ldib6t9qhpokjmq.png)

Once that's done, refresh the page and it's working. The `data.db` and the schema are now in sync.

## Breaking and Resetting Your Database

It's also worth saying that you can absolutely break your database at any time. This is **not** production data.

There's a seed script that you ran during the intro to seed the database. Here's what it does:

1. Deletes all the tables
2. Recreates them
3. Adds a bunch of dummy data

The dummy data includes users like the admin Alex Rivera, and instructors Sarah Chen and Marcus Johnson.

This is something the agent might want to update if you're testing certain scenarios and need specific seed data.

## The Flow to Remember

When the agent makes changes to `schema.ts`, you'll need to either get the agent to migrate itself, or migrate manually. This is especially true after running `npm run reset`, as the schema will probably be out of sync with the database.

Here's a quick reference for the three key scripts:

| Command | What it does |
|---|---|
| `npm run db:generate` | Writes a new migration file to `drizzle/` from a changed `schema.ts` |
| `npm run db:migrate` | Applies pending migration files to `data.db` |
| `npm run db:seed` | Wipes and refills the database with dummy data |

After any `npm run reset` that touches `schema.ts`, always run `npm run db:migrate`.
