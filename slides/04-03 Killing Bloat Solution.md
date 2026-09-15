# Killing Bloat Solution

The first step is to create a `settings.json` file inside your `~/.claude` directory and initialize it with an empty object.

The instructions demonstrated here are agent-specific, but if you look at the written lesson below, you'll see [harness](https://www.aihero.dev/ai-coding-dictionary/harness) instructions for removing bloat there too if needed.

## The workflow

Every time you make a change to `settings.json`, the process is the same:

1. Edit `~/.claude/settings.json`
2. Quit your [agent](https://www.aihero.dev/ai-coding-dictionary/agent)
3. Relaunch it
4. Send a `Hello!` message
5. Run the `/context` command
6. Check the logs to see what's changed

To give us a baseline marker, let's run `/context` on a fresh start. We're starting at **68.3k [tokens](https://www.aihero.dev/ai-coding-dictionary/token)**. That's really quite a lot.

## Disable MCP connectors

The first thing to address is the [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) (Model Context Protocol) stuff. There's a bunch of Claude AI connectors that automatically enable if you're using Claude.ai.

Inside `~/.claude/settings.json`, you can disable all of them in one go:

```json
{
  "disableClaudeAiConnectors": true
}
```

After restarting and running `/context`, we've already dropped down to **47k tokens**. That's 21k tokens saved with a single setting.

## Disable workflows

Next, you'll notice there's a ton of configuration related to dynamic workflows. These orchestrate multiple [sub-agents](https://www.aihero.dev/ai-coding-dictionary/subagent) deterministically.

If you won't be using workflows, disable them:

```json
{
  "disableClaudeAiConnectors": true,
  "disableWorkflows": true
}
```

Now we're down to **39k tokens**.

## Disable bundled skills

The bundled [skills](https://www.aihero.dev/ai-coding-dictionary/skill) include deep research, data visualization, artifact design, config updates, and keybindings help. If you're not using any of them, disable them all:

```json
{
  "disableClaudeAiConnectors": true,
  "disableWorkflows": true,
  "disableBundledSkills": true
}
```

This takes us down to **37.1k tokens** — and kills skills usage completely.

## Disable artifacts

There's a relatively new feature called Artifacts that you might not use at all. Turning this off is straightforward:

```json
{
  "disableClaudeAiConnectors": true,
  "disableWorkflows": true,
  "disableBundledSkills": true,
  "disableArtifact": true
}
```

That's another 4k tokens gone, bringing us to **33.1k tokens**.

## Control tool access with permissions

Now for the big one: looking at the [tool](https://www.aihero.dev/ai-coding-dictionary/tool) definitions themselves.

**Here's the key principle: if you deny your agent access to a tool via `permissions.deny`, its definition is removed from the [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt) entirely.** This isn't just a runtime block — it's a [context](https://www.aihero.dev/ai-coding-dictionary/context) saving on every single request.

Let's look at which tools you actually need:

| Tool                                   | Ask yourself...                                                                 | Action                        |
| -------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------- |
| `NotebookEdit`                         | Do you need to replace, insert or delete cells in a Jupyter notebook?           | Probably not. Deny it.        |
| `DesignSync`                           | Do you need to design, sync, read, and update Claude.ai design-system projects? | No. Deny it.                  |
| `CronCreate`, `CronDelete`, `CronList` | Do you need to create and manage cron jobs?                                     | Probably not. Deny all three. |
| `EnterPlanMode`, `ExitPlanMode`        | Do you need the agent to enter and exit [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode)?                              | No. Deny both.                |
| `PushNotification`, `RemoteTrigger`    | Do you need push notifications or remote triggers?                              | No. Deny both.                |
| `ReportFindings`                       | Do you need the agent to report findings?                                       | No. Deny it.                  |
| `ScheduleWakeup`                       | Do you need wake-up scheduling?                                                 | No. Deny it.                  |

Add these to your settings:

```json
{
  "permissions": {
    "deny": [
      "NotebookEdit",
      "DesignSync",
      "CronCreate",
      "CronDelete",
      "CronList",
      "EnterPlanMode",
      "ExitPlanMode",
      "PushNotification",
      "RemoteTrigger",
      "ReportFindings",
      "ScheduleWakeup"
    ]
  },
  "disableClaudeAiConnectors": true,
  "disableWorkflows": true,
  "disableBundledSkills": true,
  "disableArtifact": true
}
```

This takes us down to around **21.6k tokens**.

## One more tool to consider

There's one more tool worth disabling: `AskUserQuestion`. It's a very long tool definition (~130 lines), and some people love the UI while others find it intrusive.

```json
{
  "permissions": {
    "deny": [
      "NotebookEdit",
      "DesignSync",
      "CronCreate",
      "CronDelete",
      "CronList",
      "EnterPlanMode",
      "ExitPlanMode",
      "PushNotification",
      "RemoteTrigger",
      "ReportFindings",
      "ScheduleWakeup",
      "AskUserQuestion"
    ]
  },
  "disableClaudeAiConnectors": true,
  "disableWorkflows": true,
  "disableBundledSkills": true,
  "disableArtifact": true
}
```

Removing it takes us down to **under 20k tokens** — around 19.9k. That's a good stopping point.

## The attitude matters more than the specifics

This demonstration is agent-specific, but the attitude is what matters.

You have to be aware of all the tokens you're sending in your system prompt. You don't need to read every single one, but you need to notice if something's there that shouldn't be — because it affects every subsequent request.

Performing this kind of hygiene on your own tools and setup is really important. Notice that everything we removed here was stuff you weren't going to use anyway. It absolutely shouldn't be in there, influencing behavior and eating up precious tokens.

## Your turn

Go and look at your own harness. See what you can remove from the system prompt while still retaining good behavior. Find your own harness-specific optimizations, and when you do, share them in the [Discord](https://aihero.dev/discord).

Now you have a good base to start working from. Let's get building.
