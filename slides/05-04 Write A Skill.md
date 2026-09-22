# Write A Skill

<CommitMap packageManager="npm">
  <Commit id="migration-steps-doc">Start the lesson: the migration steps in `docs/database-migrations.md` behind a pointer</Commit>
  <Commit id="migration-steps-skill">See my solution: the doc converted into a `database-migrations` skill</Commit>
</CommitMap>

You've built documentation for database migrations and pointed your [agents](https://www.aihero.dev/ai-coding-dictionary/agent) to it with `AGENTS.md`. But a pointer leaves you with a problem: every agent has to fetch the doc when it might need it.

[Skills](https://www.aihero.dev/ai-coding-dictionary/skill) solve this. A skill is a pointer, but packaged. Its name and description tell the agent whether it's relevant, and the body loads only when the agent reaches for it.

This lesson turns your doc-and-pointer into a skill. You can do it by hand or let the agent handle it with the `writing-for-agents` skill. Then you'll use the request logger to confirm the skill gets invoked at exactly the right moment.

## Steps To Complete

### Set Up The Request Logger

- [ ] Run `npm run request-logger`

This starts a proxy server that logs every request your agent sends. It asks which coding agent you use, listens on `http://localhost:8787`, and prints the exact command to start that agent through it.

- [ ] In another terminal, copy and paste the printed command to run the agent through the proxy

- [ ] Send a dummy request

Type `Hello!` to see what gets loaded before any work happens.

- [ ] Check the log in `request-logger/logs`

Open the markdown file that was created. Look for:

- The contents of `CLAUDE.md`, which shows the pointer to `docs/database-migrations.md`
- The skills list (search for "skills"). You should see only `grilling` and `writing-for-agents` available, because the other skills have `disable-model-invocation: true` set
- The Skill [tool](https://www.aihero.dev/ai-coding-dictionary/tool) definition, which shows how the agent invokes skills by name and the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) resolves the `SKILL.md` file

This is your baseline - what the wire looks like before the conversion.

### Convert The Doc Into A Skill

- [ ] Ask the agent to convert the database migrations doc into a skill

You can dictate something like:

```
I'd like you to take the documentation on database migrations and move it
into its own skill project based in this repo.
```

Don't manually invoke the `writing-for-agents` skill. Let the agent decide whether it needs it.

- [ ] Watch what happens in the request logger

The agent should invoke the `writing-for-agents` skill, load it into context, then create the new skill in `.agents/skills/database-migrations/`.

- [ ] Verify the skill was created

Check that:

- `.agents/skills/database-migrations/SKILL.md` exists with frontmatter containing a name and description
- The skill body contains the migration steps from the original doc
- The pointer line was removed from `AGENTS.md`
- The original `docs/database-migrations.md` file was deleted

### Test The Skill

- [ ] [Clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the agent's [context](https://www.aihero.dev/ai-coding-dictionary/context) and send another dummy message

This creates a fresh log showing what changed.

- [ ] Check the new log in `request-logger/logs`

Search for "skills" again. You should now see the `database-migrations` skill in the list with its description - the [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) moved from `CLAUDE.md` to the skills list.

- [ ] Run `npm run reset` to clear the database

- [ ] Ask the agent to make a schema change

For example, rename `pricePaid` to `amountPaid` in the `purchases` table:

```
In the purchases table, change pricePaid to amountPaid.
```

- [ ] Watch the agent invoke the skill immediately

The `database-migrations` skill should be invoked the moment the agent recognizes it needs the migration steps.

- [ ] If the agent hits an interactive prompt, complete it manually

For example, `npm run db:generate` might need you to confirm a column rename. Run the command yourself and tell the agent it's done.

- [ ] Verify the agent follows the skill's steps

It should use the same terms from the skill: reseed, verify, typecheck.

- [ ] Compare what changed on the wire

The pointer moved from `CLAUDE.md` to the skills list, but the agent's behaviour stayed the same. The packaging changed, the guidance didn't.


