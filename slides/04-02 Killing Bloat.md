# Killing Bloat

# Killing Bloat: Understanding Your Agent's Payload

Every request you send to your [agent](https://www.aihero.dev/ai-coding-dictionary/agent) carries an invisible payload. Your [tool](https://www.aihero.dev/ai-coding-dictionary/tool) schemas, [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt), [skills](https://www.aihero.dev/ai-coding-dictionary/skill) catalogue, and feature instructions all ship together — and you're billed for every [token](https://www.aihero.dev/ai-coding-dictionary/token), every [turn](https://www.aihero.dev/ai-coding-dictionary/turn).

Before you type a single word, you're already paying a hefty bill.

The problem is visibility. The `/context` command breaks your window into categories, but it lumps all your tools together into one number. You can see the total, but not which single tool is eating the most tokens. To cut precisely, you need to see the actual payload.

## Set Up The Request Logger

Your goal is to examine what actually gets sent on each request to your agent provider, then identify and cut the biggest offenders.

- [ ] Start the request logger

Run the request logger in one terminal:

```bash
npm run request-logger
```

It asks which coding agent you use, and which model provider if your agent can use more than one. It can remember your answer, so it only has to ask once. It then prints the exact command for your agent, under the line "Run your agent in another terminal with:".


- [ ] Point your agent at the logger

Copy and paste that command into a new terminal and run it. It is built for the agent you picked, so there is nothing to adjust. If your agent also needs a config file, the logger prints that above the command.


- [ ] Clear old logs

Delete all files inside `request-logger/logs/` so you start fresh.


- [ ] Send a test message

In your agent, send a simple message:

```
Hello!
```

Wait for the reply. Then check `request-logger/logs/` — you should now have a new log file (a `.md` render, plus `.request.txt` and `.response.txt` files).

![VS Code showing the request-logger/logs/ directory with the new log files](https://res.cloudinary.com/total-typescript/image/upload/v1784723322/ai-hero-images/yho1agxpyd4l4gqmyhg4.png)

## Examine The Payload Structure

Now open the log file and explore what gets sent on every request.

- [ ] Search for and read the system prompt

Search for `<system-prompt>` inside the log file. Spend time understanding what's there.

Pay special attention to:
- The **[Environment](https://www.aihero.dev/ai-coding-dictionary/environment)** section — this tells the agent about your OS, shell, and working directory
- The **Context management** section — how the agent handles long conversations
- Any recent git commits (if you're using an agent like Claude Code)


- [ ] Review all available tools

Find the `<tools>` section. Every tool available to your agent has its own definition here.

As you scroll through, notice:
- How many tools are listed (you'll likely see 70+ definitions)
- Which tools you've actually heard of (Artifact, Bash, etc.)
- Which tools are completely unknown to you — read their descriptions. Some will be obscure: `CronCreate`, `DesignSync`, `EnterPlanMode`, `Workflow`
- How large some of these definitions are — there's a lot of redundant text explaining commit message formats, PR templates, and feature flags


- [ ] Look for MCP tools

Search for `mcp__` in the file. These are [Model Context Protocol](https://www.aihero.dev/ai-coding-dictionary/mcp) tools attached via integrations.

You'll see tools like:
- `mcp__claude_ai_Figma__authenticate`
- `mcp__claude_ai_Gmail__create_draft`
- `mcp__claude_ai_Slack__authenticate`
- `mcp__claude_ai_Google_Drive__search_files`

Count how many of these are present. These tools ship on every request, whether you need them or not.


- [ ] Check the skills list

Search for "following skills are available" to find the skills catalogue. You'll see a list of 15-20+ skills, each with a description.

Notice which ones are project-specific versus built into your agent by default.

## Understand The Cost

- [ ] Run `/context` in your agent

Check how many tokens your system is using across different categories (system prompt, tools, skills, messages).

The request logger's full markdown render of a single "Hello!" message is typically 4,000+ lines and 150-200 KB. That entire payload is sent and billed on every turn.

Now you understand the invisible cost of every request. The solution video will show you how to cut it down.

If the request logger isn't working with your agent of choice, reach out in the [AI Hero Discord](https://aihero.dev/discord) — we can help you set it up for your specific agent.
