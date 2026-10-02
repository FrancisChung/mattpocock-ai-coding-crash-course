# Codebase Exploration

Every time an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) starts a fresh [session](https://www.aihero.dev/ai-coding-dictionary/session) with your codebase, it has to explore to find the information it needs. [Statelessness](https://www.aihero.dev/ai-coding-dictionary/stateless) is the hardest constraint to work around - the agent remembers nothing from previous sessions.

The quality of the agent's exploration directly determines the quality of what happens next. If it fails to find the information it needs, it probably won't do what you want.

So exploration matters. A lot. And making your codebase easy to explore is one of the most important things you can do.

## What The Agent Already Knows

When you start a session, the agent gets some [environment](https://www.aihero.dev/ai-coding-dictionary/environment) information automatically. Let's look at what that includes:

- Platform (Linux, macOS, Windows)
- Working directory (so it can guess something from the repo name)
- Git repository status (branch, main branch, git user, recent commits)
- Shell type (bash, zsh, etc)
- Your assistant's [knowledge cutoff](https://www.aihero.dev/ai-coding-dictionary/knowledge-cutoff) date

That's actually quite helpful. But there's a critical gap.

## What The Agent Doesn't Know

The agent gets **no [filesystem](https://www.aihero.dev/ai-coding-dictionary/filesystem) information at all**. It doesn't have an `ls` of the current directory. It doesn't have a file tree. It has zero knowledge of what files actually exist in the directory.

So all the agent knows is:

- The directory name
- The vague environment it's operating in
- Some recent commit names
- Nothing about the actual filesystem

This is exactly where you are right now as someone learning this repo. You probably don't know much about the app we're building yet. You're in a similar place to your agent.

## Steps To Complete

- [ ] Open a terminal and run the request-logger proxy

```bash
npm run request-logger
```

It asks which coding agent you use, then listens on `http://localhost:8787` and prints the exact command to start that agent through it.

- [ ] Open a second terminal, then copy and paste the printed command to start an agent session through the proxy

- [ ] Ask the agent about the project's tech stack and purpose

```
Tell me what the tech stack of this project is and what its intended purpose is.
```

Watch what happens as the agent explores:

- Does it spawn [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent) to help with the exploration?
- Does it try to read through all the files itself?
- How does it navigate the codebase?
- Does it explore the filesystem? Read files? Make good guesses?

- [ ] Ask follow-up questions to get more detail

Ask the agent to tell you more about:

- The main purpose of each folder
- What the core business logic does
- What technologies are being used and why

Keep asking questions until you have a really detailed understanding of the codebase.

- [ ] (Optional) Check the request logs

Open `request-logger/logs/` and look at the most recent `.md` file. Jump to the `# Environment` section to see exactly what was passed to the agent. Notice what's included and what's missing.

