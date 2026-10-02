# Installing Claude Code

The project is set up and the terminal is ready. The only thing missing is the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) itself.

This lesson uses [Claude Code](https://code.claude.com/docs/en/setup) as the agent. If you're using a different coding agent, install it from its own docs and log in!

## Steps To Complete

### Install Claude Code

- [ ] Open a new terminal in VS Code inside your project folder

- [ ] Navigate to the [Claude Code setup page](https://code.claude.com/docs/en/setup) and copy the install command for your platform:

| Platform | Command |
|---|---|
| Linux / WSL / macOS | `npm install -g @anthropic-ai/claude-code` |
| Windows PowerShell | (see setup page) |
| Windows CMD | (see setup page) |

- [ ] Paste and run the command in your terminal

### Log In

- [ ] Launch Claude Code from inside your project folder:

```txt
claude
```

- [ ] When prompted **do you trust this workspace?**, answer **Yes**

![Claude Code terminal prompt asking 'Do you trust this workspace?' with Yes option](https://res.cloudinary.com/total-typescript/image/upload/v1786013117/ai-hero-images/otjxjac38kmztnqyoepq.png)

- [ ] When prompted to log in:
    - Choose the **subscription** option
    - Let it open your browser
    - Authorise there
    - Come back to the terminal

### Set Your Model and Effort

- [ ] Run `/model` to open the [model](https://www.aihero.dev/ai-coding-dictionary/model) picker:

```txt
/model
```

![Claude Code model picker showing available models with default selected](https://res.cloudinary.com/total-typescript/image/upload/v1786013118/ai-hero-images/k2srsc4npvpwdbb9gjxy.png)

- [ ] Select the **default** for your subscription tier (e.g. Opus 5 with a 1 million token [context window](https://www.aihero.dev/ai-coding-dictionary/context-window))

- [ ] Set the [effort](https://www.aihero.dev/ai-coding-dictionary/effort) level to **medium** using the left and right arrow keys - it defaults to `xhigh`, so make sure to dial it down

The course was recorded on Opus 5 at medium effort. Higher effort burns through [tokens](https://www.aihero.dev/ai-coding-dictionary/token) faster and runs slower - on the work in this course it doesn't buy a better answer.

### Verify Everything Works

- [ ] Send a quick sanity check message:

```txt
hello
```

You should get a `hello` back. Once you see that, you're done with the setup.

![Claude Code terminal showing hello message sent and hello response received](https://res.cloudinary.com/total-typescript/image/upload/v1786013119/ai-hero-images/vv1iissmsn8e8kwasgvg.png)
