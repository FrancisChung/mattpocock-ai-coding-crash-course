# How to Tackle Massive Tasks

You have hopefully been infected by my [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) paranoia. As you can tell, I'm constantly thinking about the [context](https://www.aihero.dev/ai-coding-dictionary/context), constantly thinking about the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and the dumb zone.

## Staying in the Smart Zone

With the current generation of [models](https://www.aihero.dev/ai-coding-dictionary/model), what I advocate for is staying inside the early part of the context window, the smart zone.

And that is fine for tasks that only require you to operate in one context window. So small features or bug fixes, one [session](https://www.aihero.dev/ai-coding-dictionary/session) start to finish.

![Tasks #1 and #2 fitting entirely within the smart zone](https://res.cloudinary.com/total-typescript/image/upload/v1785746820/ai-hero-images/dlzjpatyo2uvlinpnurk.png)

## When Tasks Don't Fit

But what happens when you try to do something larger, something that will go into the dumb zone, like a refactor that touches every layer of the application?

Or something where it's just obvious up front that it's not even going to fit into a single context window, let alone fit into the smart zone?

![Task #3 spilling into the dumb zone and task #4 overflowing the entire context window](https://res.cloudinary.com/total-typescript/image/upload/v1785746820/ai-hero-images/qk2upijustihkz3vrgqe.png)

In other words, how do you ship huge chunks of work all at once?

## Breaking Down the Problem

Well, you do it in the way that devs have been doing it for decades. You take the big task and you break it down into small chunks, each of which can fit into the smart zone of the [agent](https://www.aihero.dev/ai-coding-dictionary/agent).

![Task #4 broken down across four smart zone boxes](https://res.cloudinary.com/total-typescript/image/upload/v1785746821/ai-hero-images/ltpkc4slcmjfjtpmflxv.png)

So the question then becomes, what kind of upfront planning do you need to do to make this work? Because up to this point, our plans have really only been to last the duration of a single context window.

We've not really considered what it might look like to have an agent work over multiple sessions, to have work that spans multiple context windows.

## Two Essential Documents

I've been experimenting with this a lot and trying out lots of different approaches, and I've landed on one that relies on having two documents.

### 1. The Spec

![Spec definition: a handoff artifact describing the destination of a multi-session piece of work](https://res.cloudinary.com/total-typescript/image/upload/v1785746822/ai-hero-images/cdlh4y2suvu6hvnrwxf8.png)

The first document we need is a description of the destination, the place that we're going. Because if we don't know where we're heading, how are we going to complete the task or know that we did it correctly?

I'm going to call this destination document a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), a [handoff artifact](https://www.aihero.dev/ai-coding-dictionary/handoff-artifact) describing the destination of a multi-session piece of work.

This spec is going to be passed to every single session so the individual session knows how its work contributes to the final goal.

We're also going to use the spec at the end to review it, to make sure that we actually got where we said we were going.

### 2. Tickets

But there's a problem. If you only specify the destination in the spec, how does the agent know how to break it down into small chunks? We need to describe the journey as well as the destination.

![Tickets definition showing both spec and tickets as handoff artifacts](https://res.cloudinary.com/total-typescript/image/upload/v1785746823/ai-hero-images/ypvllb4glotxq93lhajh.png)

This is why alongside the spec, you also write [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket). So one ticket per piece of work that you want to fit into a smart zone. So here we would have four tickets.

Each ticket describes what's going to be done in that session, so it's an implementation plan for that spec.

## Scaling Ambitious Work

With this approach, you can take on seriously ambitious work. I've had enormous specs with 30 tickets underneath that have turned out okay.

And so that's the idea of this section. We are going to be talking about how to use specs and tickets to ship larger, more ambitious projects than you could conceive of before.

<Quiz>
  <QuizQuestion data={{
    id: "break-work-into-smart-zone-tickets",
    question: "A refactor touches every layer of your application, and it is obvious up front that it will not fit inside one context window. How do you set the work up?",
    type: "multiple-choice",
    choices: [
      { answer: "chunks", label: "Write a spec for the destination, then one ticket per chunk" },
      { answer: "single", label: "Run it as one long session and let it fill the whole window" },
      { answer: "speconly", label: "Write one very detailed spec and hand it to a single session" },
      { answer: "adhoc", label: "Start on the first file and decide the next step as you go" }
    ],
    correct: "chunks",
    answer: "The break-down exists so that each piece of work fits into an agent's smart zone. A single long session spends most of its life in the dumb zone, or overflows the window entirely. A spec on its own only describes the destination, so nothing tells the agent how to split the journey up. And deciding as you go gives no destination to review the finished work against."
  }} />
  <QuizQuestion data={{
    id: "spec-destination-tickets-journey",
    question: "What is the difference between a spec and a ticket?",
    type: "multiple-choice",
    choices: [
      { answer: "destination", label: "The spec is the destination; each ticket is one leg of the journey" },
      { answer: "length", label: "The spec is the long version; a ticket is the same plan written short" },
      { answer: "order", label: "The spec is written after the tickets, to record what got built" },
      { answer: "audience", label: "The spec is for you to read; the tickets are for the agent to read" }
    ],
    correct: "destination",
    answer: "The spec describes where the work is going, and it is handed to every session so each one knows how its piece contributes. Tickets describe the journey, one per piece of work that fits a smart zone, so they are not a shorter restatement of the same thing. The spec comes first, and it is written to be read by both you and the agent."
  }} />
</Quiz>
