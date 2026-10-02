# Compaction

When building features with an [agent](https://www.aihero.dev/ai-coding-dictionary/agent), you eventually reach the end of the "[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)" - the part of the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) where your [model](https://www.aihero.dev/ai-coding-dictionary/model) works best. What happens next?

If you continue in that same [session](https://www.aihero.dev/ai-coding-dictionary/session), results [degrade](https://www.aihero.dev/ai-coding-dictionary/attention-degradation) slowly. The agent sends all previous [tokens](https://www.aihero.dev/ai-coding-dictionary/token) with every request. Those tokens are cheaper because they've been [cached](https://www.aihero.dev/ai-coding-dictionary/cache-tokens), but you're still operating in a higher latency, less capable environment.

More importantly: how many of those tokens are actually useful? A lot of them are just noise from the work itself - file reads, file writes, files in different states as you move through the project.

## The Naive Solution: Starting Fresh

One option is to totally [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the [context](https://www.aihero.dev/ai-coding-dictionary/context) and start a new session. But this comes with a hidden cost.

When you clear the context, the agent loses crucial understanding from the initial conversation. It has to re-explore and re-establish everything it knew before. You might prompt it like this:

```
we are going to do QA on the stuff that's literally just been worked on.
Can you go and explore it so you understand the reasons behind its existence?
```

The agent will do that exploration, but it's also lost some of the crucial reasoning from your initial conversation.

It can re-explore the code and re-read what you built, but that re-exploration is lossy - you've lost a lot of the actual _why_ behind what you constructed.

## Introducing Compaction

This is where [**compaction**](https://www.aihero.dev/ai-coding-dictionary/compaction) comes in. Instead of clearing the context entirely, compaction takes the context from your current session, squeezes it down, and seeds a fresh session with it.

Think of it like a [hand-off](https://www.aihero.dev/ai-coding-dictionary/handoff) between sessions that you control - similar to using a [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent), but in reverse. The session history is summarized, then it seeds a fresh session you can continue working from.

| Approach                 | Tokens | Quality                     | Downsides                                       |
| ------------------------ | ------ | --------------------------- | ----------------------------------------------- |
| Continue current session | 156k+  | Full context, lots of noise | High latency, dumb zone results                 |
| Clear and start fresh    | ~5k    | Clean slate                 | Must re-explore everything, lossy understanding |
| Compaction               | ~28k   | Summarized context          | Lossy compression, [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source)             |

Compaction saves re-exploration. Without it, you'd spend a ton of tokens just re-discovering context you'd already established.

## How Compaction Works in Practice

In your agent, you run the `/compact` command with a summarization instruction:

```
/compact Yeah, we're going to do some QA in this area.
```

![Running the /compact command with summarization instruction](https://res.cloudinary.com/total-typescript/image/upload/v1784727213/ai-hero-images/ohchylfupfecbxkjykji.png)

This instruction matters. The thing doing the summarization is a language model, so it needs context to highlight relevant information. Your instruction doesn't need to be detailed - one sentence is often enough.

When you launch the compaction, the agent shows a UI where it's compacting the conversation.

![Compaction UI showing progress](https://res.cloudinary.com/total-typescript/image/upload/v1784727214/ai-hero-images/u1ode6xn0r2sg4nl1jvj.png)

Here's a useful tip: you can queue messages inside the compaction UI. Once compaction finishes, your queued message runs automatically - no need to sit around waiting.

### What Gets Preserved

When compaction finishes, it outputs a summary with several key elements:

![Compaction finished readout with file references](https://res.cloudinary.com/total-typescript/image/upload/v1784727215/ai-hero-images/y8tuacsohb14aaw8o2tk.png)

- **Primary request and intent** - what you originally asked for
- **Full agreed [spec](https://www.aihero.dev/ai-coding-dictionary/spec)** - all the decisions you confirmed
- **Key technical concepts** - important domain knowledge
- **File references** - pointers to critical files, plus some files retained verbatim
- **Errors and fixes** - what went wrong and how you solved it
- **Problem solving** - your approach and reasoning
- **All user messages** - everything you said
- **Pending tasks** - work still to do

Here's what the token compression looks like:

From the original session with ~156,000 tokens, the compaction summary reduced it to around 28,300 tokens. That 150k becomes 30k - giving you plenty of room back in the smart zone.

![Running /context showing 28.3k tokens after compaction](https://res.cloudinary.com/total-typescript/image/upload/v1784727216/ai-hero-images/hvti9dpz5twk9hsrrnbk.png)

```
Model: claude-opus-4
Tokens: 28.3k / 1m (3%)

| Category                | Tokens | Percentage |
|-------------------------|--------|------------|
| System prompt           | 2.9k   | 0.3%       |
| System tools            | 4.5k   | 0.5%       |
| Messages                | 20.7k  | 2.1%       |
| Free space              | 971.7k | 97.2%      |
```

For example, a line from the summary might read:

```
- app/lib/comments.ts (new): MIN_COMMENT_LENGTH = 1,
  MAX_COMMENT_LENGTH = 5000 (client-safe, mirrors ratings.ts)
```

![Dense compression of file changes in the summary](https://res.cloudinary.com/total-typescript/image/upload/v1784727217/ai-hero-images/py1iywplpcn5m2emfbml.png)

This is extremely dense compression of everything you did in that previous session.

## The Trade-off: Information Loss

Compaction isn't without downsides. Think of it using historical terms:

![The compaction summary as a 'historian' looking over the session](https://res.cloudinary.com/total-typescript/image/upload/v1784727218/ai-hero-images/dlqjbiops0x6s2bicyoz.png)

- The [**primary source**](https://www.aihero.dev/ai-coding-dictionary/primary-source) is your initial session - the record from people there at the time
- The **secondary source** is the summary - a historical summary, which is lossy compression of the primary source

Compaction is the first hand-off mechanism you've seen that preserves context between sessions. But all hand-off mechanisms suffer from the same issue: whenever you create a secondary source, you lose information.

However, you're gaining efficiency. Here's the trade-off:

| Approach                      | Information | Noise | Maneuverability |
| ----------------------------- | ----------- | ----- | --------------- |
| Primary source (continue)     | Full        | Lots  | Limited         |
| Secondary source (compaction) | Lossy       | Less  | More room       |

If you continue with the primary source, you have all the information but probably along with a lot of noise. If you use the secondary source, you have more room to maneuver and less space being used up, but you might lose some of the nuances from the primary source.

## When Compaction Shines

However, in the exact situation where you want to do QA on a finished piece of work, compaction is a cast-iron great place to use it. You're not re-implementing. You're not making architectural decisions. You're validating something that's already complete.

This is an introduction to compaction. You'll see how it compares to clearing and other mechanisms in upcoming lessons.

<Quiz>
  <QuizQuestion data={{
    id: "compaction-summary-is-a-secondary-source",
    question: "You compact a 156k-token session down to 28k and carry on working. What is now true of the detail from before the compaction?",
    type: "multiple-choice",
    choices: [
      { answer: "lossy", label: "It is a summary now, so nuance from the original is gone" },
      { answer: "retrievable", label: "It is held in full and pulled back in whenever it is needed" },
      { answer: "cached", label: "It is unchanged, and simply billed at the cheaper cached rate" },
      { answer: "on-disk", label: "It is saved to a file on disk that you can open and search" }
    ],
    correct: "lossy",
    answer: "Compaction squeezes the session rather than storing it, so nothing is retrievable in full afterwards. Old tokens being cheap because they are cached describes staying in the same session, which is the option you just left. And compaction writes no file - it seeds a fresh session in memory."
  }} />
  <QuizQuestion data={{
    id: "compact-instruction-steers-the-summary",
    question: "You are about to compact so the next session can QA a finished feature. What do you actually type?",
    type: "multiple-choice",
    choices: [
      { answer: "with-reason", label: "/compact plus a sentence saying you are moving on to QA" },
      { answer: "bare", label: "/compact on its own, then explain the goal afterwards" },
      { answer: "full-spec", label: "/compact plus the whole agreed spec pasted in for safety" },
      { answer: "clear-instead", label: "/clear, then ask the agent to go and re-read the code" }
    ],
    correct: "with-reason",
    answer: "The thing writing the summary is a language model, so a bare /compact leaves it guessing which parts matter - and by the time you explain, the squeeze has happened. Pasting the full spec is wasted effort, since one sentence is enough. Clearing throws away the reasoning and forces lossy re-exploration."
  }} />
</Quiz>

