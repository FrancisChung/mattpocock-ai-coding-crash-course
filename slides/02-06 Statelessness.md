# Statelessness

A [session](https://www.aihero.dev/ai-coding-dictionary/session) is composed of multiple [turns](https://www.aihero.dev/ai-coding-dictionary/turn), each of which contains [model provider requests](https://www.aihero.dev/ai-coding-dictionary/model-provider-request). This builds up a [context](https://www.aihero.dev/ai-coding-dictionary/context) over time. Every model provider request retains the state of the previous conversation in that session.

![Diagram showing session composed of turns with model provider requests](https://res.cloudinary.com/total-typescript/image/upload/v1783953638/ai-hero-images/qoygrg1ilnthckrxknoq.png)

But here's the critical part: all of that state lives in the [harness](https://www.aihero.dev/ai-coding-dictionary/harness), not in the [model](https://www.aihero.dev/ai-coding-dictionary/model) itself. The model is totally [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless).

![Diagram highlighting the harness containing session state while model remains stateless](https://res.cloudinary.com/total-typescript/image/upload/v1783953638/ai-hero-images/dmzffxmuvw5ukrn83bdq.png)

## The Harness vs The Model

| Concept     | Stateful? | Scope              | Responsibility                                       |
| ----------- | --------- | ------------------ | ---------------------------------------------------- |
| Model       | Stateless | N/A                | Processes a single request based on provided context |
| Harness     | Stateful  | Within one session | Remembers all messages and session history           |
| Environment | Stateful  | Indefinite         | Persists files, changes, and data on disk            |

The harness is responsible for remembering all of the session—remembering all of the messages so far. It communicates all of that in one big chunk to the model. Because the model doesn't remember anything, doesn't retain any state.

The harness carries information forward, but only through the duration of the session. It remembers everything that happened in that session throughout the different turns. But as soon as you [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) it, then it forgets everything again.

## Why This Matters

Many people see the statelessness of the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) as a bad thing. They want the agent to be [stateful](https://www.aihero.dev/ai-coding-dictionary/stateful), to remember things about them, to improve over time.

![Discussion of agent statelessness and desire for memory](https://res.cloudinary.com/total-typescript/image/upload/v1783953639/ai-hero-images/ujjryazw2kby70sywrt4.png)

This is why you see lots of people building [memory systems](https://www.aihero.dev/ai-coding-dictionary/memory-system). They're trying to bring state into a stateless system to get the agent to remember stuff over time.

## The Real Solution: Save to the Environment

The way to get the agent to have memory is to save things in the [environment](https://www.aihero.dev/ai-coding-dictionary/environment). The [file system](https://www.aihero.dev/ai-coding-dictionary/filesystem) and the environment that the agent is in is really important for retaining state.

If you save a file in the file system and then clear the session, that state is still going to be there. The file is still going to be saved.

Breaking this down:

- **Model**: Totally stateless
- **Harness**: Stateful within the same session only
- **Environment**: Always stateful

You can always save stuff in the environment. Then the harness and the model can work together to pull things out of the environment.

Memory systems are ways to augment the environment to help it remember more stuff. This lets the agent remember things across sessions. You'll sometimes see harnesses trying to retain a bit more state across sessions as well.

## Default to Statelessness

As [Mario Zechner](https://x.com/badlogicgames/status/2076638642529800396), creator of Pi, says:

> i get asked what memory system i use often. my answer has always been: my codebase is my memory system.

![Mario Zechner quote about codebase as memory system](https://res.cloudinary.com/total-typescript/image/upload/v1783953640/ai-hero-images/nxibfzl6ltuyuxfmqwig.png)

Just like Mario, the preference is to default to statelessness where possible and save the stuff that's important for memory inside the codebase.

The reason is pure simplicity. It's found to work better. By default:

- The model is totally stateless
- The harness is stateful within a session
- The environment is always stateful because you can save stuff in it

A lot of people want to bolt on a memory system onto the agent itself. But be suspicious about that. Just modifying the codebase tends to be enough.

<Quiz>
  <QuizQuestion data={{
                id: "statelessness-what-survives-a-clear",
  question: "You clear the session. Which part of the setup still holds what happened before?",
  type: "multiple-choice",
  choices: [
  { answer: "environment", label: "The environment: files on disk stay where they are" },
  { answer: "harness", label: "The harness: it remembers the messages you sent it" },
  { answer: "model", label: "The model: it retains what it learned about you" }
  ],
  correct: "environment",
  answer: "The environment is always stateful - save a file, clear the session, and the file is still there. The harness is stateful too, but only for the duration of one session: clear it and it forgets everything. The model is stateless full stop; it processes one request from the context it is given and retains nothing at all."
  }} />
  <QuizQuestion data={{
                id: "codebase-as-the-memory-system",
  question: "You want your agent to remember a decision after this session ends. What do you reach for first?",
  type: "multiple-choice",
  choices: [
  { answer: "codebase", label: "Write it into the codebase for the agent to read back" },
  { answer: "memorysystem", label: "Bolt a memory system onto the agent so it can store it" },
  { answer: "keepopen", label: "Keep the session open so the harness holds onto it" }
  ],
  correct: "codebase",
  answer: "The way to give a stateless system memory is to save things in the environment, and the codebase is the environment you already have - as Mario Zechner puts it, the codebase is the memory system. Bolting a memory system onto the agent is what lots of people do, but be suspicious of it: modifying the codebase tends to be enough, and it is simpler. Keeping the session open only postpones the problem, since the harness forgets the moment you clear it."
  }} />
</Quiz>
