# The /implement-spec Skill Solution

<CommitMap packageManager="npm">
  <Commit id="implement-spec-skill">Start the lesson: the `/implement-spec` skill added and the analytics dashboard removed, back at spec #4 and its tickets</Commit>
  <Commit id="spec-analytics-groundwork">After ticket #5: indexes, the seed rewrite and the progress prefactor</Commit>
  <Commit id="spec-analytics-page">After ticket #6: the page shell and revenue</Commit>
  <Commit id="spec-analytics-audience">After ticket #7: buyers, the leaderboard, questions and ratings</Commit>
  <Commit id="spec-analytics-course-detail">After ticket #8, built alongside #7: course progress and the drop-off funnel</Commit>
  <Commit id="spec-analytics-quiz-and-geography">After ticket #9: quiz pass rates and the country revenue mix</Commit>
  <Commit id="spec-analytics-review-fixes">After code review: the fixes from `/code-review`, with the route split into panels</Commit>
</CommitMap>

The session starts with a single prompt:

```
/implement-spec #4
```

The agent reads spec issue #4 ("Instructor Analytics Dashboard") and its sub-issues, then builds a task graph.

![Agent output showing the task graph for issue #4](https://res.cloudinary.com/total-typescript/image/upload/v1791197439/ai-hero-images/uqljs61o2ogqlqo78da8.png)

The task graph it produces looks like this:

| Order | Ticket | Depends on |
|---|---|---|
| 1 | #5 - groundwork: indexes, seed, prefactor | none |
| 2 | #6 - page shell and revenue | #5 |
| 3 | #7 - buyers, leaderboard, questions, ratings | #6 |
| 3 | #8 - course selector, progress, drop-off funnel | #6 |
| 4 | #9 - quiz pass rates and country revenue mix | #8 |

So #5 has to be done before #6, then #7 and #8 can be done together, and #8 leads on to #9.

## Two Subagents, Not One

The agent then kicks off two subagents at the same time:

- An implementer for ticket #5 (the first item on the frontier)
- An exploration agent to research the codebase for tickets #6–#9

This is a slightly unusual decision. The more deterministic approach would be to run exploration for every ticket first, then feed those notes into each implementer. Here the agent chose to implement #5 immediately (since it's simple enough) while the exploration agent works in parallel on the rest.

> This is one of the negatives of using an agent to run this stuff instead of a deterministic script. Agents make strange decisions sometimes, and if you had this in a deterministic script, it would work the same every time.

## What the Exploration Agent Produces

The exploration agent writes its output to `spec-4-notes/codebase.md`, a file outside the repo, so implementers can read it without touching the codebase.

![The spec-4-notes/codebase.md file open on screen, showing detailed file paths and notes](https://res.cloudinary.com/total-typescript/image/upload/v1791197441/ai-hero-images/iphncsy1zqfxrxrxv4oc.png)

The notes cover:

- Routing and access helpers
- Sidebar structure and nav item shape
- UI primitives and existing chart components
- Existing services to reuse
- Schema facts, test patterns, and common pitfalls

One notable finding: the repo history has an earlier analytics build, but the lesson's reset commit removed it on purpose. The exploration agent flagged this so implementers wouldn't copy it.

The notes are packed with exact file paths and line numbers. This matters because it means each implementer is much less likely to invent its own solutions, since it already knows what's there to reuse.

## The Merge Loop

Once ticket #5's implementer finishes, a merger subagent pulls it into the integration branch with no conflicts. Then #6 starts automatically.

![Agent output showing ticket #6 kicked off automatically after #5 merged](https://res.cloudinary.com/total-typescript/image/upload/v1791197442/ai-hero-images/bonhsllvz3zcr5c8gxyb.png)

The loop for each ticket looks like this:

1. Implementer runs in its own worktree on a branch like `ticket-5`
2. Merger subagent merges that branch into `spec-4-instructor-analytics`
3. Typecheck and tests pass
4. Orchestrator starts the next ticket on the frontier

After #6 merges, the frontier has two tickets: #7 and #8. The agent starts both at the same time.

## Parallel Implementation

Tickets #7 and #8 run simultaneously, each in its own worktree.

![Two implement agents running in parallel for tickets #7 and #8](https://res.cloudinary.com/total-typescript/image/upload/v1791197443/ai-hero-images/c5puvl6dw4rwwuxkl6tn.png)

The orchestrator warned each implementer about the other one. For example, the #7 implementer was told:

> Ticket #8 is being built at the same time in another worktree. It edits the Course detail tab and also adds to `analyticsService.ts` and its test file. To reduce merge conflicts, keep your changes to the Overview side.

Both #7 and #8 merged with zero conflicts. This kind of parallel work can feel risky, but agents are good at resolving merge conflicts. As a result, it's worth being more aggressive with parallelization than you might expect.

After #8 merges, ticket #9 starts. It runs for only about three minutes before reporting back.

## Code Review

With all tickets merged, the agent runs the `code-review` skill across the entire integration branch. Two reviewers run in parallel:

- **Standards review** - checks conventions, patterns and consistency
- **Spec review** - checks that the build matches what the spec asked for

The combined findings included 11 standards judgement calls and 6 spec findings. Key issues:

- `analyticsService.ts` used object parameters while other services use positional parameters
- The country panel wasn't reading `pppEnabled`, so the discount figure was too high
- The loading skeleton only matched the Overview tab, not the Course detail tab
- The route file had grown to 1,218 lines

All fixes went to a single `review-fixes` branch. After those landed, 706 tests passed and typecheck was clean.

## Context Window Usage

It's worth keeping an eye on the orchestrator's context window. Because it's long-running and context sensitive, it accumulates tokens across the whole session while the implementer subagents mostly reset between tasks.

During the session, the top-level token count was:

- Mid-session: **85.4k tokens**
- End of session: **93.7k tokens**

One option to consider: running the orchestrator at a lower effort level. The orchestrator's job is fairly small, just following steps and walking through a task graph. The subagents doing the actual implementation are the ones that benefit from higher effort. Keeping the orchestrator lean helps preserve its context budget across a long run.

## Checking the Result

After the run completes, the app gets a quick browser check. Switching to a user and opening the dashboard reveals an error: the database hasn't been seeded yet.

The fix is to seed the database:

```
npm run db:seed
```

After reloading, the Analytics page is live:

![The analytics dashboard showing revenue charts and instructor data](https://res.cloudinary.com/total-typescript/image/upload/v1791197444/ai-hero-images/qunmcimd3subvxurpoqd.png)

- Revenue over time chart
- All instructors listed (Sarah Chen, Marcus Johnson, and others)
- A Course detail tab with breakdown by course

## The Tradeoff: Agent vs. Deterministic Loop

The `/implement-spec` skill works well as a proof of concept. You invest time upfront in planning and spec-writing, then hand the whole thing to the agent and come back to a large chunk of completed work.

| | `/implement-spec` | Deterministic loop |
|---|---|---|
| Consistency | Varies, agent makes its own decisions | Same every time |
| Cost | Spends orchestrator context window | Free (CPU only) |
| Setup | Very easy to adopt | Requires building the loop |
| Parallelization | Built in | Manual |

If you want to slow the tempo down, to stay within daily limits for example, you can tell the agent to work sequentially instead of in parallel. That's a simple instruction change.

The `/implement-spec` skill sits in a useful middle ground: easier to get started than building a deterministic loop yourself, and still capable of getting a large amount of work done unattended.

