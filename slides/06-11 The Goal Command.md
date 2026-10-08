# The Goal Command

One of the things people ask me a lot is: why don't we use `/goal` to implement our [specs](https://www.aihero.dev/ai-coding-dictionary/spec)?

## The `/goal` Theory

The theory here is we would create a spec, and then we would use `/goal`, which is a feature of many [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) where the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) pursues a goal in a single [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) until that goal is complete.

The goal would be the destination, which is a very, very well-specified destination, and it seems like a great use case for `/goal`.

![Diagram showing spec definition at top with /goal definition below](https://res.cloudinary.com/total-typescript/image/upload/v1785751619/ai-hero-images/wrzqrh5xtiygf5hnc1xs.png)

## The Problem: The Dumb Zone

However, all of the implementations of `/goal` that I've seen don't really take advantage of the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone). It's all done in a single context window, relying on [auto-compaction](https://www.aihero.dev/ai-coding-dictionary/autocompact) to manage it.

And so what you end up with is a little bit of smart zone at the start, and then a whole lot of dumb zone.

Every time I've tried this, I see the same setup. So I still believe that the spec-and-tickets approach is better than the spec-and-`/goal` approach.

## The Caveat: If Auto-Compaction Improves

However, if auto-compaction ever got good enough that the dumb zone would not be an issue, then I would consider this to be a really nice setup.

You're still doing all of the work to kind of think about the spec. It's just that the thing you're handing it over to now is in charge of:

- Its own context management
- Its own [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) management
- Understanding all of the tasks that need to be done

And you can still do one large [code review](https://www.aihero.dev/ai-coding-dictionary/human-review) at the end to check for spec compliance.

## My Current Recommendation: Use Tickets

But so far my current recommendation is to use tickets instead.

![Diagram showing four equal-width rectangles each containing green 'Smart', with shorter duration bar underneath](https://res.cloudinary.com/total-typescript/image/upload/v1785751619/ai-hero-images/vjn0dbsluoyezktgsuv3.png)

### Why Tickets Give You More Control

Tickets just give you a lot more control. They, I think, are often cheaper to use because you're doing most of your work in a lot of smart zones.

Creating tickets from the spec is often a really, really short job. It usually just takes me a couple of minutes.

On some of my workflows, which we're not really discussing in the course, I even generate tickets [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), so I don't even review them.

## Comparison: Spec-and-Tickets vs Spec-and-`/goal`

| Approach | Context Management | Cost | Zone Quality |
|----------|-------------------|------|--------------|
| **Spec-and-Tickets** | Multiple smart zones | Often cheaper | Mostly smart |
| **Spec-and-`/goal`** | Single context window | Potentially more expensive | Small smart zone, large dumb zone |

I think right now this feels a lot more robust than just using `/goal`.

## Your Experience May Vary

I would love to know, of course, if you have had different results from me, if you trust your auto-compaction more than I do, and `/goal` definitely seems like a good idea if it can work.

Nice work and I will see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "goal-single-window-dumb-zone",
    question: "Your harness offers a command that pursues a goal in a single context window until it is complete. You have a well-specified spec. Why still split it into tickets?",
    type: "multiple-choice",
    choices: [
      { answer: "dumbzone", label: "One window gives a small smart zone and then a lot of dumb zone" },
      { answer: "vague", label: "A spec is too vague to serve as a goal for the agent to pursue" },
      { answer: "review", label: "You get no chance to review the work against the spec at the end" },
      { answer: "slow", label: "Making tickets from a spec is slow, and a goal skips that step" }
    ],
    correct: "dumbzone",
    answer: "A single window leans on auto-compaction, so the run starts smart and spends the rest of its life dumb, while tickets keep you in several smart zones and are often cheaper for it. A spec is a very well-specified destination, which is what makes the goal idea tempting in the first place. You can still do one large review for spec compliance at the end. And turning a spec into tickets usually takes a couple of minutes."
  }} />
  <QuizQuestion data={{
    id: "goal-needs-better-autocompaction",
    question: "What would have to improve before pursuing a goal in one window became a good setup?",
    type: "multiple-choice",
    choices: [
      { answer: "compaction", label: "Auto-compaction, enough that the dumb zone stopped being an issue" },
      { answer: "windows", label: "Context windows, enough to hold a whole project's work at once" },
      { answer: "price", label: "Token prices, enough to make one very long run the cheap option" },
      { answer: "review", label: "Code review, enough to run inside the same window as the work" }
    ],
    correct: "compaction",
    answer: "The blocker is the dumb zone, and auto-compaction is what is being relied on to manage it. A bigger window does not help, because the problem is the quality of the later part of the window rather than running out of room. Price is a symptom, not the cause. And review already works fine as one large pass after the fact."
  }} />
</Quiz>
