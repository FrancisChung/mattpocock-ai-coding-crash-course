# Ask Matt

<CommitMap packageManager="npm">
  <Commit id="add-ask-matt-skill">Start the lesson: the `/ask-matt` skill added</Commit>
</CommitMap>

You are going to finish this course with questions. That is normal. The problem is what you do in the gap between having the question and getting an answer.

You can always ask me in [Discord](https://aihero.dev/discord). I am happy to answer, and so is the rest of the community. But while you are waiting for a reply, there is something you can try.

There is a tool for asking my advice without me being in the room.

## Reset To The Skill

Open a terminal and reset to the lesson that adds the skill.

```
npm run reset add-ask-matt-skill
```

That commit drops an `/ask-matt` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) into the repo. Reset your current branch onto it, open your [agent](https://www.aihero.dev/ai-coding-dictionary/agent), and you can ask Matt.

## Ask It A Real Question

The skill takes a situation, not a keyword. Here is the one I put to it.

```
/ask-matt What's the best flow for fixing a bug once I've finished doing an implementation on a spec and all the tickets are closed?
```

That is a real position to be in. The [spec](https://www.aihero.dev/ai-coding-dictionary/spec) is built. Every [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) is closed. Then something turns out to be broken. There is no obvious next command to type, because the flow you were following has run out.

## What It Answered

The router opened with this.

```
**Short answer: `/clear`, then `/diagnosing-bugs`.**
```

Two moves. First empty the [context](https://www.aihero.dev/ai-coding-dictionary/context), because the spec thread is spent and a bug is a new starting point rather than a continuation of the build. Then reach for the skill that handles bugs.

It went further than the headline. It said to check whether you can make the bug go red with one command: if you can, and the cause is obvious, write the failing test and fix it. If you cannot, that is when the diagnosis skill earns its place. It also named two things not to do. Do not triage the bug, because triage is only for issues you did not create. Do not reopen the closed spec, because a spec that turns out to be wrong is a new idea, not a patch.

## It Knows Skills The Course Does Not Cover

The skill it recommended is one we have not encountered. It does exist in my real skillset.

That is the point. This course covers the main flow and a fair few very important skills, but it does not cover everything in the skillset. There is still stuff to learn, and **`/ask-matt` is the way you learn it**. It is listed under Getting Started, and it is a good way to get up to speed with the rest of the skills.

A **flow** is a path through the skills, not a single skill. Most work travels along one main flow. A couple of on-ramps merge onto it. The rest are standalone, or a vocabulary layer running underneath. When you name your situation, the router puts you on a flow at the right step, which is often a different answer from the skill whose name matches your words.

## The Phase Boundary Checklist

One particularly useful thing lives inside the skill itself: a **phase boundary checklist**.

A phase is a chunk of work inside a [session](https://www.aihero.dev/ai-coding-dictionary/session): the grilling, the implementation, the QA. The boundary is the gap between two of them, and it is where you decide what happens to your [context window](https://www.aihero.dev/ai-coding-dictionary/context-window). That decision is genuinely hard. You have five options and no obvious way to pick.

| Option | What it does |
|--------|--------------|
| Continue | Stay in the session. No context switch at all. |
| Clear | Empty the context window and start from nothing. |
| [Handoff](https://www.aihero.dev/ai-coding-dictionary/handoff) | Write a portable markdown file and seed a session anywhere with it. |
| [Subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) | Send the task to its own context window and get a report back. |
| Compact | Compress this context and seed a fresh session with the summary. |

So when you are not sure whether to continue, clear, hand off, send it to a subagent, or [compact](https://www.aihero.dev/ai-coding-dictionary/compaction), the skill can walk you through it. It works the options top to bottom and the first yes wins, which turns a vague feeling into an ordered set of questions.

## Take Its Answers With A Pinch Of Salt

Look back at the answer it gave me. It said to clear. I would say the best thing there is probably to compact instead, because some of that implementation context is worth carrying into the bug hunt. And to be honest, you might not need the `/diagnosing-bugs` skill at all. That skill is only for very, very tricky bugs. If it is a simple bug, you might just be able to sort it yourself.

So treat it like any agent. It is a router, not an oracle. It is a nice way to ask questions about the skills and figure out what you might want to use next, and you still apply your own judgement to what comes back.

If you notice it giving any weird answers, raise an issue on the skills repo itself. That is how the router gets better.

People have found this useful for getting to grips with the skills, as a first port of call for the things they do not quite understand yet.

Nice work, and I will see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "ask-matt-is-a-router",
    question: "What does the /ask-matt skill give you back?",
    type: "multiple-choice",
    choices: [
      { answer: "a", label: "A recommendation of which flow and skill to use next" },
      { answer: "b", label: "A finished implementation of the change you described" },
      { answer: "c", label: "A spec written from the situation you described" },
      { answer: "d", label: "A list of every skill installed in the repo" }
    ],
    correct: "a",
    answer: "It is a router. You name the situation you are in and it names the flow that fits, along with the next thing to type. It does not build the change for you, it does not write a spec, and it is not a directory listing. The other three are jobs other skills own."
  }} />
  <QuizQuestion data={{
    id: "ask-matt-judgement-required",
    question: "The router tells you to clear and then run the /diagnosing-bugs skill. What should you do?",
    type: "multiple-choice",
    choices: [
      { answer: "a", label: "Weigh it against your own read of the situation before you act" },
      { answer: "b", label: "Run both commands exactly as given, since the skill holds the full map" },
      { answer: "c", label: "Ignore it, because a router cannot see your codebase" },
      { answer: "d", label: "Ask it again until two runs agree on the same answer" }
    ],
    correct: "a",
    answer: "The router is useful and it is also wrong sometimes. Here compacting may beat clearing, and a simple bug may not need the diagnosis skill at all. Following it blindly ignores that, dismissing it throws away a good starting point, and asking repeatedly just gives you two guesses instead of one."
  }} />
</Quiz>

