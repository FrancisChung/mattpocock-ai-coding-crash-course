# The Grill-Execute-Clear Loop Solution

<CommitMap packageManager="npm">
  <Commit id="grill-me-skill">Start the lesson: the `/grill-me` skill added to `.agents/skills/`</Commit>
  <Commit id="lesson-comments">See my solution: the full lesson comments feature</Commit>
</CommitMap>

Starting with a loose prompt, you can use the `/grill-me` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) to align on a feature before you write a single line of code.

## The Initial Prompt

The process starts simple. Tell the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) what you want to build:

```
/grill-me I would like to build a lesson comments feature.
I think students should be able to comment on lessons they
have access to. Instructors should also be able to comment
on them as well.
```

The agent immediately launches a background task to map your codebase. It does not wait for that exploration to finish - it starts asking questions right away. This is the non-blocking design pattern in action.

## Round 1: The Strategic Questions

Questions arrive in rapid succession. These are not implementation details. They are design decisions.

![First batch of grilling questions displayed](https://res.cloudinary.com/total-typescript/image/upload/v1784726931/ai-hero-images/bu6pbikyisxkvjlplbu2.png)

The agent asks about purpose ("What is this feature actually for?"), not just mechanism. It explores edge cases ("What happens when nobody comments?"). It challenges assumptions ("Why gate commenting to students with access at all?").

Each question includes a recommendation. You do not have to follow it - your job is to think through it and decide.

## How to Answer

You do not answer each question separately. You dictate one long paragraph, covering all the answers.

Here's the answer that I gave to the questions I received:

```txt
I would say this feature is for Q&A and support, with a bit of community and discussion.
I'd say that having a comment section that's healthy is really useful for students.
I think I don't mind a comments box with zero comments.
We probably want to design an empty state that looks nice and makes students not turned off from commenting, that encourages them to comment.
I am not actually the teacher in this situation.
This is for other teachers.
I think the expectation of a response should be there.
I think I would prefer to build it.
It's just weird to discuss a lesson that you can't see, and it's part of the paid-only perks.
To be honest, all three of those seem fine.
I think one table, one comments feature, the instructor gets a badge.
Yep, your recommendation makes sense.
```

The agent absorbs your answers and prepares the next round.

## Round 2: The Implementation Layer

![Second round of questions about threading model and comment behavior](https://res.cloudinary.com/total-typescript/image/upload/v1784726932/ai-hero-images/ct3hyjqe8nklz2pflxk3.png)

Now the questions dig into structure. Threading model. Edit permissions. Sorting. Notification strategy.

Here's the answer that I gave to the questions I received:

```txt
For the threading model, I think we just want a flat list, first of all.
I don't want to have an explicit resolution state.
I don't think we need that in v1.
The instructor should have a dedicated queue page on their dashboard that lists every unanswered question.
I guess, since we've decided that we're not having an explicit resolution state, it should be that every thread where there's a recent comment that they've not seen or not replied to.
```

## When the Agent Pushes Back

During Round 3, the agent catches a contradiction in your answers:

![Agent highlighting contradiction between flat list and queue requirements](https://res.cloudinary.com/total-typescript/image/upload/v1784726933/ai-hero-images/enpp42cqab5fxatodj8h.png)

You chose a flat list. You also chose no explicit resolution state. But you asked for a queue of unanswered questions.

With a flat list, every comment is top-level. Nothing points at anything else. How do you mark something as answered?

The agent forces a decision. It offers three options:

1. Reinstate one-level replies (parent-child relationships)
2. Keep flat, define "unanswered" at lesson level
3. Keep flat, add explicit seen-state

You choose option 1. One-level replies make sense for an instructor-student dynamic.

## The Real Bug Discovery

While you are answering questions, background exploration finishes. The agent uncovers a critical security issue:

![Agent reporting XSS vulnerability in markdown rendering](https://res.cloudinary.com/total-typescript/image/upload/v1784726935/ai-hero-images/raejvrzkmsz6tcsit0qp.png)

The `renderMarkdown` function has no sanitization. Raw HTML passes straight through. A student could inject a script tag into a comment, and it would execute in the instructor's session.

The recommendation: create a separate `renderComment()` function with a restricted renderer. Only student comments need sanitization. Instructor comments can render full markdown.

You agree. This becomes part of the [spec](https://www.aihero.dev/ai-coding-dictionary/spec).

## The Spec

By Round 4, the agent has enough information. It produces a written specification:

![Agent producing complete written specification](https://res.cloudinary.com/total-typescript/image/upload/v1784726937/ai-hero-images/aj390dgqynlla7hzmssa.png)

You do not need to read it. Your answers throughout the [session](https://www.aihero.dev/ai-coding-dictionary/session) have already encoded all the decisions. The spec is just a confirmation - proof that you and the agent share the same understanding.

However, if the [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session took a weird twisty turn, you might want to skim it. In this case, everything feels aligned.

## One Last Push

The agent makes one final objection about queue ordering:

> Queue ordering - your reasoning argues against your choice. You want newest-first _so mis-flagged items float away._ But the queue only contains items with no staff reply. Nothing floats _away_; it floats _down_.

You do not need to respond. You just say:

```
Okay, let's start building.
```

The agent resolves it itself and moves into execution mode.

## The Build Happens

No [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) of context. No starting fresh. You keep all the grilled [context](https://www.aihero.dev/ai-coding-dictionary/context) in the session and jump straight into implementation.

![Agent building the feature while context remains in session](https://res.cloudinary.com/total-typescript/image/upload/v1784726938/ai-hero-images/eygkseakympj4ikiyvqc.png)

The agent churns for 14 minutes and 28 seconds. By the end, you have 362 tests passing, a clean typecheck, and a working feature in VS Code.

All of this happens while staying well under the context limit - the build ends at around 155k [tokens](https://www.aihero.dev/ai-coding-dictionary/token), leaving room to spare.

## Quality Assurance in the Browser

You open the feature in the browser. A student (Olivia Martinez) posts a comment:

![Student posting comment on lesson](https://res.cloudinary.com/total-typescript/image/upload/v1784726939/ai-hero-images/kmsy3kwhhv84aiffvxcr.png)

You switch to the instructor (Marcus Johnson) and reply:

![Instructor replying to student comment](https://res.cloudinary.com/total-typescript/image/upload/v1784726940/ai-hero-images/jnrmswl67n6adshvoiuh.png)

You can edit your own comments. The UI shows "(edited)" when you do:

![Comment showing edited state](https://res.cloudinary.com/total-typescript/image/upload/v1784726941/ai-hero-images/xcnemhz1dcco7agfxnnz.png)

You can delete comments. The system leaves a tombstone:

![Deleted comment showing tombstone with reply still visible](https://res.cloudinary.com/total-typescript/image/upload/v1784726941/ai-hero-images/ar2m61616prgmtp6xhx3.png)

The instructor has a dedicated Questions queue:

![Instructor questions queue page showing unanswered questions](https://res.cloudinary.com/total-typescript/image/upload/v1784726942/ai-hero-images/ywfj7pcyplwaupddqzng.png)

Every unanswered question appears here. Olivia's "how are you?" is at the top. There is another question from Liam Thompson below it.

The instructor can reply inline, without leaving the queue page.

## What Gets Built

The full feature ships:

- A `comments` table in the database
- A `getAccess` helper in `access.server.ts` (the shared guard from your code-quality question)
- A sanitized `renderComment()` function in `comment-markdown.server.ts` with 19 tests
- A `commentService` with 48 tests covering all the business logic
- A comment thread UI component with an empty state
- An instructor questions queue page at `/instructor/questions`
- Seed data: 15 comments across 9 threads, 4 of which are unanswered

Everything is tested. Everything is typed. The working tree is dirty and ready for review.

## Why This Works Better Than Direct Implementation

Without grilling, you might have built:

- No empty state (what does zero comments look like?)
- No instructor queue (instructors have to hunt through lessons)
- No XSS sanitization (a real security hole)
- A flat list with a seen-state (more complex than replies)
- Full HTML rendering for students (dangerous)

Grilling made you think through all of that _before_ writing code. The implementation became trivial because the hard decisions were already made.

This is the power of alignment. The agent is not trying to be clever. It is trying to understand what you actually want, and it uses pressure (contradictions, edge cases, security issues) to force that understanding into the light.

Then it builds exactly what you agreed on.

## The Loop

This is one cycle of the grill-execute-clear loop:

1. **Grill**: Ask clarifying questions until you and the agent share a mental model
2. **Execute**: Build the feature with confidence, context still warm
3. **Clear**: Once the feature is done and committed, clear the context before the next task

The next time you work on something, you start fresh. The session history is gone. But the grilling session before it left you with exactly what you needed.

