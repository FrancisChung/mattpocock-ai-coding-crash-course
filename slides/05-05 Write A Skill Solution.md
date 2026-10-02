# Write A Skill Solution

<CommitMap packageManager="npm">
  <Commit id="migration-steps-doc">Start the lesson: the migration steps in `docs/database-migrations.md` behind a pointer</Commit>
  <Commit id="migration-steps-skill">See my solution: the `database-migrations` skill, plus the `pricePaid` to `amountPaid` rename that tests it</Commit>
</CommitMap>

I've sent off a dummy request here just saying "Hello" to see the system set up. Let's go into the logs and check out the `AGENTS.md` file.

We can see the contents of `CLAUDE.md` inside the request log. It just has a little pointer there pointing to the database migrations documentation.

![CLAUDE.md contents showing the database migrations pointer](https://res.cloudinary.com/total-typescript/image/upload/v1785242252/ai-hero-images/s1vmk0zd9peumcl9tnb6.png)

If we search for "skills", we notice we've only got the `grilling` and `writing-for-agents` [skills](https://www.aihero.dev/ai-coding-dictionary/skill) available in the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window). That's because the other two skills in the repo have `disable-model-invocation: true` set in their frontmatter, so the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) can't call them on its own.

![Skills list showing only grilling and writing-for-agents](https://res.cloudinary.com/total-typescript/image/upload/v1785242253/ai-hero-images/zsute8bxbbpu1222xvq7.png)

If we look for the Skill [tool](https://www.aihero.dev/ai-coding-dictionary/tool), which is defined above, we can see how it works. Once the agent decides it needs to go and find a skill file, it's going to invoke the Skill tool with the name of that file. Then the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) will go and resolve where the actual `SKILL.md` file is.

![Skill tool definition in the request log](https://res.cloudinary.com/total-typescript/image/upload/v1785242254/ai-hero-images/jh0j6lsuktgyhizqqksy.png)

## Making the move

Let's actually go ahead and make the move. I'm going to dictate into Claude Code what I want.

```
I'd like you to take the documentation on database migrations and move it
into its own skill project based in this repo.
```

As a little experiment, I'm not going to manually invoke the writing-for-agents skill - I'm just going to leave it and see if it does it itself.

And there we go. The `writing-for-agents` skill has been invoked here. It's actually loading up the skill into its context window.

![writing-for-agents skill being invoked](https://res.cloudinary.com/total-typescript/image/upload/v1785242255/ai-hero-images/nypybox4u31atla8m1da.png)

It's now gone ahead and created the skill inside `.agents`. It's under the database migrations folder, and we've got `SKILL.md` that looks like our original `AGENTS.md` did.

![New database-migrations skill folder with SKILL.md](https://res.cloudinary.com/total-typescript/image/upload/v1785242256/ai-hero-images/k7k4mln6am4ylflrwynu.png)

Now it's going ahead and removing the old pointer, so `AGENTS.md` is now completely empty. The docs file has been removed too.

## Testing with a second session

So now, if I [clear the context](https://www.aihero.dev/ai-coding-dictionary/clearing), I'm going to create another dummy message. Let's go into the request logs and we should be able to see that things have changed.

Here we go. The following skills are now available. You can see "Database schema changes - generate the migration, update the seed, reseed. Use when editing the schema, when adding or altering a table column or enum, or when npm run db:seed fails to start."

![Skills list now showing database-migrations skill](https://res.cloudinary.com/total-typescript/image/upload/v1785242257/ai-hero-images/ejmyfdbcmelz7o8b8tps.png)

So we have a [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) here for a skill. And now all we need to do to get this to work with our colleagues' skills is just go up to the top here, zip up the database-migrations folder and send it off to them.

## The schema change test

For this [session](https://www.aihero.dev/ai-coding-dictionary/session)'s schema change, let's go into purchases and I'm going to change `pricePaid` to `amountPaid`.

![Schema file showing the pricePaid field](https://res.cloudinary.com/total-typescript/image/upload/v1785242257/ai-hero-images/zvg7zmqtjryjqaxldcth.png)

We need to change the name of a property. So in purchases, instead of `pricePaid`, I want it to be `amountPaid`.

Looking at the original schema:

```ts
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  pricePaid: integer("price_paid").notNull(),
  country: text("country"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
```

And now hopefully this will invoke the correct skill at the right moment. Oh, and there it goes immediately.

![database-migrations skill being invoked immediately](https://res.cloudinary.com/total-typescript/image/upload/v1785242258/ai-hero-images/mfxe02pces41arzptu5x.png)

It should now go through and do the rest of the work that it needs to.

Looks like it needs a TTY, an interactive terminal. So I'm going to grab what it sent me and I'm going to run `npm run db:generate` myself.

```
npm run db:generate
```

We are renaming this, so I'm going to select rename column and then I'll go back and tell it that I was able to complete it.

![Interactive terminal prompting for rename column selection](https://res.cloudinary.com/total-typescript/image/upload/v1785242259/ai-hero-images/hxpspvkr4ebnrftnc8iy.png)

Yep, done.

And just like before, it now understands that it has reseed and verify. It's using the same terms as in our skill.

I'm feeling pretty confident that is going to be okay.

## The portable pointer

So there we go. Skills are just the same as our doc and pointer approach, except they're just more portable.

We really swapped around the context pointer. Instead of it being in `CLAUDE.md`, it now turned up in the skills list instead.

Both times we were able to successfully call it and pull it out at the right moment because we had a well-written description.

If we wanted to avoid this context load cost, then we could just make it a user-invoked skill instead - pull it out of here and then rely on the user to call it at the right moment.

But for me, it makes sense here to just make this part of the application. Make this part of the [environment](https://www.aihero.dev/ai-coding-dictionary/environment) that the agent operates in. And I think it's a pretty nice skill.

So nice work on your first skill. I'll see you in the next one.

