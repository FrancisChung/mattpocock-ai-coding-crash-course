# Non-Determinism

The [model](https://www.aihero.dev/ai-coding-dictionary/model) is just one part of the [agent](https://www.aihero.dev/ai-coding-dictionary/agent). There's also the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) and the [environment](https://www.aihero.dev/ai-coding-dictionary/environment). Understanding how these components work together is key to influencing the outcome of your AI coding agent.

Let's focus on the model itself, because understanding it will help us grasp the core of everything that's going on.

## Next Token Prediction

The main thing to understand about models is that they're doing [next token prediction](https://www.aihero.dev/ai-coding-dictionary/next-token-prediction). However you try to change it, however you try to manipulate it, it's always [non-deterministic](https://www.aihero.dev/ai-coding-dictionary/non-determinism).

### How Token Prediction Works

Models work by taking a sequence of [tokens](https://www.aihero.dev/ai-coding-dictionary/token) as input. Think of it like completing a sentence:

> my space favorite space color space is space

These are all candidates for the next token. The model has to guess what comes next.

The important part is that the model is asking itself to choose the next token. It has a set of candidates already in its [training](https://www.aihero.dev/ai-coding-dictionary/training) weights.

The model looks across all possible tokens and identifies the most likely candidates. From there, it assigns a probability to each one.

| Candidate | Probability |
| --------- | ----------- |
| red       | 32%         |
| blue      | 28%         |
| orange    | 14%         |

![Visual representation of token candidates and their probability distributions](https://res.cloudinary.com/total-typescript/image/upload/v1783688617/ai-hero-images/wwkmhs2fabb9t9stguwy.png)

### The Sampling Process

At this point, the prediction goes into the sampler. The sampler takes a sample of each candidate and essentially picks one.

You might think: "Why wouldn't it always just pick the most likely option?" That makes the most sense, right?

What's interesting about large language models is that sometimes they pick the most likely option, sometimes they pick a less likely one, and sometimes they will even pick a relatively unlikely possibility.

This is because the sampler is usually tuned to be random or relatively random, a sort of weighted randomness. There are lots of different sampling algorithms, many of which are non-deterministic, and a couple which are deterministic. But most agents pick non-determinism.

## Temperature Control

There's also a concept called `temperature` that you can pass to most samplers. Most models will accept a temperature setting.

- **High temperature**: The model chooses more randomly
- **Low temperature**: The model chooses less randomly and will always pick the most likely option

So your question probably is: "Why wouldn't I always set temperature to zero?" Surely when coding, there's always a correct answer that's best, and you should be able to get the model to choose it every time.

![Temperature scale showing relationship between temperature, diversity, and output quality](https://res.cloudinary.com/total-typescript/image/upload/v1783688618/ai-hero-images/qvqdrxuc2y6mfvc9aonp.png)

## The Likelihood Trap

This is actually a well-known trap in language modeling. It's called the **likelihood trap**, from a paper called "Trading Off Diversity and Quality in Natural Language Generation."

Here's what the research shows:

As you decrease temperature and remove diversity from the output, always making the model choose the same thing, the quality actually drops.

You can see this in the paper's data. As temperature increases initially, they get better quality, reaching a peak point. But as they continue reducing temperature even further, the responses start getting worse again.

This scale is based on human judgment. Humans actually judge these really deterministic responses to be worse.

![Graph showing the likelihood trap with quality peaking at moderate temperature, not at zero](https://res.cloudinary.com/total-typescript/image/upload/v1783688619/ai-hero-images/vhmbguji3w6cj42arlf9.png)

## Non-Determinism Is a Feature

This means that non-determinism is a feature, not a bug.

If you get the agent to choose the most likely candidate every time, you fall into the likelihood trap, and your responses are going to get worse.

And by the way, even if you do turn temperature to zero, because of the way that models do their work (massively in parallel, with the order of computation mattering), even on the same GPU with the same model, it's going to return different responses each time. It's very strange.

This means non-determinism is baked into the pie here. We cannot get rid of it.

## What This Means for AI Coding

When you watch exercises being performed, your agent is probably going to do something different. That difference and the variance here is something we need to get used to and get better at dealing with.

Non-determinism echoes down into permissions as well. There's always a non-zero chance that the agent will do something really weird and really bad, even if it's very smart.

Keep this in your mind all the time: **non-determinism is baked in. You cannot remove it.** You can get your systems to perform more reliably, but there's always this non-deterministic engine at the base of it.

<Quiz>
  <QuizQuestion data={{
    id: "temperature-zero-likelihood-trap",
    question: "You want your coding agent to give the same good answer every time, so you set the temperature to zero. What do you actually get?",
    type: "multiple-choice",
    choices: [
      { answer: "trap", label: "Lower quality output: this is the likelihood trap" },
      { answer: "best", label: "The highest quality answer it can give, every run" },
      { answer: "same", label: "An identical response on every single run you make" }
    ],
    correct: "trap",
    answer: "The research behind the likelihood trap shows quality peaking at a moderate temperature and then falling again as you keep removing diversity, so zero is not the quality setting people assume it is. Identical output is not on offer either: models compute massively in parallel and the order of computation matters, so the same model on the same GPU still returns different responses at temperature zero."
  }} />
  <QuizQuestion data={{
    id: "non-determinism-and-permissions",
    question: "Your agent runs a very capable model and has behaved well all week. How should that change the way you think about its permissions?",
    type: "multiple-choice",
    choices: [
      { answer: "unchanged", label: "Not at all: a smart agent can still do something bad" },
      { answer: "loosen", label: "Loosen them, because a smart model has earned the trust" },
      { answer: "temperature", label: "Loosen them, but only after you set the temperature to zero" }
    ],
    correct: "unchanged",
    answer: "Non-determinism echoes down into permissions: there is always a non-zero chance the agent does something really weird and really bad, even when it is very smart. A good week is a sample, not a guarantee, so intelligence does not buy trust here. And temperature zero does not close the gap either, because non-determinism is baked in and cannot be removed."
  }} />
</Quiz>
