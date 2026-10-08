# The /implement-spec Skill

<CommitMap packageManager="npm">
  <Commit id="implement-spec-skill">Start the lesson: the `/implement-spec` skill added and the analytics dashboard removed, back at spec #4 and its tickets</Commit>
  <Commit id="spec-analytics-review-fixes">See my solution: the whole spec built by `/implement-spec`, code review fixes included</Commit>
</CommitMap>

When it comes to implementing a spec, there are three approaches:

| Approach | How it works | Downside |
|---|---|---|
| **Manual loop** | You sit there pressing "implement" on every ticket yourself | You're needed at every point in the loop |
| **Deterministic script** | A script reads each ticket and kicks off the coding agent automatically | Complex to write, optimize and maintain; requires sandboxing |
| **Orchestrator agent** | An agent runs the loop for you, implementing tickets inside subagents | Costs more tokens than a deterministic script |

The deterministic approach is what Sandcastle handles. But it's a power tool - you need to handle sandboxing, write the script, optimize it and maintain it. It's a step beyond what most people need.

The `/implement-spec` skill is the third way. It costs more tokens than a deterministic script, but in practice it works really well - having an agent in the loop helps in certain situations and produces great results. At the end of a run, you get a PR to the repo with the entire spec built.

## What the Skill Does

The `/implement-spec` skill takes the spec and tickets created by `/to-spec` and `/to-tickets` and runs the full implementation loop. Here is what happens under the hood:

| Step | What happens |
|---|---|
| 1 | Reads the spec and tickets to understand the task graph |
| 2 | (Optional) Runs an **exploration subagent** to document the codebase for other subagents |
| 3 | Creates an integration branch |
| 4 | Spins up **implementer subagents** in parallel, each in its own worktree |
| 5 | Merges each completed worktree back to the integration branch via a **merger subagent** |
| 6 | Kicks off new implementer subagents as the ticket frontier expands |
| 7 | Runs `code-review` on the full integration branch once all tickets are done |
| 8 | Closes tickets or marks the draft PR ready for review |
| 9 | Cleans up all worktrees |

Tickets are a **task graph**, not a flat list. Tickets with no blocking dependencies can be worked on simultaneously, each in its own worktree.

The orchestrator agent stays lean by delegating as much as possible to subagents. This keeps its context window small and its decisions sharp throughout a long run.

## Steps To Complete

### Reset and Explore the Skill

- [ ] Run the reset to get to the right starting point

```
npm run reset
```

Pick the `implement-spec-skill` lesson. This does two things: it adds the `/implement-spec` skill, and it removes any existing analytics dashboard code so you're back at the spec-and-tickets stage. After the reset, you'll have the spec (issue #4) and its tickets in the issue tracker, but no dashboard code in the repo.

- [ ] Open `.agents/skills/implement-spec/SKILL.md` and read through it carefully

Pay attention to:
- How the exploration subagent (step 2) is optional
- How each implementer subagent uses its own worktree and calls the `tdd` skill
- How code review only happens once, at the very end

### Run the Skill

- [ ] Find the issue number for your "Instructor Analytics Dashboard" spec in your issue tracker

Do not assume it is `#4` — check your own issue tracker and use the correct number.

- [ ] Invoke the skill in your agent, passing it your spec's issue number

```
/implement-spec #<your-issue-number>
```

- [ ] Watch the run carefully as it progresses

As the agent works, verify it is doing what the skill describes:

- Does it run an exploration subagent before or alongside early tickets?
- Does it kick off multiple implementer subagents in parallel for unblocked tickets?
- Does each implementer subagent use its own worktree?
- Does it run `code-review` only after all tickets are complete?
- Does it clean up worktrees at the end?

This run will take 30-45 minutes and will burn a significant number of tokens. Expect a long wait.

### Verify the Output

- [ ] Once the run completes, check that all tickets have been resolved in the issue tracker

- [ ] Review the integration branch to confirm the full analytics dashboard has been implemented

