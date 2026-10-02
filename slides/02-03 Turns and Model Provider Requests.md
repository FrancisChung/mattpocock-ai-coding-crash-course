# Turns And Model Provider Requests

One thing that many AI-powered developers lack is a way to describe what an actual [turn](https://www.aihero.dev/ai-coding-dictionary/turn) with an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) looks like.

How does the [harness](https://www.aihero.dev/ai-coding-dictionary/harness), which is usually running locally, communicate with the [model](https://www.aihero.dev/ai-coding-dictionary/model), which is usually sitting in the cloud? Understanding this is essential for the optimizations and thinking you'll do later.

## Setting Up the Request Logger

To understand this communication, you'll use the request logger. Run:

```
npm run request-logger
```

It asks which coding agent you use, and which model provider if your agent can use more than one. It can remember your answer, so it only has to ask once. It then prints the exact command to start that agent through the logger.

Copy and paste that command into a new terminal and run it. Now instead of pointing at the model provider's servers, your agent is pointing at your local request logger.

Next, open the side panel and navigate to the `./request-logger/logs` directory. It should currently be empty except for a `.gitkeep` file.

![File explorer showing empty logs directory with git keep file](https://res.cloudinary.com/total-typescript/image/upload/v1783947825/ai-hero-images/qgmdzjbancwqaoragjph.png)

## Seeing Your First Model Provider Request

Say hello to the agent. It responds with something like "hello, what would you like to work on today?"

Now refresh the logs directory. A new file has appeared tracking the request made to `v1/messages` on the Anthropic API.

![Request logs showing model provider request with XML tags and metadata](https://res.cloudinary.com/total-typescript/image/upload/v1783947828/ai-hero-images/f0xhekvfvrpabxjhizvn.png)

## Inside the Request

This file contains everything sent to and received from the model. There are different XML tags showing what was in the request.

At the top, you'll see meta information and headers. Further down around line 50, you'll see the [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt) with all the text sent to the agent.

Scroll down to find where you said hello. Then find the agent's response. At the very bottom, you'll see:

```txt
Hello, what would you like to work on today?
```

This entire huge request and the tiny response you got back - this is a [**model provider request**](https://www.aihero.dev/ai-coding-dictionary/model-provider-request).

| Concept                | Meaning                                                    |
| ---------------------- | ---------------------------------------------------------- |
| Model Provider Request | One request sent to the model, plus one response back      |
| [Model Provider](https://www.aihero.dev/ai-coding-dictionary/model-provider)         | The service handling the request (Anthropic, Ollama, etc.) |

## Following the Conversation

Go back to the agent and ask a follow-up:

```
tell me my hair looks nice
```

The agent responds with something like "your hair looks nice," and another model provider request is created in the logs.

### Multiple Hidden Requests

Refresh the logs directory. You'll notice there are actually multiple new requests, not just one. The agent doesn't just respond to your message - it's doing other work behind the scenes.

To figure out which request is which, click on one and scroll to the bottom. You'll see a title describing what that request was for, like "compliment request about hair."

![Request logs showing multiple requests with descriptive titles](https://res.cloudinary.com/total-typescript/image/upload/v1783947829/ai-hero-images/f1g0knzkhogbfkyec5z5.png)

### Suggestion Requests

Other requests might have titles like "now let's get to work on proxy.ts." These are running in `SuggestionMode` - they generate what you might naturally type next into the agent.

![Request log showing SuggestionMode generating next prompt suggestions](https://res.cloudinary.com/total-typescript/image/upload/v1783947830/ai-hero-images/qmmjsbz1bzhwojn19xls.png)

Every time you see something that looks AI-generated in the interface, that's the result of a model provider request. Even the suggestions are coming from the model.

## The Full Conversation History

As you look through the logs, you'll notice something important: every time you send a request to the agent, your entire conversation history is passed along with it.

The request includes:

- Your previous messages
- The agent's previous responses
- All [context](https://www.aihero.dev/ai-coding-dictionary/context) accumulated so far

This file gets longer and longer as your conversation grows.

## Triggering Tool Use

Now ask the agent to do something more complex:

```
I would like you to write a file containing a list of compliments to me in a markdown file in the repository root.
```

Check the logs - there are now several requests. The first one is properly dated to when you sent your message.

Inside, find where you sent your request. The agent processes it and then something different happens. Instead of just responding with text, you see a tool use section.

![Request log showing JSON tool use with file path and content parameters](https://res.cloudinary.com/total-typescript/image/upload/v1783947831/ai-hero-images/yki1pp9tz2zck5qzztvh.png)

Rather than plain text, the model is passing a `file_path` and `content`.

## What Is a Tool?

A [**tool**](https://www.aihero.dev/ai-coding-dictionary/tool) is something the harness provides to the model to let it interact with the [environment](https://www.aihero.dev/ai-coding-dictionary/environment). In this case, there's a `write` tool that takes:

- A `file_path` parameter
- A `content` parameter

![Request log showing write tool definition with JSON schema](https://res.cloudinary.com/total-typescript/image/upload/v1783947832/ai-hero-images/vslqcuzrx9fva1ifmeff.png)

Looking further back in the request, you'll see where the tool was defined. It passes JSON schema telling the model how to call it.

## The Tool Call Response

In this single model provider request, the harness sent:

1. Instructions on how to call a tool
2. Your request to write a file

The model responded: "OK, let's use this tool."

That tool use part is then interpreted and executed by the harness.

![Request log showing tool result indicating file created successfully](https://res.cloudinary.com/total-typescript/image/upload/v1783947833/ai-hero-images/m1gpmctcb3kgyjds8kbx.png)

Looking at the next request, you'll see a [tool result](https://www.aihero.dev/ai-coding-dictionary/tool-result) message. The harness then sends this result back to the model in another request, and receives a new response:

```
Done, I created compliments.md in the repo root.
```

## Defining a Turn

This entire flow is called a **turn**.

Both of these model provider requests were sent in a single turn:

1. First request: You sent a message and received instructions to call a tool
2. Second request: You sent the tool result and received a message back

![Diagram or view showing a complete turn with multiple model provider requests](https://res.cloudinary.com/total-typescript/image/upload/v1783947902/ai-hero-images/roquqmwc6036brvvbnlo.png)

A single turn can last hours and contain hundreds of model provider requests.

| Element                | Definition                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Model Provider Request | One round trip to the model (request + response)                                           |
| [Tool Call](https://www.aihero.dev/ai-coding-dictionary/tool-call)              | The model's instruction to use a tool (not the execution)                                  |
| Tool Result            | The output of executing that tool                                                          |
| Turn                   | The entire cycle from user message to agent response, including all tool calls and results |

This is the engine that powers everything.

## Next Steps

Continue your conversation with your agent and watch the requests build up in the logs. Play around and see what you can find. The language of model provider requests, turns, tool calls, and tool results should now make sense for understanding how agents work.


<Quiz>
  <QuizQuestion data={{
    id: "turn-versus-model-provider-request",
    question: "You ask the agent to write a file. It calls the write tool, gets the result back, and tells you it is done. How does that flow break down?",
    type: "multiple-choice",
    choices: [
      { answer: "one-turn", label: "Two model provider requests inside a single turn" },
      { answer: "two-turns", label: "Two turns, one for each model provider request" },
      { answer: "one-each", label: "One model provider request, making up one turn" }
    ],
    correct: "one-turn",
    answer: "A model provider request is one round trip: request out, response back. Writing the file took two of them - one where the model asked for the tool, one carrying the tool result. A turn is the whole cycle from your message to the agent's answer, so both requests sit inside one turn. A turn can last hours and hold hundreds of requests, so counting turns per request gets it backwards."
  }} />
  <QuizQuestion data={{
    id: "tool-call-executed-by-harness",
    question: "The model's response contains a tool use block with a file_path and content. Who actually writes that file to disk?",
    type: "multiple-choice",
    choices: [
      { answer: "harness", label: "The harness interprets the tool use and runs it" },
      { answer: "model", label: "The model writes the file as part of its response" },
      { answer: "provider", label: "The model provider runs the tool on its own servers" }
    ],
    correct: "harness",
    answer: "A tool call is the model's instruction to use a tool, not the execution of it. The model only produces text, so it cannot touch the file system, and the model provider is just the service handling the request. The harness is the part running locally with access to the environment, so it executes the tool and sends the result back in the next request."
  }} />
  <QuizQuestion data={{
    id: "full-history-resent-each-request",
    question: "What does the harness send to the model on each new model provider request in a conversation?",
    type: "multiple-choice",
    choices: [
      { answer: "everything", label: "The entire conversation history so far, every time" },
      { answer: "newest", label: "Only your newest message, since the model recalls the rest" },
      { answer: "summary", label: "A short summary of everything said earlier in the session" }
    ],
    correct: "everything",
    answer: "The logs show the same file getting longer and longer: your previous messages, the agent's previous responses, and all the context accumulated so far go out with every request. Sending only the newest message would assume the model remembers, which it does not. And nothing in the request is summarised - the history is passed along in full."
  }} />
</Quiz>
