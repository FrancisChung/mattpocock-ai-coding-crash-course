# Subagents

Now we understand some of the constraints of [models](https://www.aihero.dev/ai-coding-dictionary/model), like [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and dumb zone, and about how [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) fills up and slowly degrades. Let's look at a really common technique that [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) use to mitigate those downsides.

## Visualizing Agent Context Usage

I've got a little visualization of the [context](https://www.aihero.dev/ai-coding-dictionary/context) of the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) here.

![Visualization showing agent context divided into colored sections](https://res.cloudinary.com/total-typescript/image/upload/v1784121226/ai-hero-images/hqce2ycvtkbcipev6y4d.png)

Each section represents different tasks that the agent needs to do in that [session](https://www.aihero.dev/ai-coding-dictionary/session).

- **Grey section**: The stuff that's always in the [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt) - the request logger
- **Yellow section**: Exploration
- **Green section**: Implementation

## The Token Optimization Problem

The dream for any harness would be to make these chunks smaller. We want to spend fewer [tokens](https://www.aihero.dev/ai-coding-dictionary/token). This has two benefits:

1. We spend less money
2. We have more space in the context window, less [attention degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation), more space in the smart zone

![Context visualization showing desire to reduce chunk sizes](https://res.cloudinary.com/total-typescript/image/upload/v1784121226/ai-hero-images/g96q1padgph4vsj2s4hy.png)

However, there's a trade-off. If we do less legwork in the exploration phase, we're going to end up with worse exploration, which means our implementation might suffer because of bad information. It feels like we're locked in for spending this amount of tokens in our exploration phase.

**How do you bridge this divide?** How do you make the exploration cheaper, or a certain phase cheaper, so that other phases can benefit?

## Delegating Work to Subagents

Lots of harnesses employ a really smart solution: they delegate it to another agent.

![Visualization showing a subagent being spawned from the main agent](https://res.cloudinary.com/total-typescript/image/upload/v1784121227/ai-hero-images/lgzghqp97a6gpmraier0.png)

The main agent spawns another agent, and that agent can spend lots of tokens really in-depth exploring the code base, then summarize that information back to the main agent. This is kind of like a senior developer going to a junior developer and saying: "Just research something for me and then report your findings."

### Parallel Subagent Work

The main agent (the orchestrator) can also spawn multiple [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent) at the same time in parallel to do different tasks. Maybe it needs to research two things at the same time while those two junior developers can go and work in parallel and report their findings.

![Visualization showing multiple subagents spawned in parallel](https://res.cloudinary.com/total-typescript/image/upload/v1784121228/ai-hero-images/w8redztjkgmkbkinlonk.png)

### Flexible Subagent Configuration

These subagents can be spawned with different configurations:

- Different system prompts
- Different models
- Different [effort](https://www.aihero.dev/ai-coding-dictionary/effort) levels

### Recursive Subagents

You can even have a subagent spawn its own subagents. Some harnesses support this, some don't. Some only allow you to go one level deep, but this means subagents can act just as powerful as the agents above them.

![Visualization of nested subagents spawning their own subagents](https://res.cloudinary.com/total-typescript/image/upload/v1784121229/ai-hero-images/uk8mosnbzotudxlxz0cc.png)

We're going to leave the exploration at the theoretical level for now because we're going to be using subagents a lot more when we get into the fundamentals.

Nice work and I will see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "subagent-keeps-exploration-out-of-main-context",
    question: "Your main agent hands a deep codebase exploration to a subagent. What does the main agent get out of that?",
    type: "multiple-choice",
    choices: [
      { answer: "summary", label: "It receives the summary, not the tokens spent finding it" },
      { answer: "faster", label: "It gets the exploration done faster than it could alone" },
      { answer: "free", label: "It pays nothing for the tokens the subagent burns" },
      { answer: "reset", label: "It has its own context window emptied back to the start" }
    ],
    correct: "summary",
    answer: "The subagent spends the tokens exploring and reports findings back, so only the summary lands in the main agent's context - less money spent and more room in the smart zone. The subagent's tokens are still spent, just not in the orchestrator's window. Speed is what parallel subagents buy, not delegation on its own. And nothing about spawning a subagent clears what the main agent already holds."
  }} />
  <QuizQuestion data={{
    id: "subagent-config-differs-from-parent",
    question: "What can a subagent be spawned with that differs from the agent that spawned it?",
    type: "multiple-choice",
    choices: [
      { answer: "all-three", label: "Its own system prompt, model, and effort level" },
      { answer: "prompt-only", label: "Its own system prompt, but the parent's model" },
      { answer: "model-only", label: "Its own model, but the parent's system prompt" },
      { answer: "nothing", label: "Nothing, since a subagent inherits the whole setup" }
    ],
    correct: "all-three",
    answer: "All three are configurable, which is what lets you send a cheap fast subagent at a mechanical search and a stronger one at a hard question. The narrower answers all understate it, and a subagent that inherited everything would be no cheaper than doing the work in the main agent - it can even spawn subagents of its own in some harnesses."
  }} />
</Quiz>
