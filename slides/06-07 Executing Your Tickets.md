# Executing Your Tickets

<CommitMap packageManager="npm">
  <Commit id="implement-skill">Start the lesson: the `/implement`, `/tdd` and `/code-review` skills added</Commit>
  <Commit id="analytics-quiz-and-geography">See my solution: all five tickets implemented, up to quiz pass rates and revenue by country</Commit>
</CommitMap>

We've got our [spec](https://www.aihero.dev/ai-coding-dictionary/spec) and [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket). Now we need to actually implement them.

There are three [skills](https://www.aihero.dev/ai-coding-dictionary/skill) that handle this: `/implement`, `/tdd`, and `/code-review`. They work together to build features, write tests first, and review the work before committing.

Let's look at how they fit together.

![The /implement skill file open in the editor](https://res.cloudinary.com/total-typescript/image/upload/v1785750677/ai-hero-images/ruazusamecb6lqbzo7vk.png)

## The `/implement` Skill

The `/implement` skill is the orchestrator. It delegates most of its work to the other two skills.

Here's what it does:

- Implement the work described in the spec or tickets
- Use `/tdd` where possible, at pre-agreed seams
- Run [typechecking](https://www.aihero.dev/ai-coding-dictionary/automated-check) regularly, single test files regularly, full test suite once at the end
- Once done, use `/code-review` to review the work
- Commit your work to the current branch

It's very simple. The real work happens in `/tdd` and `/code-review`.

![The /tdd skill file showing the TDD workflow](https://res.cloudinary.com/total-typescript/image/upload/v1785750678/ai-hero-images/zkusvjlpu0qiarzrbzci.png)

## The `/tdd` Skill

The `/tdd` skill is where the quality comes from. [Agents](https://www.aihero.dev/ai-coding-dictionary/agent) do their best work when they have the most feedback, and TDD is a great technique for that.

You write the unit test for the feature first, then implement it. The test gives the agent immediate feedback on whether the implementation is correct.

The skill includes:

- What a good test is - tests verify behavior through public interfaces, not implementation details
- Advice on mocking and tests
- What seams are - the public boundary you test at
- What bad tests are - implementation-coupled, tautological, or horizontal slicing
- Rules of the loop - red before green, one slice at a time, refactoring belongs in review

### Test Only at Pre-Agreed Seams

A **seam** is the public boundary you test at. Tests live at seams, never against internals.

Before writing any test, you write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam.

This keeps testing effort on the critical paths and complex logic instead of every edge case.

### Tautological Tests

One anti-pattern worth calling out: **tautological tests**. These are tests where the assertion recomputes the expected value the way the code does.

For example: `expect(add(a, b)).toBe(a + b)`. The test passes by construction and can never disagree with the code.

Expected values must come from an independent source of truth - a known-good literal, a worked example, the spec.

![The /code-review skill file open in the editor](https://res.cloudinary.com/total-typescript/image/upload/v1785750679/ai-hero-images/nvg72btkhpsllth4qcqp.png)

## The `/code-review` Skill

The `/code-review` skill does a two-axis review of the diff between `HEAD` and a fixed point you supply.

It runs two [reviews](https://www.aihero.dev/ai-coding-dictionary/automated-review) in parallel [sub-agents](https://www.aihero.dev/ai-coding-dictionary/subagent):

- **Standards** - does the code conform to this repo's documented coding standards?
- **Spec** - does the code faithfully implement the originating issue / PRD / spec?

### Why Two Axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing - **Standards pass, Spec fail**
- Code that does exactly what the issue asked but breaks the project's conventions - **Spec pass, Standards fail**

Reporting them separately stops one axis from masking the other.

### The Standards Sub-Agent

The Standards sub-agent gets:

- The full diff command and commit list
- The list of standards-source files found in the repo
- A smell baseline from *Refactoring* - Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, and others

It reports every place the diff violates a documented standard, and any baseline smell it spots. Documented-standard breaches can be hard violations, but baseline smells are always judgement calls.

### The Spec Sub-Agent

The Spec sub-agent gets:

- The diff command and commit list
- The path or fetched contents of the spec

It reports:

- Requirements the spec asked for that are missing or partial
- Behavior in the diff that wasn't asked for (scope creep)
- Requirements that look implemented but where the implementation looks wrong

This second pass massively increases the quality of the output. It often goes and fixes the really bad stuff itself.

![GitHub issue showing the spec and its sub-issues](https://res.cloudinary.com/total-typescript/image/upload/v1785750679/ai-hero-images/s8u0bujduvuexgkqsdze.png)

## Context Management

There's a debate: do you review after all tickets are complete, or review individual tickets against the spec?

For this lesson, we're going to review each individual ticket. But sometimes you'll just do it right at the end.

### Clearing vs. Compacting

Once you finish the planning phase, you need to decide: [**clear**](https://www.aihero.dev/ai-coding-dictionary/clearing) or [**compact**](https://www.aihero.dev/ai-coding-dictionary/compaction)?

The spec and tickets stay outside of [context](https://www.aihero.dev/ai-coding-dictionary/context). They're in documents, so the conversation history is now disposable. It's just a more verbose version of the documents you already have.

If you **compact**, the next [session](https://www.aihero.dev/ai-coding-dictionary/session) might not have to do so much exploration because it should already have the right context for it.

However, it's just cheaper and faster to **clear**. That way you're going to start your new session with the maximum of the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone).

For this lesson, we're at ~90k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) after planning. The planning context is now disposable because it's been encoded into the spec and the tickets. So we're going to clear it.

![Context meter showing 90k tokens used](https://res.cloudinary.com/total-typescript/image/upload/v1785750680/ai-hero-images/ilqd7fnypw0klo7bwk10.png)

## Steps To Complete

### Set Up the Skills

- [ ] Run `npm run reset` to reset to the `implement-skill` lesson commit

This adds the `/implement`, `/tdd`, and `/code-review` skills to your `.agents/skills` directory.

- [ ] Open `.agents/skills/implement/SKILL.md` and review it

Notice how simple it is. It delegates to `/tdd` and `/code-review`.

- [ ] Open `.agents/skills/tdd/SKILL.md` and review the TDD workflow

Pay attention to:

- The "What a good test is" section
- The "Seams - where tests go" section
- The anti-patterns: implementation-coupled, tautological, horizontal slicing
- The rules of the loop: red before green, one slice at a time

- [ ] Open `.agents/skills/code-review/SKILL.md` and review the two-axis review

Notice how it runs two sub-agents in parallel - one for Standards, one for Spec.

### Implement the First Ticket

- [ ] Open your spec issue on GitHub and scroll to the first sub-issue

The first sub-issue should be unblocked and ready to start.

- [ ] Copy the link to the first sub-issue

Right-click the issue link and copy the URL.

- [ ] In your agent, run `/implement` with the issue URL as the argument

```
/implement <issue-url>
```

This will kick off the implementation. The agent will:

1. Use `/tdd` to write tests first, then implement the feature
2. Run typechecking and tests regularly
3. Use `/code-review` to review the work
4. Commit the work to the current branch

- [ ] Watch the agent work through the implementation

You'll see it:

- Propose test seams and confirm them with you
- Write failing tests (red)
- Implement the feature (green)
- Run `/code-review` to catch issues
- Fix any issues the review found
- Commit the work

### Review and Close the Ticket

- [ ] Review the code review output

The agent will show you both the Standards review and the Spec review. Check that:

- No documented standards were violated
- No baseline smells were introduced
- All requirements from the spec were implemented
- No scope creep snuck in

- [ ] Close the first sub-issue on GitHub

This is good hygiene. Once you close the first one, the second one will be unblocked.

You can do this manually, or get your agent to do it for you.

### Decide: Clear, Compact, or Continue

- [ ] Check your [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) usage in your agent

Look at the token count in the status line.

- [ ] Decide whether to clear, compact, or continue

If you're at ~90k tokens or higher, consider clearing. The spec and tickets are outside of context, so the conversation history is now disposable.

If you're under that, you might be able to continue to the next ticket.

- [ ] If you decide to clear, clear the context and start a fresh session for the next ticket

If you decide to compact, the next session might not have to do so much exploration.

If you decide to continue, move on to the next ticket immediately.

### Implement the Remaining Tickets

- [ ] Repeat the process for each remaining sub-issue

For each ticket:

1. Copy the issue URL
2. Run `/implement <url>`
3. Watch the agent work
4. Review the code review output
5. Close the ticket
6. Decide whether to clear, compact, or continue

### QA the Implementation

- [ ] Once all tickets are complete, run the app locally

Start your dev server and navigate to the analytics dashboard.

- [ ] Verify all features work as specified

Check that each feature from the spec is present and working correctly.

- [ ] Check for errors in the console

Open your browser's developer console and verify no errors appear.

- [ ] Verify the UI looks correct

Ensure the analytics dashboard displays properly and matches the design.

- [ ] Verify the analytics dashboard shows the expected data

Check that the data displayed makes sense and matches what you'd expect from the seed data.
