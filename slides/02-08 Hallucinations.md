# Hallucination

In a previous lesson, we talked about the [dumb zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and the smart zone, where [attention degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation) kicks in as the [session](https://www.aihero.dev/ai-coding-dictionary/session) gets longer and the [model](https://www.aihero.dev/ai-coding-dictionary/model) gets progressively worse. But we didn't really talk about what those "dumb things" actually are - what symptoms you're likely to see inside the dumb zone and sometimes even in the smart zone itself.

## The Core Problem: Hallucination

![Hallucination definition displayed on screen](https://res.cloudinary.com/total-typescript/image/upload/v1784024580/ai-hero-images/k4qdql452l89nqf1yhhx.png)

The big one, and the one we're always working to prevent at any cost, is [**hallucination**](https://www.aihero.dev/ai-coding-dictionary/hallucination) - confidently wrong model output.

A hallucination can be absolutely disastrous when you're coding. It can:

- Produce broken code
- Take you down a direction in the product you didn't want
- Recommend that you use an API that's no longer secure
- Do all sorts of really dangerous stuff

Often what we're trying to do is provide an [environment](https://www.aihero.dev/ai-coding-dictionary/environment) that gives the model things to work with that lessen the likelihood of hallucinations.

In this lesson, we're going to create a dictionary for hallucinations - a way of understanding how to prevent them and what they really are.

## Two Main Flavors of Hallucination

There are two main flavors of hallucination: **factuality** and **faithfulness**.

### Factuality Hallucination

A **factuality hallucination** is invented or simply wrong facts about the world. Examples include:

- A function that doesn't exist
- A wrong API signature
- A citation to an article that doesn't exist

These happen because of a lack of [**parametric knowledge**](https://www.aihero.dev/ai-coding-dictionary/parametric-knowledge).

## Understanding Parametric Knowledge

When the model is trained initially, the information in its [training](https://www.aihero.dev/ai-coding-dictionary/training) is stored in its [**parameters**](https://www.aihero.dev/ai-coding-dictionary/parameters). Every model's brain, its memory essentially, is stored in these huge arrays of numbers, sometimes billions and billions of numbers.

These are sometimes called **weights**. Parametric knowledge is the knowledge encoded in these parameters, and it's encoded once at the time the model is trained.

The reason the model is [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless) is that these parameters never change after that. They're literally frozen after the training process.

### The Problem With Parametric Knowledge

However, think about this: if you take all of the terabytes and terabytes of training data and compress them down into a couple of billion numbers, a lot of stuff going to get lost.

When you have a really detailed image and compress it down to a tiny size, you sometimes can't see the finer detail.

Not only that, but parametric knowledge has a cutoff to it. The model was trained at a certain time, and data that came after that - new events, new libraries, new APIs - has escaped the model. Models often need to be continually updated to make sure they've got the new stuff.

## Knowledge Cutoff

All models have a [**knowledge cutoff**](https://www.aihero.dev/ai-coding-dictionary/knowledge-cutoff). And the way training works is you can't just patch more information into the model - you have to retrain it from scratch.

![Knowledge cutoff concept displayed](https://res.cloudinary.com/total-typescript/image/upload/v1784024581/ai-hero-images/bz1izt12vqibu1oaeoma.png)

This means factuality hallucinations can come from two places:

1. You're asking for information that's after its knowledge cutoff
2. You're asking for information about stuff before the knowledge cutoff, but it's only got a kind of fuzzy JPEG - a blurry image to reference

The model isn't going to be very good at retrieving information from its parametric knowledge because of the way it's stored. It's not stored like a database of facts. It's just stored as fuzzy vibes.

## A Real Example: The X API Pricing

Here's a hallucination from Claude Opus. When asked "How expensive is the X API? Don't search for information, just tell me based on what you know," it replied:

> Based on my knowledge, which may be outdated, here are the rough tiers for the X Twitter API from my training:
>
> - Free: very limited
> - Basic: $100/month
> - Pro: $5,000/month
> - Enterprise: custom pricing

![Agent response showing outdated X API pricing](https://res.cloudinary.com/total-typescript/image/upload/v1784024582/ai-hero-images/x6gp672wjetimr2b2cnp.png)

This is actually not true. The pricing has gone down massively relatively recently. When we then ask it to search for the information, it goes off and searches - using web search - and checks whether its parametric knowledge was correct.

![Agent performing web search](https://res.cloudinary.com/total-typescript/image/upload/v1784024582/ai-hero-images/exjhndztsp3fzlfvfrar.png)

The search reveals that the pricing model changed significantly in February. This was actually before this current model's knowledge cutoff, so what we had there was a factuality hallucination - invented or wrong facts about the world.

![Corrected X API pricing after web search](https://res.cloudinary.com/total-typescript/image/upload/v1784024583/ai-hero-images/dmwdrmmgiklfy8wscou1.png)

## The Fix: Contextual Knowledge

The fix column shows us: load in the [**contextual knowledge**](https://www.aihero.dev/ai-coding-dictionary/contextual-knowledge). Contextual knowledge is knowledge that is in the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) of the model.

From research, hallucinations are much less common when the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) works from contextual knowledge. The answer is right in front of it, not dredged up from blurred memory.

However, contextual knowledge is not a cure for hallucinations because we also have **faithfulness hallucinations**.

![Faithfulness hallucination definition](https://res.cloudinary.com/total-typescript/image/upload/v1784024584/ai-hero-images/uzmdia0d3or52wnsfb79.png)

## Faithfulness Hallucination

A **faithfulness hallucination** is where even if you've passed the information to the LLM in its [context](https://www.aihero.dev/ai-coding-dictionary/context), it will:

- Ignore it
- Drift away from it
- Do something slightly strange with it

This is the thing that the dumb zone makes really, really bad because of attention degradation. Because you have so much information in the context, the model can't find the relevant stuff. There are so many [attention relationships](https://www.aihero.dev/ai-coding-dictionary/attention-relationship) to keep track of that it doesn't know which ones are the important ones.

This means that you can pass the agent all the relevant information. You can set things up perfectly. But if there's just too much in its context window, then it won't be able to follow instructions as well, and it will hallucinate more.

That means it will produce worse code, open you up to security risks, and do really strange stuff.

## A Decision Tree for Hallucinations

![Decision tree flowchart for diagnosing hallucinations](https://res.cloudinary.com/total-typescript/image/upload/v1784024585/ai-hero-images/unchljbemloc0eaegyxm.png)

Here's a decision tree you can use when you see a hallucination:

**First question: Was the information available in the model's context window?**

| Scenario | Problem Type         | Solution                                                  |
| -------- | -------------------- | --------------------------------------------------------- |
| **No**   | Factuality problem   | Load the information into context                         |
| **Yes**  | Faithfulness problem | Clear your context window to reduce attention degradation |

### If It's a Factuality Problem

If the information wasn't in the context, it's a factuality problem. The model is looking at its parametric knowledge and coming up short.

The fix: **Never trust an unsourced LLM.** Always make sure the agent is working from sourced information, from contextual info.

However, you might end up right back with another hallucination. And if the information is in context, then you've got a faithfulness problem.

### If It's a Faithfulness Problem

The agent is not being faithful to the information you've provided to it.

This can happen in the smart zone, but most of the time you've just got to get out of the dumb zone. Clear your context window. Make sure the attention degradation goes down. Let the agent relax a little bit.

It usually doesn't happen in the smart zone, but because models are [non-deterministic](https://www.aihero.dev/ai-coding-dictionary/non-determinism), you will very occasionally get a faithfulness error in the smart zone.

## The Long Game

The hope is that [model providers](https://www.aihero.dev/ai-coding-dictionary/model-provider) improve models to the point where we don't have to worry about hallucinations so much. Factuality and faithfulness errors are things they test for, but we can't really see a world in which we're not having to deal with these sometimes.

Knowing about how they work and understanding them at a deep level is a really important part of AI coding. During the rest of this course, keep an eye out for factuality errors and faithfulness errors - and now you'll know how to deal with them.

<Quiz>
  <QuizQuestion data={{
    id: "hallucination-in-context-means-faithfulness",
    question: "You pasted the exact file the agent needed into the context, and it still used a function from somewhere else. What do you do first?",
    type: "multiple-choice",
    choices: [
      { answer: "clear", label: "Clear the context window, then hand it the file again" },
      { answer: "more-files", label: "Paste in the surrounding files as well, to be thorough" },
      { answer: "search", label: "Ask it to search the web for the correct signature" },
      { answer: "retry", label: "Send the same prompt again and see if it lands" }
    ],
    correct: "clear",
    answer: "The information was in the context and the agent drifted from it, so this is a faithfulness problem, and the fix is to reduce attention degradation by clearing the context. Pasting in more files makes the degradation worse. Searching the web fixes a factuality problem, which this is not - the fact was already in front of the model. Resending the same prompt leans on non-determinism instead of removing the cause."
  }} />
  <QuizQuestion data={{
    id: "hallucination-unsourced-means-factuality",
    question: "The agent states an API's pricing that it was never given and that turns out to be wrong. What is the problem, and what is the fix?",
    type: "multiple-choice",
    choices: [
      { answer: "load", label: "A factuality problem - load sourced information into the context" },
      { answer: "clear", label: "A faithfulness problem - clear the context window and ask again" },
      { answer: "retrain", label: "A factuality problem - wait for the model to be retrained on it" },
      { answer: "drift", label: "A faithfulness problem - the model drifted away from its training" }
    ],
    correct: "load",
    answer: "The fact was never in the context, so the model was dredging it out of parametric knowledge - a factuality hallucination, fixed by never trusting an unsourced model and giving it a source. It cannot be a faithfulness problem, because faithfulness is about ignoring information the model was given. And waiting for a retrain is not a fix you control - the answer is available right now if you put it in the context."
  }} />
  <QuizQuestion data={{
    id: "knowledge-cutoff-requires-retraining",
    question: "A model's knowledge cutoff sits before a library you use. How does new information get into its parametric knowledge?",
    type: "multiple-choice",
    choices: [
      { answer: "retrain", label: "The model has to be retrained from scratch" },
      { answer: "patch", label: "The provider patches the new facts into the parameters" },
      { answer: "context", label: "Anything you put in the context is written back to it" },
      { answer: "tools", label: "A web search the model runs updates its parameters" }
    ],
    correct: "retrain",
    answer: "Parameters are frozen at the end of training, which is exactly why the model is stateless, so new information means a retrain rather than a patch. Context and web search results do help the model answer, but they are contextual knowledge and vanish with the context window - neither writes anything back into the parameters."
  }} />
</Quiz>
