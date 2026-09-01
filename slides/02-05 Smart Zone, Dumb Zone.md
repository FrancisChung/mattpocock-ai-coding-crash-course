# Smart Zone / Dumb Zone

Looking at logs with thousands of tokens might seem overwhelming. A typical [agent](https://www.aihero.dev/ai-coding-dictionary/agent) interaction uses around 18k [tokens](https://www.aihero.dev/ai-coding-dictionary/token), but modern [models](https://www.aihero.dev/ai-coding-dictionary/model) can handle up to a million tokens in their [context window](https://www.aihero.dev/ai-coding-dictionary/context-window). You could send 950,000 tokens and get back 50,000.

But there's a natural skepticism here: **Can the model really reason about all this text at once?**

## Attention Relationships

To understand what's happening under the hood, let's think about how a model processes tokens.

When you send a single token, like the word "the", there's no relationship to track. It's just one thing.

But add a second token, like "frog," and something changes. Now the model needs to:

- Remember both tokens
- Track the relationship between them

Even with just two tokens, you're tracking three things: token one, token two, and their relationship.

![Diagram showing two tokens with one relationship between them](https://res.cloudinary.com/total-typescript/image/upload/v1783951630/ai-hero-images/gj8hqwdawe7gkdbt7zba.png)

Add a third token, and the problem multiplies. Now you need to track:

- All three tokens
- The relationship between tokens 1 and 2
- The relationship between tokens 1 and 3
- The relationship between tokens 2 and 3

That's three tokens and three relationships.

![Diagram showing three tokens with three relationships connecting them](https://res.cloudinary.com/total-typescript/image/upload/v1783951631/ai-hero-images/y85xwe9nfovohbwntu87.png)

**The pattern scales quadratically.** Every time you add a token, the number of relationships explodes:

| Tokens | Relationships |
| ------ | ------------- |
| 2      | 1             |
| 3      | 3             |
| 4      | 6             |
| 5      | 10            |

![Diagram showing five tokens with ten relationships](https://res.cloudinary.com/total-typescript/image/upload/v1783951632/ai-hero-images/kro1sersqoefocgetom2.png)

This is like adding a football team to a league. It sounds simple, but suddenly the number of games that league has to play scales massively.

**Look at the scale at a thousand tokens:** 1 million relationships. **10,000 tokens:** 100 million. **100,000 tokens:** around 10 billion.

![AI coding dictionary showing token to relationship scaling](https://res.cloudinary.com/total-typescript/image/upload/v1783951633/ai-hero-images/pojsmqiun7ajunirti1s.png)

These [attention relationships](https://www.aihero.dev/ai-coding-dictionary/attention-relationship) are how the model finds connections in text, jumps around it, and understands it. The more relationships it has to track, the worse it performs. It's like lots of people shouting for attention in a crowded room.

## Attention Degradation

This has a direct consequence: **the more text you send to a model, the worse it performs.**

It's less able to pay attention to what matters. This is called [**attention degradation**](https://www.aihero.dev/ai-coding-dictionary/attention-degradation). The attention mechanism, the system for understanding relationships between tokens, gets worse as it has more to handle.

In practice, as you pass more [context](https://www.aihero.dev/ai-coding-dictionary/context), your agent starts doing progressively dumber things.

## Smart Zone vs. Dumb Zone

![Diagram showing smart zone and dumb zone in context window](https://res.cloudinary.com/total-typescript/image/upload/v1783951634/ai-hero-images/epsqhluqhaoz4vfpp5bn.png)

Agents have two zones:

**[Smart Zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)** - Early in the context window, the agent performs complex tasks well:

- Planning
- Building complex software
- Strategic decisions

**Dumb Zone** - As context fills up, the agent struggles:

- Simple file writes
- Closing issues
- Writing basic specs

You might still get results in the dumb zone, but you're not getting the best out of your agent.

And there's a cost penalty too: every request sent into the dumb zone involves sending massive amounts of tokens at once, costing you more.

## Where Does The Dumb Zone Start?

This is heavily debated and moves per model. At the time of recording, the consensus for state-of-the-art models is that the dumb zone starts around **150,000 tokens**.

This has moved up significantly. The previous recording of this course put it at around 100k to 120k tokens. As models improve, expect the dumb zone to move further back, giving you more smart zone to work with.

![Text showing 150,000 tokens as the current dumb zone threshold](https://res.cloudinary.com/total-typescript/image/upload/v1783951635/ai-hero-images/v8ferohrfba45oz3agz5.png)

That 150k number might sound really low when [model providers](https://www.aihero.dev/ai-coding-dictionary/model-provider) advertise one million token context windows. **Why do they claim something they can't really use?**

First, it's a nice headline. Second, not all use cases need the smart zone. If you're just retrieving text over a long body of work, not building software, you don't need peak performance. That's why the million-token window exists.

For coding work, you want to stay in the smart zone. If you're doing a lot of work in the dumb zone, you'll produce lower quality code that you then need to spend tokens cleaning up.

## It's A Slope, Not A Cliff

The dumb zone isn't a cliff edge where you drop off immediately. It's a slow decline.

Use the 150k token mark as a signal. When your [session](https://www.aihero.dev/ai-coding-dictionary/session) reaches that point, start thinking about how to bail out. How can you [hand off](https://www.aihero.dev/ai-coding-dictionary/handoff) the work? How can you change your approach to get back into the smart zone?

This paranoia is extremely useful for getting high quality work at the lowest token price.

The entire approach should be designed around making the most of the smart zone.

## The Underlying Mechanism Doesn't Change

By the time you see this, the numbers might have moved. Different models might have different thresholds. But the mechanism underneath, attention degradation, isn't going away.

It's the constraint that underpins all LLMs right now. It happens because of how attention relationships scale up as you add tokens.

Understanding this mechanism is key to getting the best results from your agent.

<Quiz>
  <QuizQuestion data={{
    id: "dumb-zone-token-threshold",
    question: "For today's state-of-the-art models, roughly where does the dumb zone start?",
    type: "multiple-choice",
    choices: [
      { answer: "150k", label: "Around 150,000 tokens" },
      { answer: "110k", label: "Around 110,000 tokens" },
      { answer: "1m", label: "Around 1,000,000 tokens" }
    ],
    correct: "150k",
    answer: "The consensus puts it around 150,000 tokens. The 100k to 120k figure is where the threshold used to sit - it has moved up as models improved, and it will keep moving. A million tokens is the advertised context window, not the point where quality starts to fall; the two numbers are far apart on purpose."
  }} />
  <QuizQuestion data={{
    id: "attention-relationships-scale-quadratically",
    question: "What is the mechanism that makes a model perform worse as you send it more text?",
    type: "multiple-choice",
    choices: [
      { answer: "attention", label: "Attention relationships grow quadratically with tokens" },
      { answer: "truncation", label: "The harness truncates the oldest part of the context" },
      { answer: "temperature", label: "The sampler raises temperature as the context grows" }
    ],
    correct: "attention",
    answer: "Each token added has to be related to every other token, so the relationship count explodes: 1,000 tokens is a million relationships, 100,000 tokens is around 10 billion. The more it tracks, the worse it attends. Nothing is being truncated and no setting is being changed behind your back - this is attention degradation, and it is why the numbers may move but the constraint will not go away."
  }} />
  <QuizQuestion data={{
    id: "smart-zone-bailout-at-threshold",
    question: "Your session has just passed 150,000 tokens and the coding work is not finished. What now?",
    type: "multiple-choice",
    choices: [
      { answer: "handoff", label: "Start working out how to hand the work off and reset" },
      { answer: "carryon", label: "Carry on, because quality drops off a cliff much later" },
      { answer: "bigwindow", label: "Move to a model advertising a million token window" }
    ],
    correct: "handoff",
    answer: "Treat the 150k mark as a signal to bail out - hand off the work, or change the approach to get back into the smart zone. Carrying on gets this backwards: the decline is a slope, not a cliff, so you are already losing quality rather than waiting for a drop. And a million token window does not buy you smart zone; it exists for retrieval over long text, not for building software."
  }} />
</Quiz>
