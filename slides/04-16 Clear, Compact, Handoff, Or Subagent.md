# Clear, Compact, Handoff, Or Subagent

In the coding [sessions](https://www.aihero.dev/ai-coding-dictionary/session) we've done so far with [agents](https://www.aihero.dev/ai-coding-dictionary/agent), you might have noticed that they break down into pretty discrete chunks. We've had a [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) phase, then an implementation phase, and then a QA phase at the end. We [compacted](https://www.aihero.dev/ai-coding-dictionary/compaction) before we started QA-ing.

These phases are loosely defined. They're really just chunks of work within a coding session. Each phase is composed of two parts: the actual phase itself (the running of the grilling, implementation, or QA), and the boundaries between them.

The boundaries are really important. They represent a decision point where you're deciding what to do with the session at each phase boundary.

## Understanding Phase Boundaries

![Decision tree for phase boundaries showing the five options](https://res.cloudinary.com/total-typescript/image/upload/v1784731108/ai-hero-images/kwbydppusjcror9prsom.png)

By the time we finished grilling, we were only at about 30k [tokens](https://www.aihero.dev/ai-coding-dictionary/token). It made sense to continue directly on with the implementation. That meant the implementation could rely on the [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source) of the grilling without any kind of [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source) lossiness there.

![Showing the choices we assigned to each phase boundary](https://res.cloudinary.com/total-typescript/image/upload/v1784731109/ai-hero-images/qy0xptnwp2laxqq0lmed.png)

But by the time we finished implementation and we wanted to QA it, we decided to compact it. We'd used up our [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) really, and we wanted to get rid of all the cruft and just use the good stuff for the QA.

The way to come to those decisions isn't particularly obvious. You actually have **five choices** for things you can do at these phase boundaries.

## Your Five Options

| Option       | What It Does                                                    |
| ------------ | --------------------------------------------------------------- |
| **Continue** | Stay in the current session, no context switch needed           |
| [**Clear**](https://www.aihero.dev/ai-coding-dictionary/clearing)    | Totally clear your [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) and start fresh               |
| **Compact**  | Compress your context and seed a new session with it            |
| [**Handoff**](https://www.aihero.dev/ai-coding-dictionary/handoff)  | Create a markdown file summarizing the session to pass anywhere |
| [**Subagent**](https://www.aihero.dev/ai-coding-dictionary/subagent) | Spawn a subagent to handle the task and report back             |

Wielding these five options is not trivial. I've created a decision tree to help you navigate them. It might look pretty scary at first glance, but we're going to walk through it step by step.

## The Decision Tree: Start At The Top

When you've reached the end of a phase and you're not quite sure what to do, you start here.

### Question 1: Can You Continue?

**Does it make sense to continue in the current session?**

This is a fairly rich decision in itself. Between grilling and implementation, it obviously makes sense to continue because we've got that rich primary source that we need. We don't want to discard it for when we get to the implementation.

You may also want to continue if you just have enough smart zone budget left. If you're at 80k tokens maybe and you know the task is pretty small and is going to fit inside the smart zone, then yes, you can just continue.

If you decide that you **do need to do something**, then we need to go down this little decision tree.

![Decision tree showing the first question: Can you continue?](https://res.cloudinary.com/total-typescript/image/upload/v1784731109/ai-hero-images/m3c3gxq6wsrzjeieppxm.png)

### Question 2: Is Your Context Irrelevant To The Next Task?

If you need to do something, ask yourself: **is all the information in this session totally disposable?**

In other words, all the explorations, the decisions that were made in that session - is it totally irrelevant to what comes next?

**If yes, clear your context window.** Clearing is the most efficient path if you can take it because it takes zero time. You're just deleting information. Then you have the most smart zone available to you. You're going back to a blank slate.

However, if you clear the context with relevant information inside, you're losing information that might have been useful later. Imagine if I cleared rather than compacted when I went to QA. This means that the QA would know absolutely nothing about the implementation, which maybe is okay - it could figure it out from the git commits. But it would also lose all the information from the grilling as well.

It would lose the reasoning behind the decisions that I had made. Both phases were important for the QA that then followed. So clearing just wasn't an option.

**If no, your context is relevant.** Move to the next question.

![Decision tree showing the second question: Is your context irrelevant?](https://res.cloudinary.com/total-typescript/image/upload/v1784731110/ai-hero-images/npaie53oxvv1krfqq5sn.png)

### Question 3: Do You Need To Hand Off?

This is specifically about the handoff [skill](https://www.aihero.dev/ai-coding-dictionary/skill). The handoff skill is relatively narrow compared to the other options.

You'll only need to do the handoff when you need to:

- Pass work to another agent
- Pass work to another directory or another colleague
- Fork off a side task you discovered mid-phase without derailing the current session

For instance, you might find something during grilling that also needs to be tackled. You can just hand off to another session while you're doing that.

**If yes, use handoff** (`/handoff`). **If no, move to the next question.**

![Decision tree showing the third question: Do you need to hand off?](https://res.cloudinary.com/total-typescript/image/upload/v1784731111/ai-hero-images/ostylc7q6awkalssbffl.png)

### Question 4: Can The Task Be Done AFK?

**[AFK](https://www.aihero.dev/ai-coding-dictionary/afk) means away from keyboard.** You're not touching the keyboard. You're just watching the agent go and you cannot intervene.

This means the task is well-scoped. The agent can do it without needing your intervention at all.

Let's imagine we wanted to do an [automated review](https://www.aihero.dev/ai-coding-dictionary/automated-review) on the implementation before [human review](https://www.aihero.dev/ai-coding-dictionary/human-review) got there. Automated review is where you send the agent into the codebase and you get it to look at the changes and check if it's broken anything or done anything weird.

![Diagram showing automated review as an example of AFK task](https://res.cloudinary.com/total-typescript/image/upload/v1784731111/ai-hero-images/o6r9c6lxdswtqhwjkp0s.png)

We could have compacted at this point (we're at 150k tokens from the implementation), then run the review in the main session. But since the human isn't needed for automated review, we might as well run it in a subagent. That means we just get it to run in its own context window. We don't affect the main session.

This is a really common pattern for automated review, and it's one that we'll touch on in this course.

**If yes, spawn a subagent.** **If no, move to the final option.**

![Decision tree showing the fourth question: Can the task be done AFK?](https://res.cloudinary.com/total-typescript/image/upload/v1784731112/ai-hero-images/hk9fqg0idlqdfykyvcmi.png)

## The Default: Compact

This is the bottom of the decision tree. When your context is relevant, when you want to do something with the context, and you can't continue, when you don't need to use a handoff, and when the task needs to be done with you there - then compact is the solution.

Compact compresses your context window and seeds a new session with the good stuff. You keep what matters and discard what doesn't.

## These Are Subjective Decisions

These questions are not objective. There's a little bit of subjectivity, a little bit of taste in there too. You will find your own answers to these questions as you continue your work and continue working with agents.

But I hope this concept of phases, of what you do at phase boundaries, really sinks in. This is one of the fuzziest decisions, the most interesting decisions you're going to make when you're AI coding. It's one that demands a lot of discussion and a lot of wisdom.

[Join the Discord](https://aihero.dev/discord) and talk about these situations. Use this shared language when you discuss different scenarios. The Discord is a great place to go if you have a question about what to do at a certain phase boundary.

I've also added some quizzes below which will test you on different scenarios.

Nice work. I'll see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "phase-boundary-continue-on-remaining-budget",
    question: "You have just finished grilling. You are at 30k tokens and implementation is next. What do you do at this boundary?",
    type: "multiple-choice",
    choices: [
      { answer: "continue", label: "Continue - the grilling is the primary source you need" },
      { answer: "compact", label: "Compact - lock the agreed spec into a summary first" },
      { answer: "clear", label: "Clear - the implementation can start from a blank slate" },
      { answer: "handoff", label: "Handoff - write the spec out before you implement it" }
    ],
    correct: "continue",
    answer: "Compacting or handing off would swap a rich primary source for a lossy secondary one, and you have smart zone budget to spare, so you would be paying that loss for nothing. Clearing is worse still: the implementation would lose the reasoning behind every decision you just made."
  }} />
  <QuizQuestion data={{
    id: "phase-boundary-clear-when-context-disposable",
    question: "A phase ends. Everything explored and decided in it is genuinely irrelevant to the task you are about to start. What do you do?",
    type: "multiple-choice",
    choices: [
      { answer: "clear", label: "Clear - it takes no time and gives back the most room" },
      { answer: "compact", label: "Compact - keep a short summary of it, just in case" },
      { answer: "handoff", label: "Handoff - write the session out to a markdown file" },
      { answer: "subagent", label: "Subagent - run the next task in its own context window" }
    ],
    correct: "clear",
    answer: "Compacting and handing off both spend time producing a secondary source of information you have already decided you do not need, and both leave that summary occupying your window. A subagent isolates the new task but leaves the old session sitting underneath it. Deleting costs nothing and frees the most smart zone."
  }} />
  <QuizQuestion data={{
    id: "afk-task-goes-to-a-subagent",
    question: "You are at 150k tokens after an implementation, and the next job is an automated review that needs nothing from you while it runs. What do you do?",
    type: "multiple-choice",
    choices: [
      { answer: "subagent", label: "Spawn a subagent so the review gets its own window" },
      { answer: "compact", label: "Compact, then run the review in your main session" },
      { answer: "clear", label: "Clear, then run the review from an empty session" },
      { answer: "continue", label: "Continue, since the review only has to read code" }
    ],
    correct: "subagent",
    answer: "Compacting would work, but it spends a summarisation step on a task you never touch, and the result lands back in your window. Clearing throws the implementation context away. Continuing at 150k runs the review well past the smart zone, which is what you are trying to escape."
  }} />
</Quiz>

