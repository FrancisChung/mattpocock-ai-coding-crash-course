# Steering With A Pointer

<CommitMap packageManager="npm">
  <Commit id="pushed-migration-steps">Start the lesson: the migration steps pushed into `AGENTS.md`, with the `/writing-for-agents` skill available</Commit>
  <Commit id="migration-steps-doc">See my solution: the steps moved into `docs/database-migrations.md` behind a pointer</Commit>
</CommitMap>

The database schema is worth special care in this project. Whenever you change the schema, add a table, modify a column, there's a hidden second step. You also have to update `../scripts/seed.ts`, the script that fills the database with its starting data.

If you change the schema and forget the seed script, the next reseed leaves you with data that no longer matches the shape. The type safety you get from Drizzle stops at the schema, the raw SQL in the `DROP TABLE IF EXISTS` block has no guard rails, so mismatches slip through silently and break things downstream.

There's a second thing worth saying. In this project, **the database is disposable**. It lives on `data.db`, gitignored, holding nothing but seed data. You can migrate freely, throw it away, and reseed from scratch. Those are real constraints, the kind of thing you'd explain to a new teammate on their first day. And **the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) can't know them unless you tell it**, because **they aren't derivable from the code**.

## The Problem

The obvious move is to push all those steps into `AGENTS.md` so the agent always has them. But look at what that costs.

Every request carries the full migration steps. Every [turn](https://www.aihero.dev/ai-coding-dictionary/turn) for the rest of the [session](https://www.aihero.dev/ai-coding-dictionary/session) pays [input tokens](https://www.aihero.dev/ai-coding-dictionary/input-tokens) for a document it doesn't need, right now, maybe the agent is building a UI feature that touches nothing in the database. The steps compete for [attention budget](https://www.aihero.dev/ai-coding-dictionary/attention-budget). Picture a project with ten sets of instructions like this, all pushed into [context](https://www.aihero.dev/ai-coding-dictionary/context). The cost compounds.

## The Doc-Plus-Pointer Pattern

You don't need the steps on every request. You need them **reachable** from every request. Those are different things.

Take the steps out of `AGENTS.md` and give them their own document. Leave one short line in `AGENTS.md`: *when you're changing the database schema, read this doc first*. The context load becomes a single sentence. The steps load only when the agent follows the pointer and needs them.

That's the **doc-plus-pointer** pattern. A [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) is a reference in the agent's context that names some material and encodes the condition for reaching it. It needs two things to work:

- **A stable path** - the agent needs to know where to find it.
- **Clear description** - the agent needs to know when following it is worth it. A bare path is a pointer the agent has no reason to use. Word it the way the task actually presents.

## The /writing-for-agents Skill

Writing a good document for an agent is its own skill. You're going to use the `/writing-for-agents` skill to do it. This [skill](https://www.aihero.dev/ai-coding-dictionary/skill) takes the steps in your head and turns them into a document an agent can follow: clear, ordered, no waffle. It's built exactly for writing `AGENTS.md` and for writing the kind of focused docs that sit behind pointers.

## Steps To Complete

- [ ] Run `npm run reset` to grab the `/writing-for-agents` skill

This will reset the repo to the commit that includes the skill.

- [ ] Open the `/writing-for-agents` skill and read through it

Understand what it's asking for, particularly the section on context pointers and the two loads (context load and cognitive load). This is the vocabulary you'll be using.

- [ ] Create a new `docs/` folder in the repo root

This is where your migration steps doc will live.

- [ ] Use `/writing-for-agents` to move the migration steps out of `AGENTS.md` into a new document called `database-migrations.md` inside the `docs/` folder

The skill will guide you. Ask it to take the steps currently in `AGENTS.md` and restructure them as a standalone document. The doc should stand on its own, it won't have `AGENTS.md` above it, so promote the headings one level.

- [ ] Replace the migration steps in `AGENTS.md` with a single pointer line

The pointer should describe when and why the agent should reach for the document. Something like: "When making a database schema change, consult `docs/database-migrations.md` for the exact steps."

- [ ] Make a small, real schema change to test the pointer

Open an agent and ask it to make a simple change to the schema, maybe add a non-nullable column to an existing table, or add a new field. Watch what happens.

The agent should see your pointer line in `AGENTS.md`, recognize that it's doing a schema change, and pull in the full doc from `docs/database-migrations.md`. It should then follow the steps: update the schema, generate the migration, update `../scripts/seed.ts`, reseed, and typecheck.

- [ ] Verify the change worked

Check that `npm run db:seed` runs without error, that `npm run typecheck` passes, and that the data in the database matches the new schema.

- [ ] Commit your changes and reset the project when you're done

Once you've verified it works, commit to your branch. When you're ready to move on, run `npm run reset` to return to the original state.
