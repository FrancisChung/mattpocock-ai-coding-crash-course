# Models, Harnesses, Agents, Environments

The first most important thing you'll need to understand in order to work with AI [agents](https://www.aihero.dev/ai-coding-dictionary/agent) is what an agent even is, what its component parts are, and how they relate to each other.

There are four key elements to understand:

- **The [environment](https://www.aihero.dev/ai-coding-dictionary/environment)** - The outside world your agent interacts with
- **The [model](https://www.aihero.dev/ai-coding-dictionary/model)** - The thinking engine
- **The agent** - The model harnessed in an environment
- **The [harness](https://www.aihero.dev/ai-coding-dictionary/harness)** - What connects the model to the environment

![Diagram showing the four components: environment, model, agent, and harness](https://res.cloudinary.com/total-typescript/image/upload/v1783682671/ai-hero-images/zc6ciwnbhrbifp4mrxsy.png)

## The Model: The Thinking Engine

The model is the engine in the car. It's the thinking brain inside the whole setup.

Examples of models include:

- Claude Opus
- Claude Sonnet
- GPT 5.5
- Grok

These models usually sit on some server somewhere, and they charge you for access to make requests to them.

On its own, the model doesn't really do much. You pass it text, and it gives you back some text. To make it actually useful in the world, you need some kind of harness around it.

## The Harness: Connecting Model to World

The harness connects that model (that text-producing [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless) thing) to the outside world. That outside world is represented by the environment.

The harness is tied to the environment it's in. It's designed around that environment.

For example:

- **Code editors and IDEs** have an environment of the [file system](https://www.aihero.dev/ai-coding-dictionary/filesystem). They use [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) to interact with the file system, save files, edit files, and search the web.
- **Chat interfaces** like ChatGPT or Claude.ai have their own environments. In Claude.ai, you can save documents and search the web. It's a slightly different virtual environment from the file system.

## Defining an Agent

**An agent is a model harnessed in an environment**.

The agent isn't really a separate thing. It's just a name for what we call the harness and the model together. When we talk about Claude Opus running in an IDE on the file system, that is an agent. It's also a harness wrapping a model.

Here are some concrete examples of agents:

- **Opus running in an IDE** on the file system
- **Grok (the model)** on Pi (the harness) operating on the file system (the environment)
- **GPT 5.5** on ChatGPT in the ChatGPT environment, where it can create documents, search the web, and connect to [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) servers

## The Blurry Lines

Like every analogy, this isn't a perfect one. The harness and the environment blur together a little bit.

For instance, if you have an NPM script, is that an aspect of the harness? Is it something the harness can call, or is it something in the environment? It's in the environment, but other people might say it's in the harness. There's a little bit of bleed there.

## Improving Performance Beyond Just the Model

People go crazy for the model. Everyone wants to swap in the latest and greatest model and expects everything to become amazing.

But the model is just one aspect in a larger ecosystem. It's just the engine of the car.

If you want your agent to perform better, you can do more than just swap out the model. You can think about:

- Improving the harness
- Improving the environment in which the harness and model operate

[Training](https://www.aihero.dev/ai-coding-dictionary/training) a new model is unbelievably expensive and out of reach for most people and companies. So your work is going to be in improving the harness and improving the environment that the agent works in.

<Quiz>
  <QuizQuestion data={{
    id: "agent-is-model-plus-harness",
    question: "What is an agent?",
    type: "multiple-choice",
    choices: [
      { answer: "harnessed", label: "A model harnessed in an environment" },
      { answer: "trained", label: "A model trained on your own codebase" },
      { answer: "toolset", label: "A set of tool calls wrapped in a script" },
      { answer: "chat", label: "A chat interface that can search the web" }
    ],
    correct: "harnessed",
    answer: "The agent is not a separate thing - it is the name for the harness and the model together. A model on its own only turns text into text, so a model alone is not an agent. Tool calls are how a harness reaches its environment, not the agent itself. And a chat interface is one example of a harness plus an environment, not the definition."
  }} />
  <QuizQuestion data={{
    id: "improving-agent-beyond-the-model",
    question: "Your agent keeps underperforming on your project. Where is most of your leverage to fix it?",
    type: "multiple-choice",
    choices: [
      { answer: "harness", label: "Improve the harness and the environment it works in" },
      { answer: "swap", label: "Swap in the newest and most capable model you can find" },
      { answer: "train", label: "Train a new model on the code your team has written" }
    ],
    correct: "harness",
    answer: "The model is only one part of a larger ecosystem - the engine of the car. Swapping the model is the thing everybody reaches for first, but it leaves the other two parts untouched. Training a new model is unbelievably expensive and out of reach for most people and companies. That leaves the harness and the environment, which is where your work actually is."
  }} />
</Quiz>
