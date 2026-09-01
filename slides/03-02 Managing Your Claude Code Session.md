# Managing Your Claude Code Session

Make sure you have Claude Code set up and ready to go. If you haven't completed this yet, head back to the Before We Start section and work through the setup steps to get it installed on your system.

For this entire course, we're going to be running Claude from inside VS Code. We'll talk about the relationship between Claude and VS Code itself, but for now it's perfectly fine to run it in the integrated terminal.

## Opening Claude Code And The Input Box

Kick off by simply running Claude in your terminal and bump the zoom level up a little bit for clarity.

![VS Code with Claude Code launched in the integrated terminal showing the chat interface](https://res.cloudinary.com/total-typescript/image/upload/v1784208739/ai-hero-images/drhuy9ftsr8f4rihhfq2.png)

What you'll see is a UI with an enormous text box at the bottom. This is where you'll type all your prompts.

## Your First Message

Let's start simple. You can say anything to Claude, just like any chat app you've used.

```
hello, how are you?
```

The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) will process your message and respond naturally. This familiar chat-like interface makes it easy to get started.

![Claude Code responding to a greeting with friendly acknowledgment](https://res.cloudinary.com/total-typescript/image/upload/v1784208740/ai-hero-images/ysojubklhfwvfe2xc6al.png)

## Terminal Setup And Multi-Line Input

Before we go further, there's one important command to run: `/terminal-setup`.

```
/terminal-setup
```

Type the forward slash, then find `terminal setup` from the autocomplete. The command should turn a nice shade of lilac once you've found the right one.

![The /terminal-setup command highlighted in lilac in the autocomplete menu](https://res.cloudinary.com/total-typescript/image/upload/v1784208741/ai-hero-images/ymjoq8uviweja7xyry0v.png)

Press Enter to run it.

This command sets up key bindings for you, specifically for Shift+Enter. Depending on your operating system, you may need to run this manually (like on Windows Subsystem Linux), but most users can just run it and be good to go.

Without this setup, you might experience strange key binding issues. Once installed, Shift+Enter lets you add new lines in your prompt:

```
hello,
and then press Shift+Enter here
you can write multi-line prompts
```

This is essential for writing more complex instructions to the agent.

![Multi-line prompt in Claude Code using Shift+Enter](https://res.cloudinary.com/total-typescript/image/upload/v1784208742/ai-hero-images/vj1dvha8bwggkpdnutp7.png)

## Checking Your Usage

To see how much of your plan's allowance you have left, run the `/usage` command:

```
/usage
```

![Usage display showing context window limits and current session tokens](https://res.cloudinary.com/total-typescript/image/upload/v1784208743/ai-hero-images/k998yoxtgqpoyn75cgvw.png)

This shows you:

- How much usage you have left in your current [session](https://www.aihero.dev/ai-coding-dictionary/session)
- Your weekly limit
- Your current usage against that limit

The specific numbers and labels may look different depending on your plan, and they may change between agent versions. But this is how you check your remaining allowance at any time.

Once you reach the end of your usage window, you won't be able to continue using the agent until your limit resets.

Press Escape to exit the usage view and return to your chat.

## Visualizing Your Context Window

Run the `/context` command to see what's currently in your [context window](https://www.aihero.dev/ai-coding-dictionary/context-window):

```
/context
```

![Context visualization showing token breakdown across system prompt, skills, and messages](https://res.cloudinary.com/total-typescript/image/upload/v1784208745/ai-hero-images/mrlhyo3koxhmbck4xkci.png)

This display is really useful when you need to debug your setup. You can see:

- **[System prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt) tokens**: Instructions given to the agent
- **Skills tokens**: Custom [skills](https://www.aihero.dev/ai-coding-dictionary/skill) you've added
- **Message tokens**: Conversation history
- **Context window size**: The total [token](https://www.aihero.dev/ai-coding-dictionary/token) capacity (for example, Claude 3.5 Opus has 1 million tokens)

Understanding what fills your context window is key to using agents efficiently. We'll dive deeper into [context](https://www.aihero.dev/ai-coding-dictionary/context) management throughout this course.

## Clearing The Context

To reset your context window and start fresh, run `/clear`:

```
/clear
```

![Context window after clearing, showing drastically reduced token count](https://res.cloudinary.com/total-typescript/image/upload/v1784208746/ai-hero-images/jauv0f4iwtyrl6irkv0l.png)

This removes all messages from your current conversation, giving you a blank slate. You can verify it worked by running `/context` again.

Compare the token counts before and after:

| State                     | Approximate Tokens |
| ------------------------- | ------------------ |
| With conversation history | ~9,000             |
| After `/clear`            | ~6,600             |

This demonstrates that [models](https://www.aihero.dev/ai-coding-dictionary/model) are [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless). Once you [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the context, the agent has no knowledge of your previous conversation.

Alternatively, you can press Ctrl+C twice to exit and open a brand-new session. This also gives you a clean context window with no memory of the previous conversation.

## Interrupting The Agent

Sometimes you'll need to stop the agent mid-run. Press Escape to interrupt:

```
explore the code base
```

If the agent starts working and you decide you want it to stop, just press Escape. The agent will cancel everything it was doing.

![Claude Code showing an 'interrupted' message after pressing Escape](https://res.cloudinary.com/total-typescript/image/upload/v1784208821/ai-hero-images/ogumpia6yrtxyomq0env.png)

After interrupting, the context window shows an `interrupted` message asking what Claude should do instead. You can then redirect it or ask it to continue.

You might accidentally trigger this by pressing Escape at the wrong moment. If that happens, just type:

```
carry on
```

And the agent will resume where it left off.

## Summary

You've now learned the essential commands for working with Claude Code:

- **Open and chat**: Launch the agent in your terminal and type messages like any chat app
- **Multi-line input**: Use Shift+Enter to write complex, multi-line prompts
- **Check limits**: Run `/usage` to see your remaining allowance
- **Inspect context**: Run `/context` to visualize what's filling your context window
- **Reset**: Run `/clear` to start with a fresh context
- **Interrupt**: Press Escape to stop the agent mid-run, then redirect it

You're ready to start working with the agent. Nice work, and I'll see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "clear-resets-to-a-stateless-start",
    question: "You have finished one task and want to start something unrelated in the same terminal, with none of the earlier conversation influencing the agent. What do you do?",
    type: "multiple-choice",
    choices: [
      { answer: "clear", label: "Run /clear to empty the conversation history" },
      { answer: "context", label: "Run /context to inspect the token breakdown" },
      { answer: "tell", label: "Ask the agent to ignore the earlier messages" },
      { answer: "escape", label: "Press Escape to interrupt the current run" }
    ],
    correct: "clear",
    answer: "/clear removes all the messages, and because the model is stateless it then has no knowledge of what came before. /context only shows you what is filling the window; it removes nothing. Asking the agent to ignore the earlier messages leaves those messages in the window, which /context would still count. Escape stops a run that is in progress and leaves the conversation intact."
  }} />
  <QuizQuestion data={{
    id: "escape-interrupts-a-running-agent",
    question: "The agent is midway through a job and is clearly heading in the wrong direction. What is the cheapest way to stop it and put it back on track?",
    type: "multiple-choice",
    choices: [
      { answer: "escape", label: "Press Escape to stop it, then redirect it" },
      { answer: "clear", label: "Run /clear and set the whole task up again" },
      { answer: "quit", label: "Press Ctrl+C twice to open a fresh session" },
      { answer: "wait", label: "Wait for it to finish, then correct it" }
    ],
    correct: "escape",
    answer: "Escape cancels everything the agent was doing and leaves an interrupted marker asking what it should do instead, so you keep the conversation and simply redirect. /clear throws away every message, and Ctrl+C twice opens a session with no memory of the work at all, so both make you re-explain the task. Waiting lets it finish work you already know is wrong."
  }} />
  <QuizQuestion data={{
    id: "context-command-versus-usage-command",
    question: "You want to see the token breakdown of what is loaded right now: system prompt, skills and conversation history. Which command shows it?",
    type: "multiple-choice",
    choices: [
      { answer: "context", label: "/context" },
      { answer: "usage", label: "/usage" },
      { answer: "clear", label: "/clear" },
      { answer: "setup", label: "/terminal-setup" }
    ],
    correct: "context",
    answer: "/context visualises what is filling the window and the total token capacity. /usage answers a different question: how much of your plan's allowance is left in this session and this week. /clear empties the conversation rather than showing it. /terminal-setup only installs the key bindings, such as Shift+Enter for a new line."
  }} />
</Quiz>
