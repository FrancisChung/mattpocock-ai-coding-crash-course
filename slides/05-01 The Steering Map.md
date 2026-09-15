# The Steering Map

Every time you start a fresh [session](https://www.aihero.dev/ai-coding-dictionary/session), the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) wakes up knowing nothing about how you work. That isn't a bug - it's what [**stateless**](https://www.aihero.dev/ai-coding-dictionary/stateless) means. The [model](https://www.aihero.dev/ai-coding-dictionary/model) carries nothing from one session to the next, so your conventions, your edge cases, and the patterns that you want to encode in your project are gone the moment you [clear the context](https://www.aihero.dev/ai-coding-dictionary/clearing).

**Steering** is the question of how you guide the agent's behavior across different sessions. Which instructions should reach the agent every time, and how do you deliver them without having to restate them every time you do more work?

**So where should those steering instructions live?** That's what this section answers.

## Understanding Context Load

Before we answer that, we need to tackle the idea that the rest of this section depends on.

**Anything that you load into the agent up front, you pay for on every single [model provider request](https://www.aihero.dev/ai-coding-dictionary/model-provider-request).**

A session can contain multiple [turns](https://www.aihero.dev/ai-coding-dictionary/turn), and each of these turns contains many model provider requests, where you send a request and receive a response. A single turn can last 15 minutes and contain hundreds of model provider requests. There can be many, many turns within a session.

![Diagram showing a session with three turns, each turn containing multiple model provider requests represented as light blue dots](https://res.cloudinary.com/total-typescript/image/upload/v1785240099/ai-hero-images/kpatkbzczx6ceeukphjb.png)

Each model provider request carries all of the history and everything new along with it. **Any little instruction that you add early in the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) is going to be passed in on every single request.**

![Context load diagram showing five numbered requests, each row containing blocks representing the growing payload with a violet block at the front being re-sent every time](https://res.cloudinary.com/total-typescript/image/upload/v1785240100/ai-hero-images/w0nkvqqwigeaoxedqi9o.png)

You still get some [caching](https://www.aihero.dev/ai-coding-dictionary/prefix-cache), so the cost is slightly lowered based on what you would expect, but it is still frustrating to have that thing in the window if it's not needed on every request.

### The Two Costs of Context Load

**You're paying [tokens](https://www.aihero.dev/ai-coding-dictionary/token) to include these steering instructions on every request.** But there's a second cost: **you're also paying in [attention](https://www.aihero.dev/ai-coding-dictionary/attention-budget).**

Every extra instruction that you load makes every other instruction a little bit quieter and pushes the agent a little bit closer to the [dumb zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone).

![Attention diagram showing five empty boxes with arrows scattered across them, clustered densely at the left and thinning out toward the right](https://res.cloudinary.com/total-typescript/image/upload/v1785240100/ai-hero-images/ilerrt0gymc12zmde3om.png)

That combined cost, paying more tokens and spreading your agent's attention thinner, is what we'll call **context load**. And every time you have a steering instruction, you need to think about the context load that steering instruction is providing.

**So when we talk about steering, we're not just thinking about writing good rules for our agent. It's about figuring out which rules, which patterns we encode in the context window, because we pay a cost in context load for everything we add.**

## Push vs Point: Two Strategies for Steering

Whenever we want to steer our agent, there are really two choices on how we can choose to steer it. We can either **push** that instruction or we can **point** at the instruction.

### Push: Always-On Steering

Imagine the agent's context window looks like a box, and our instruction is a yellow blob sitting inside it. When we push the instruction to the agent, it means that steering instruction is always on. It sits in the context window for every single session. The agent cannot miss it because it's already in its context window.

That means it's costing us context load whether this turn needs it or not.

![Push diagram showing the context window with a large yellow block inside representing a steering instruction that is always present](https://res.cloudinary.com/total-typescript/image/upload/v1785240101/ai-hero-images/hirqymqtrxl7yrzo3fea.png)

### Point: On-Demand Steering

When you point, you put the steering instructions somewhere in the [environment](https://www.aihero.dev/ai-coding-dictionary/environment). You put one little line in the context window just to point to it. This line could read: "when you're doing a certain kind of work, then use these instructions." That line is a [**context pointer**](https://www.aihero.dev/ai-coding-dictionary/context-pointer).

It's a pointer that sits in the context window so that when the agent needs it, it goes and follows the pointer, pulls in the full instruction.

Most turns a context pointer will cost you almost nothing.

![Point diagram showing the context window with a tiny yellow square inside and a yellow arrow leading down to a full yellow block outside the window](https://res.cloudinary.com/total-typescript/image/upload/v1785240102/ai-hero-images/ydjdzsmqfdihbebfljqe.png)

| Strategy | Cost                  | Availability     |
| -------- | --------------------- | ---------------- |
| Push     | High on every request | Always present   |
| Point    | Minimal most turns    | Only when needed |

![Side-by-side comparison of Push and Point strategies, showing the context window with a large block inside for Push versus a tiny pointer square for Point](https://res.cloudinary.com/total-typescript/image/upload/v1785240103/ai-hero-images/ahd4ovjwdm5s4szn7fn7.png)

## Where Pushed Steering Lives: AGENTS.md

So how do you push to an agent context window? One technique is the [AGENTS.md](https://www.aihero.dev/ai-coding-dictionary/agents-md) file. This is a file often at the root of your project that the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) loads into the context window at the session start.

`AGENTS.md` is a cross-harness convention, so whatever tool that you're using probably will understand it. The big exception here is Claude Code, which calls it `CLAUDE.md` for reasons beyond understanding. I'm going to call it `AGENTS.md`, not because I'm pedantic, but because someday I hope that `CLAUDE.md` will actually join in the bandwagon.

## When Pushed Rules Misfire

We understand the cost of pushing steering rules now - it's paid in context load on every request. But there's a bigger problem: **agents can't tell when the rules apply, and so they will often take rules that you've put as pushed steering rules and apply them in the wrong situations.**

Someone sent a really funny example of when an agent was too overeager to follow an instruction. And it actually happened not in a coding harness, but in claude.ai.

In claude.ai you can open up the settings and see instructions for Claude which act exactly like the `AGENTS.md` file. They are pushed into the agent's [context](https://www.aihero.dev/ai-coding-dictionary/context).

![Claude.ai settings screen showing the Instructions for Claude section](https://res.cloudinary.com/total-typescript/image/upload/v1785240104/ai-hero-images/wh6llq9dpga8yg67rtym.png)

Someone had an instruction kind of like this in their global instructions:

> I work under PCI DSS card payment compliance. Anything security relevant should be flagged.

Then they asked the agent how to bake a chocolate cake. It gave them the recipe but then added a note at the end that since they handle credit cards under PCI DSS they should consider the security implications of the chocolate cake.

![Browser showing a Claude.ai conversation titled 'Chocolate cake recipe' with the agent's response about PCI DSS compliance implications for baking](https://res.cloudinary.com/total-typescript/image/upload/v1785240105/ai-hero-images/wddma0p6p1i8blmghtne.png)

In other words, **these pushed rules can make the agents do strange things.** And we better make sure that the way that we're using the agent matches up to the rules that we have in there.

## The Epidemic of Over-Pushing

This advice will run counter to what a lot of people are doing right now. They are pushing tons of instructions into `CLAUDE.md` or `AGENTS.md`, and I think they're seeing worse results because of it.

There is an epidemic of pushing right now and so much so many tokens are being wasted. So much context load is being placed on these agents when I think instead you need to be considering techniques for pointing.

**In this course, in practice: you point by default.** And you let the agent decide whether to pull in those instructions or not.

That's how we're going to tackle the rest of the section. We're going to show techniques both for pushing and pointing. There are situations where you do want to push, and we'll show you about [skills](https://www.aihero.dev/ai-coding-dictionary/skill), about documentation inside the repo, and all the cool techniques that you can use to steer your agent without pushing too much context load.

<Quiz>
  <QuizQuestion data={{
    id: "steering-point-by-default",
    question: "A convention for writing database migrations comes up about once a week in your project, and it runs to forty lines. Where do you put it?",
    type: "multiple-choice",
    choices: [
      { answer: "pointer", label: "In its own file, with a one-line pointer in AGENTS.md" },
      { answer: "push", label: "Inline in AGENTS.md, so the agent can never miss it" },
      { answer: "prompt", label: "In a note you paste into prompts when it is relevant" }
    ],
    correct: "pointer",
    answer: "Inlining pays all forty lines on every model provider request, in every session, for a rule needed once a week - and every extra instruction makes the others a little quieter. Pasting it by hand moves the cost onto you, and you will forget on the week it matters. A pointer costs almost nothing most turns, and the agent pulls the file in when the work calls for it."
  }} />
  <QuizQuestion data={{
    id: "context-load-is-tokens-and-attention",
    question: "Loading forty lines at the start of every session costs you tokens on every request. What is the second cost you pay?",
    type: "multiple-choice",
    choices: [
      { answer: "attention", label: "Attention: every other instruction gets quieter" },
      { answer: "latency", label: "Latency: each request takes longer to come back" },
      { answer: "cache", label: "Caching: the discount no longer applies at all" }
    ],
    correct: "attention",
    answer: "Caching does not go away - you still get some, which lowers the cost slightly, so the discount is not what you lose. Speed is not what suffers either. Attention is: every extra instruction loaded makes every other instruction a little quieter and pushes the agent closer to the dumb zone."
  }} />
  <QuizQuestion data={{
    id: "pushed-rules-fire-out-of-context",
    question: "Your always-on instructions say to flag anything security-relevant. The agent now appends compliance notes to work that has nothing to do with security. What fixes it?",
    type: "multiple-choice",
    choices: [
      { answer: "point", label: "Move the rule behind a pointer that says when to use it" },
      { answer: "condition", label: "Keep it pushed, and add wording about when it applies" },
      { answer: "repeat", label: "Restate the rule further down so the agent reads it" }
    ],
    correct: "point",
    answer: "The failure is that a pushed rule sits in front of the agent for every task, and the agent cannot tell when it applies. Extra wording leaves it pushed, so it still costs context load on every request and is still there during the chocolate cake question. Restating it makes it louder in exactly the situations where it should be silent. Put it in the environment and leave one line pointing at it."
  }} />
</Quiz>
