# Write Great Specs With This Skill

<CommitMap packageManager="npm">
  <Commit id="to-spec-skill">Start the lesson: the `/to-spec` skill added</Commit>
</CommitMap>

We now understand why we would want a [spec](https://www.aihero.dev/ai-coding-dictionary/spec). A spec is a destination document. It helps us manage [context](https://www.aihero.dev/ai-coding-dictionary/context) over multiple [sessions](https://www.aihero.dev/ai-coding-dictionary/session), and it gives us somewhere to aim at.

So you're probably asking, how do I go and create one? Well, there is a [skill](https://www.aihero.dev/ai-coding-dictionary/skill) for that.

## The `/to-spec` Skill

The `/to-spec` skill takes the current conversation and codebase understanding and produces a spec. In other words, it's not going to [grill](https://www.aihero.dev/ai-coding-dictionary/grilling) you about the conversation. It's expecting that a grilling session has already happened in the conversation history.

You can pull it in by running:

```txt
npm run reset
```

Then select the **`to-spec-skill`** step from the list, reset the current branch, and the skill will appear in your working tree.

![Running npm run reset and selecting the to-spec-skill step](https://res.cloudinary.com/total-typescript/image/upload/v1785748551/ai-hero-images/qg2hwcj1xnaigeo2wxe9.png)

The skill lives at `.agents/skills/to-spec/SKILL.md`. It's configured with `disable-model-invocation: true`, which means it's a slash command only - Claude will never reach for it on its own.

![The to-spec skill file showing disable-model-invocation configuration](https://res.cloudinary.com/total-typescript/image/upload/v1785748551/ai-hero-images/za02v1ilcw0wexer5jvp.png)

## The Process

Our process is going to look something like this:

1. Initial grilling session
2. Turn that grilling session into a spec
3. Turn that spec into [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)
4. Implement each individual ticket
5. Review against the spec that we initially created

Don't worry, we're going to be going back to this diagram a lot to explain it and flesh it out, but this is the basic idea.

![Diagram showing the process: grilling session → spec → tickets → implement → review](https://res.cloudinary.com/total-typescript/image/upload/v1785748552/ai-hero-images/wl0tldormkmno18uxthe.png)

In this exercise, we're only doing the first two steps - the grilling session and the spec. We're not going to implement it from there because we need to turn that spec later into tickets. We're just producing the spec in this lesson.

## The Spec Template

The spec that's created uses a template that's nice and meaty. It includes:

- A problem statement
- A solution description
- A bunch of user stories (a classic software development technique)
- Implementation decisions
- Testing decisions
- Out of scope items
- Further notes

```markdown
## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

## Testing Decisions

A list of testing decisions that were made.

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.
```

There's enough here that anything that picks this up, the implementer [agent](https://www.aihero.dev/ai-coding-dictionary/agent), is going to get a really nice injection of information to complete the implementation.

![The spec template showing problem statement, solution, user stories, and implementation decisions](https://res.cloudinary.com/total-typescript/image/upload/v1785748552/ai-hero-images/sewhq60jnrksflqludrj.png)

## The Feature We're Building

The thing we're looking at is the instructor dashboard. If you log in as an instructor (Sarah Chen), go to the dashboard and there's just like nothing here.

We did create a nice questions UI for the unanswered questions, but the instructor can't see any analytics, anything that might inform them on how their course is doing.

We need to give them something so that they can see:

- How many users are in their courses
- How much they are earning
- Completion rates
- Quiz scores

An analytics page is so big, so potentially scope creepy and could expand larger and larger that I think it makes a very good candidate for a grilling session followed by a spec. We need to shape this into something reasonable and it's definitely going to be larger than one [Smart Zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone).

## Steps To Complete

### Run a Grilling Session

- [ ] Run a `/grill-me` session about the Instructor Analytics dashboard

Have a conversation with Claude about what this analytics dashboard should include. Let the grilling session shape the feature into something reasonable and well-defined.

### Create the Spec

- [ ] Run `/to-spec` on that conversation

This will synthesize everything from the grilling session into a structured spec document. The spec will be published to your GitHub issue tracker (which you set up in an earlier lesson) with the `ready-for-agent` triage label applied.

### Review the Spec

- [ ] Read the spec that ends up in your issue tracker

Take a look at what was generated. Does it capture the conversation well? Is it detailed enough?

- [ ] See if the spec matches how you would like a spec to be built

This template is for you to fiddle with if you have any ideas on it. You can modify `.agents/skills/to-spec/SKILL.md` to adjust:

- The structure of the spec
- What sections are included
- How detailed each section should be
- The format of user stories

- [ ] Stop here - do not implement the feature

We're not going to implement it from the spec in this lesson. We need to turn that spec into tickets later. We're just producing the spec for now.
