# Pruning

There's one big problem with storing files in your project repository that everyone contributes to.

They only grow. They always get bigger and very rarely do they get smaller. Every rule in there goes in for a reason, and none of them tend to come out. A file starts at five lines, then grows to 500, then to 1,000.

The reason is psychological. Adding a rule feels cheap and it feels safe, especially when you're contributing to a group document. Removing one feels like you're saying that rule doesn't matter anymore, like you're stamping over someone's work.

But this idea of pruning matters. **Pruning is going back through the file, cutting stuff out of it on a regular basis.** It's critical for reducing the overall context load.

Almost every `AGENTS.md` file in the real world is far, far too big. The good news is that you can learn to prune them effectively.

## The Pruning Toolkit

You need a way to decide, line by line, what stays. The solution is a set of three tests you can run over any steering file. These three tests form the pruning toolkit.

| Test | Definition |
|------|-----------|
| Single Source Of Truth | Every fact should live in exactly one authoritative place |
| Sediment | Lines that were once true but aren't true now |
| No-Ops | Instructions that change nothing about the agent's behavior |

Anything that fails these three tests is not earning its place in the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window). Cut it, and you'll notice that your steering improves massively.

## Test 1: Single Source Of Truth

Every fact that the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) needs should live in exactly one authoritative place. One single source of truth for every single fact.

This means avoiding duplication. You might write a rule in your `AGENTS.md`, then paste a slightly different version into a doc. Maybe they're being edited in different places, or they come in from different pull requests. Now you have these different, often competing sources of truth for what is exactly the same information.

When you have lots of duplication, the agent often can't tell which copy is live, so it trusts the wrong one. You can even have duplication within the same file when it's particularly long.

### The Cost of Duplication

Duplication costs you in three ways:

1. **Maintenance** - Every time you need to change the behavior, you have to change it in multiple places.

2. **Context load** - You're paying [tokens](https://www.aihero.dev/ai-coding-dictionary/token) saying the same thing over and over.

3. **Prominence** - That duplicated information becomes more prominent than the stuff that hasn't been duplicated, so it weights much higher than its actual real importance.

This means duplicated content drowns out other important information that just hasn't been duplicated. A fact with three homes is a fact you no longer control.

Keep every fact in one place, and point at that place from everywhere else.

## Test 2: Sediment

Sediment is the second thing that rots a steering file. Sediment is really a psychological problem, it's a problem in how teams tend to work with these files.

Sediment layers build up in your `AGENTS.md` file over time because **adding feels safe and removing feels risky**. Any steering file without a strong pruning discipline will fall into sediment, becoming longer and longer and longer.

Every rule makes sense the day you write it. But projects move. The library gets swapped, conventions change, the bug you were guarding against gets fixed. And the rule you wrote for it stays. Nobody deletes it. It settles at the bottom of the file, dragging the agent toward a world that no longer exists.

This means your `AGENTS.md` file slowly becomes more irrelevant for more tasks. Having sediment means you get a lot of irrelevant stuff in the context window loading up the [context](https://www.aihero.dev/ai-coding-dictionary/context) and making the agent perform worse.

### Identifying Sediment

Sediment is particularly dangerous because it was probably once correct. It might have been correct for a bit, or it might just be correct but not applicable in all situations. **You need to be ruthless with removing it or putting it behind a [pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer).**

Ask of every line: is this still true?

## Test 3: No-Ops

No-ops are probably the most pernicious problem, the most easy to add and hardest to remove.

A **no-op** is an instruction that just does nothing, it changes nothing about the output. This happens in two ways:

- The [model](https://www.aihero.dev/ai-coding-dictionary/model) already does it by default
- It does nothing in the context of that particular steering instruction

Imagine you've written an `/implement` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) and it has an instruction saying "write a detailed commit message." Is that instruction actually needed? What would happen if you deleted it? Would it still write a good commit message? Probably it would.

So you're paying context load to tell it what it would have done regardless.

### Detecting No-Ops

The way you get rid of a no-op is simple: **remove it and then see if the behavior has changed.** If it hasn't changed, then that line was probably a no-op and could be deleted.

This test is one question: does this line change behaviour versus the default?

**An instruction can be perfectly relevant to the situation and still be a no-op.** It can be true, on-topic, and still not worth a single token, because the agent didn't need telling.

And a no-op isn't free. It's still in context, still paying context load, still diluting the lines around it that matter.

## Putting It Together

So here's the pruning toolkit, three tests to run over every steering file:

1. **Is this instruction duplicated**, breaking single source of truth?
2. **Is this instruction a piece of sediment** that is true once but not true now?
3. **Is this line a no-op?** Does it actually do anything to change behavior?

Anything that fails these three tests is not earning its place in the context window. It's just costing you context load for no gain.

Cut it, and you'll notice that your steering improves massively.

<Quiz>
  <QuizQuestion data={{
    id: "no-op-relevant-but-earns-nothing",
    question: "Your implement skill says 'write a detailed commit message.' You delete the line and the commit messages come out the same. What now?",
    type: "multiple-choice",
    choices: [
      { answer: "gone", label: "It was a no-op, so the line stays deleted" },
      { answer: "restore", label: "Put it back - it was holding the quality up" },
      { answer: "move", label: "Move it into AGENTS.md so it always applies" }
    ],
    correct: "gone",
    answer: "The behaviour did not change against the default, which is the whole test - so nothing was holding the quality up, the model was already doing it. Moving the line to AGENTS.md makes it worse: it now costs context load on every request instead of only when the skill fires, and it still changes nothing. An instruction can be true and on topic and still not worth a token."
  }} />
  <QuizQuestion data={{
    id: "one-home-per-fact",
    question: "The same naming convention is written in AGENTS.md and, in slightly different words, on a docs page. What do you do?",
    type: "multiple-choice",
    choices: [
      { answer: "onehome", label: "Keep one copy and point at it from the other place" },
      { answer: "align", label: "Edit both copies until the wording matches exactly" },
      { answer: "louder", label: "Leave both - saying it twice makes the rule stick" }
    ],
    correct: "onehome",
    answer: "Matching the wording still leaves two places to change every time the rule changes, and still gives the agent no way to tell which copy is live. Saying it twice does make it weigh heavier, but that prominence is the cost, not the prize: it outranks its real importance and drowns out the lines said only once. One authoritative home, pointed at from everywhere else."
  }} />
  <QuizQuestion data={{
    id: "sediment-goes-or-goes-behind-a-pointer",
    question: "A rule in your steering file guards against a quirk in a library your project swapped out last quarter. What happens to the line?",
    type: "multiple-choice",
    choices: [
      { answer: "cut", label: "Cut it, or put what survives of it behind a pointer" },
      { answer: "keep", label: "Keep it, in case the old library ever comes back" },
      { answer: "general", label: "Rewrite it as advice about libraries more broadly" }
    ],
    correct: "cut",
    answer: "Keeping a line that describes a world that no longer exists drags the agent toward that world, and you pay context load for it in every session while it does so. Generalising it produces a line that is true of everything and changes no behaviour - a no-op, which is not an upgrade on a false rule. Sediment gets cut, or moved behind a pointer where it costs nothing."
  }} />
</Quiz>
