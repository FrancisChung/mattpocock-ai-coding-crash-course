# Sessions And The Context

Looking at the request logs from our previous lesson, we need to introduce a key term: the [agent](https://www.aihero.dev/ai-coding-dictionary/agent)'s [context](https://www.aihero.dev/ai-coding-dictionary/context).

All of this text, the instructions on how to use Git, the parameters, the scope, all of these different [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call), these are what we call the agent's context. It's the available information that the agent has access to.

![Request logs showing Git instructions, parameters, scope, and tool calls](https://res.cloudinary.com/total-typescript/image/upload/v1783949674/ai-hero-images/xwy8khw7l0ovbyhc997s.png)

This text gets turned into [tokens](https://www.aihero.dev/ai-coding-dictionary/token) so the agent can then do [next token prediction](https://www.aihero.dev/ai-coding-dictionary/next-token-prediction). After all of this context, the agent is simply producing a little piece of text in response.

## Context Window Limits

You probably also know that there's a maximum amount of context that any [model](https://www.aihero.dev/ai-coding-dictionary/model) can receive.

![Arena.ai leaderboard showing LLM context window specifications](https://res.cloudinary.com/total-typescript/image/upload/v1783949675/ai-hero-images/ggnfzfhryjcu6xifnrxy.png)

Let's look at a leaderboard for LLMs. You can see it lists scores, price per million tokens, and context window on the right side:

| Model               | Context Window     |
| ------------------- | ------------------ |
| GPT 5.6 Sol         | 1.1 million tokens |
| Gemini 3 Pro        | 1 million tokens   |
| GPT 5.2 Chat Latest | 128k tokens        |

This [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) is a somewhat arbitrary number. It's picked by the developers based on how much context they think their model and infrastructure can handle.

If you send the [model provider](https://www.aihero.dev/ai-coding-dictionary/model-provider) too many tokens in a single request, the request will fail. It won't produce any [output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens).

## Managing Context and Costs

Managing the text that's in your context is really, really important.

Every time you send a request to a model provider, you are going to get billed for that text. You need to make sure that:

- The stuff you're sending is worth sending
- The stuff you're sending is relevant to the task at hand

If you send models a ton of text, they can get confused and distracted in the same way that humans can.

## System Prompts and Harnesses

Whenever you're using a [harness](https://www.aihero.dev/ai-coding-dictionary/harness) (an agentic framework or wrapper), the context window never starts at zero.

The harness wraps the agent and gives it custom instructions right from the start:

- It tells the agent what [tools](https://www.aihero.dev/ai-coding-dictionary/tool) are available
- It gives high-level instructions for what the agent is supposed to do
- It specifies what role the agent is supposed to inhabit

This is often called the [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt). Here's an example:

```
You are Claude Code, Anthropic's official CLI for Claude.

<!-- cache_control breakpoint -->


You are an interactive agent that helps users with software engineering tasks.

IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases.
```

The harness you choose has a lot of influence over the text that's sent to the agent. Different harnesses send different amounts of text.

## Sessions and Turns

We need a term for what happens when we build up the context over multiple [turns](https://www.aihero.dev/ai-coding-dictionary/turn): a [session](https://www.aihero.dev/ai-coding-dictionary/session).

Over multiple turns with the agent, you build up stuff in the context so the agent can see every single thing that's happened in that session.

For instance, in a conversation:

- Turn 1: five [model provider requests](https://www.aihero.dev/ai-coding-dictionary/model-provider-request)
- Turn 2: three requests
- Turn 3: four requests

On that last model provider request, when you send the entire conversation history so far and get back the response, that is the latest stuff in the context. This whole thing is the session.

![Diagram showing multiple turns building up context within a session](https://res.cloudinary.com/total-typescript/image/upload/v1783949676/ai-hero-images/fe1hm4txutzugjyzpbzd.png)

This is important because you can:

- [Clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the context and start a new session
- [Compact](https://www.aihero.dev/ai-coding-dictionary/compaction) the session
- Move to a separate session and come back later

Having a word for this is very important when we're thinking about and navigating our interactions with agents.

## Key Terms

| Term           | Definition                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Context        | All the available information that the agent has access to, including instructions, parameters, scope, and tool calls |
| Context Window | The maximum amount of context (in tokens) that a model can receive in a single request                                |
| System Prompt  | The initial instructions given to the agent by the harness, defining its role and behavior                            |
| Session        | A continuous conversation with an agent, where context builds up over multiple turns                                  |

## Next Steps

Continue exploring these logs, this time looking specifically at the system prompt to see what's in there.

Your agent probably looks very different from what we've shown, and even if you're using Claude Code, they change these things all the time. So there are probably different tweaks here from what's shown on screen.

<Quiz>
  <QuizQuestion data={{
    id: "context-window-overflow-fails-request",
    question: "You send a model provider more tokens than the model's context window allows. What happens?",
    type: "multiple-choice",
    choices: [
      { answer: "fails", label: "The request fails and gives you no output tokens" },
      { answer: "trims", label: "The oldest messages are dropped and the rest is sent" },
      { answer: "billed", label: "It goes through, but you are billed at a higher rate" }
    ],
    correct: "fails",
    answer: "The context window is a hard limit on a single request: go over it and the request fails, producing no output tokens at all. Nothing quietly trims the history for you, so assuming the oldest messages fall away will leave you surprised. And there is no overflow price - you cannot pay your way past the window."
  }} />
  <QuizQuestion data={{
    id: "session-context-never-starts-at-zero",
    question: "You open a brand new session in a harness and have not typed anything yet. How much context is already in it?",
    type: "multiple-choice",
    choices: [
      { answer: "system", label: "Some: the harness has already sent a system prompt" },
      { answer: "zero", label: "None: the context window starts at exactly zero" },
      { answer: "firsttool", label: "None until the agent makes its first tool call" }
    ],
    correct: "system",
    answer: "Whenever you use a harness, the context never starts at zero. The harness has already told the model what tools exist, what it is supposed to do, and what role to inhabit - that is the system prompt. Tool calls add to the context later, but they are not what puts the first tokens there, and different harnesses send very different amounts of this text."
  }} />
  <QuizQuestion data={{
    id: "context-text-is-billed-and-distracting",
    question: "Why does it matter to keep irrelevant text out of your context?",
    type: "multiple-choice",
    choices: [
      { answer: "both", label: "You pay for it each request, and it distracts the model" },
      { answer: "limit", label: "It only matters once you get near the context window" },
      { answer: "speed", label: "It slows the harness down when it saves the session" }
    ],
    correct: "both",
    answer: "Two costs run in parallel here. You get billed for that text on every request, and it is sent again on every request in the session. On top of that, models given a ton of text get confused and distracted in the same way humans do, so the damage starts long before you approach the window limit. Harness save speed is not the concern."
  }} />
</Quiz>
