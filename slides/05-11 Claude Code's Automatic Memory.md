# Claude Code's Automatic Memory

There's one more source of steering that we haven't discussed, and that is the one that the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) writes for itself.

## How Automatic Memory Works

Most [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) ship with a [memory system](https://www.aihero.dev/ai-coding-dictionary/memory-system), one that the agent writes to and reads from without you necessarily asking. As you work, the agent notices things worth remembering. So it notices a correction that you made to its behavior or a preference that you expressed or a fact about how you want work done and then saves it into a local file somewhere.

Those files then get read into the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) in later [sessions](https://www.aihero.dev/ai-coding-dictionary/session). Depending on the harness, it's either like an `AGENTS.md`, pushed in, or as a [pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer).

This means, in theory, the agent builds up a picture of how you like to work without you needing to steer it. It's steering itself. It's grabbing the wheel.

## Finding Automatic Memory

![Claude Code /memory command showing auto-memory is on](https://res.cloudinary.com/total-typescript/image/upload/v1785244641/ai-hero-images/rb5shn9oucfpvfyebeuk.png)

In Claude Code, we can look at this by running `/memory` here, and we can see that automatic memory is on.

We can see that it uses `CLAUDE.md` as the name for memory, which is interesting. And there's also an auto-memory section.

![Auto-memory folder opened in Chrome showing MEMORY.md file](https://res.cloudinary.com/total-typescript/image/upload/v1785244642/ai-hero-images/weydt0owzza0llyzapjk.png)

When we press "open auto-memory folder," it opens in Chrome (oddly enough), and there is a little `MEMORY.md` file in here.

The auto-memory file is stored outside your repo, in Claude Code's per-project state directory, keyed by the current working directory. That's why it never shows up in `git status` and never gets [code-reviewed](https://www.aihero.dev/ai-coding-dictionary/human-review).

## What Auto-Memory Contains

Inside `MEMORY.md` there's an index of pointers to memory files the agent has written. In this case, there's an entry that reads:

```
- Editing course repos skill - this is a course repo; the governing skill lives in personal-wiki, not here
```

That's the agent reading its own memory back at you. It's noticing facts about your project and stashing them for later sessions.

The linked memory file itself uses the same shape as a [skill](https://www.aihero.dev/ai-coding-dictionary/skill). It has YAML frontmatter with `name` and `description`, then a body. The agent is essentially writing itself skills behind your back.

## The Problem With Stale Memory

Here's the issue: automatic memory is like auto-sediment. It's sediment that's writing itself, building up stale layers that are very rarely removed by the agent.

The agent writes entries and doesn't remove them. So the file only grows. Every line in it is paying a context load in every session. A preference you had once and changed becomes a wrong assumption the agent keeps trusting. A hint that fit one task becomes a rule that follows you into every task after.

And because you didn't write these lines, you're less likely to go in and prune them.

If you look at the memory metadata, you can see the original session that created it, often weeks old. It's been silently riding along in the context window ever since.

## The Recommendation

I've already shown you how ruthlessly I prune `AGENTS.md`, how much I dislike having the agent steer itself because of all these no-ops and the rubbish that it piles into the context window. Automatic memory is exactly that problem, except now it happens without you deciding what goes in.

So here's what I recommend: go into auto-memory and turn it off.

![Turning off auto-memory in Claude Code settings](https://res.cloudinary.com/total-typescript/image/upload/v1785244643/ai-hero-images/m3z3pwp41hgrsfkmeyjn.png)

Now no memories will be stored. This reduces the context window because you don't have the [tool](https://www.aihero.dev/ai-coding-dictionary/tool) in there to create memories. What a relief.

A lot of people ask me about memory systems and whether they should add them into their setups. My answer is: no. You as the user should be in control of how memories are created, how steering is done.

Because if you allow these automatic memories to just accrue and accrue, then you're building up useless sediment in your context.

The whole point of this section is steering on purpose: choosing what earns a place in context, and keeping it current. Automatic memory works against that. It's steering you didn't choose, accumulating where you're not looking.

<Quiz>
  <QuizQuestion data={{
    id: "auto-memory-off-by-recommendation",
    question: "Your harness offers to remember corrections you make and feed them back in later sessions, without you asking. Do you leave it on?",
    type: "multiple-choice",
    choices: [
      { answer: "off", label: "No - turn it off and steer with files you wrote" },
      { answer: "on", label: "Yes - it learns how you work at no effort to you" },
      { answer: "audit", label: "Yes, but read the memory folder before you start" }
    ],
    correct: "off",
    answer: "The agent writes entries and does not remove them, so the file only grows and every line pays context load in every session - that is not free learning, it is sediment writing itself. Reading the folder before each session is work you will not keep doing, and lines you did not write are the ones you are least likely to prune. Turning it off also takes the memory tool out of the window."
  }} />
  <QuizQuestion data={{
    id: "auto-memory-escapes-code-review",
    question: "Why does an automatic memory file never turn up in a code review?",
    type: "multiple-choice",
    choices: [
      { answer: "outside", label: "It is kept outside the repo, in per-project state" },
      { answer: "ignored", label: "It is written into the repo, but ignored by git" },
      { answer: "rebuilt", label: "It is rebuilt each session, so there is no diff" }
    ],
    correct: "outside",
    answer: "It is not in your repository at all, so there is nothing for git to ignore - it sits in the harness's per-project state directory, keyed by the working directory, which is why it never shows in git status. It is not rebuilt each session either: entries written weeks ago are still riding along in the context window."
  }} />
  <QuizQuestion data={{
    id: "auto-memory-is-self-writing-sediment",
    question: "The agent saved a preference you held three months ago and have since changed your mind about. What happens in today's session?",
    type: "multiple-choice",
    choices: [
      { answer: "trusted", label: "It loads, and the agent acts on the old preference" },
      { answer: "expired", label: "It ages out, since newer corrections replace it" },
      { answer: "asked", label: "You are asked to confirm it before it gets used" }
    ],
    correct: "trusted",
    answer: "Nothing ages these entries out and nothing asks you about them - the agent writes them and very rarely removes them, so a preference you have changed becomes a wrong assumption it keeps trusting, and a hint that fitted one task follows you into every task after. It goes on paying context load until you go in and delete it yourself."
  }} />
</Quiz>
