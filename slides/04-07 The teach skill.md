# The /teach Skill

Starting a new job, joining a new project, or exploring unfamiliar code is a challenge everyone faces. You need to understand the architecture, the libraries, the patterns - but you don't know where to start.

That's where [agents](https://www.aihero.dev/ai-coding-dictionary/agent) shine. With the `/teach` [skill](https://www.aihero.dev/ai-coding-dictionary/skill), you can explore a codebase deeply and get a personalized explanation tailored to your experience level.

## Steps To Complete

### Set Up A Fresh Workspace

- [ ] Exit your current agent [session](https://www.aihero.dev/ai-coding-dictionary/session)

- [ ] Create a new directory next to the course repo

```bash
mkdir ../ai-coding-learning
```

- [ ] Open that directory in your code editor

### Install The /teach Skill

- [ ] Run the skills installer in your new directory

```bash
npx skills@latest add mattpocock/skills
```

An interactive menu will appear.

- [ ] Select only the `teach` skill using the spacebar, then press Return

- [ ] Choose to install for your agent (Claude Code, or whichever agent you're using)

- [ ] Install to the **current directory only**, not globally

- [ ] Select **symlink** as the installation method when prompted

- [ ] Confirm the installation when asked

You should now see a `.claude/skills/teach` folder in your file tree.

### Run The Exercise

- [ ] Clear your terminal

```bash
clear
```

- [ ] Start your agent

```bash
claude
```

- [ ] Run the `/teach` command with this structure:

```
/teach Teach me about this repo: ../ai-coding-crash-course I've done a little bit of vibe coding before. I know the basics of TypeScript. I've never worked in React before, and I'm not very clear about client and server, and certainly not about the database.
```

Replace the experience description with your own honest assessment of what you know and don't know.

The skill will analyze the repository and create a learning plan tailored to your level.

