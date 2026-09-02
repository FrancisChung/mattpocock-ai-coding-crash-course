# Your Starting Context

You may have noticed during the concept section, and even if you worked through the code, that I have a strong paranoia about what is in my [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) at all times.

When you build AI-powered apps, you need to be really careful about every [token](https://www.aihero.dev/ai-coding-dictionary/token) you put in your context window to make sure the app runs efficiently and passes your evaluations. I inherited that context paranoia, and I take that into agent coding.

Now that the real work of the course is about to begin, I want to make sure we're all starting on a solid foundation. We can't include any bloat in our [harness](https://www.aihero.dev/ai-coding-dictionary/harness) before we even kick off.

If we've got tokens that aren't supposed to be there in the context window, we are not going to have fun when we're using these coding [agents](https://www.aihero.dev/ai-coding-dictionary/agent), and you're not going to get the results you expect.

This demo uses Claude Code, but you can walk through this with any agent - you might just need to pass it the instructions below and achieve the same goals.

## Resetting Your Config

The first step is to open your `.claude` directory in VS Code.

Then you're going to do two important things:

1. Go to your `settings.json` file and rename it as `settings-backup.json` - this is a backup of your settings before you start the course.
2. Rename your `skills` directory to `skills-backup` as well.

Everything that we've got inside your skills and inside your settings is now reset to defaults.

![VS Code showing the .claude directory with settings.json and skills folder ready to be renamed](https://res.cloudinary.com/total-typescript/image/upload/v1784723060/ai-hero-images/j1hg6oyxus3skzkvxmzk.png)

Go back to your AI Coding Crash Course repository and run your agent of choice. Next, run the `/context` command to visualize the current [context](https://www.aihero.dev/ai-coding-dictionary/context).

## What's In Your Baseline

```
/context
```

This shows you everything currently sitting in the context window - before you've sent any real messages.

Here's what a fresh [session](https://www.aihero.dev/ai-coding-dictionary/session) looks like with the default configuration:

| Category                | Tokens   |
| ----------------------- | -------- |
| [System prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt)           | 3k       |
| System tools            | 17.9k    |
| MCP tools (deferred)    | 24.5k    |
| System tools (deferred) | 16.9k    |
| Skills                  | 2k       |
| Messages                | 8        |
| **Total**               | **~23k** |

That's around 23,000 tokens - before you've really sent any messages. The only tokens you used are the eight tokens it took to type `/context`.

![Terminal output showing /context command results with 22.9k tokens used by default configuration](https://res.cloudinary.com/total-typescript/image/upload/v1784723061/ai-hero-images/w8tyk1g4orgsd1ihe99n.png)

As you can see, there are plenty of built-in [skills](https://www.aihero.dev/ai-coding-dictionary/skill) here and built-in project stuff, which is expected. You also have a ton of [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) tools, which are loaded in from claude.ai - things like Figma, Gmail, Google Calendar, Google Drive, Slack, Todoist, and Zapier.

All of this adds up to around 23k tokens, even before you've really started working.

Your mileage may vary. Your agent harness might send fewer tokens than this by default, or you might notice that your config actually has tons of stuff you didn't even know was in there.

## See The Difference

Now, just for fun, let me go back into my `.claude` folder and re-enable my `settings.json` and my `skills` directory.

I'll restart the agent and rerun `/context` to show you the difference.

```
/context
```

Now we're only at **6.6k tokens** - we've managed to remove 16k tokens just through our settings.

| Category                | Tokens    |
| ----------------------- | --------- |
| System prompt           | 2k        |
| System tools            | 3.5k      |
| MCP tools (deferred)    | 192       |
| System tools (deferred) | 9.2k      |
| Skills                  | 1.1k      |
| Messages                | 8         |
| **Total**               | **~6.6k** |

![Terminal output showing /context command results with 6.6k tokens after custom configuration restored](https://res.cloudinary.com/total-typescript/image/upload/v1784723062/ai-hero-images/gbqbttndqy0yujnilzm6.png)

This is a crucial difference because it means you've got a whole lot more to work with inside the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) - the part of your context where the agent actually thinks and reasons. It just means you're feeling more efficient every single time you interact with the agent.

## Why We're Doing This

A little note: we're not doing this in order to min-max token spend. We're not necessarily doing this to minimize cost. We are maximizing quality.

We're trying to extend the space inside our smart zone - the part of the context window where the agent actually thinks through your problem. The more space you have there, the better the reasoning.

You'll probably be shocked by what you find in your own configuration, especially if you've never looked there before.

## Understanding Your Context

I want to give you the skills so that you can:

- Look at your own context window usage and see what's there
- Look at other people's configs and identify what really shouldn't be there

Hopefully you can inherit a little bit of my context paranoia - and with that, you'll get higher quality outputs.

## Your Next Steps

If you're following along exactly, make sure you:

1. Rename `settings.json` to `settings-backup.json`
2. Rename the `skills` directory to `skills-backup`

We will not be using your default config for this course.

If you have anything else inside your context window that you just can't seem to get rid of, message in the [Discord](https://aihero.dev/discord) and we'll see if we can update these instructions for your specific case.

---

Nice work - I'll see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "stripped-config-buys-smart-zone",
    question: "You strip the MCP servers and extra skills out of your agent config, taking a fresh session from 23k tokens down to 6.6k. What is the main thing you gain?",
    type: "multiple-choice",
    choices: [
      { answer: "smart-zone", label: "More room in the smart zone, where the agent reasons" },
      { answer: "cheaper", label: "A cheaper session, because fewer tokens get billed" },
      { answer: "faster", label: "A faster startup, because less config has to load" },
      { answer: "bigger-window", label: "A larger context window limit for this session" }
    ],
    correct: "smart-zone",
    answer: "The aim is quality, not spend. Cost does drop a little, but that is a side effect rather than the reason. Startup speed is not what the trimming buys, and the size of the window itself does not move - trimming only changes how much of it is free for the agent to think in."
  }} />
  <QuizQuestion data={{
    id: "inspect-baseline-before-prompting",
    question: "You want to see what is already sitting in your context window before you type a single real prompt. Which command do you run?",
    type: "multiple-choice",
    choices: [
      { answer: "context", label: "/context" },
      { answer: "config", label: "/config" },
      { answer: "compact", label: "/compact" },
      { answer: "clear", label: "/clear" }
    ],
    correct: "context",
    answer: "/context prints the breakdown - system prompt, tools, MCP tools, skills, messages - so you can see the baseline. /config opens settings rather than reporting usage, /compact squeezes a session that already holds work, and /clear empties a session without ever telling you what was in it."
  }} />
</Quiz>

