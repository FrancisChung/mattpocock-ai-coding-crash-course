# Going Forwards and Backwards in Time

One really important thing that an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) allows you to do is go backwards and forwards in the conversation. This is essential when you're trying something out that you later want to revert.

## Reverting Changes

In a previous video, you made a change where you removed a dev script. Now you can simply say to the agent:

```
revert that, please
```

The agent will undo the change by rewriting and re-adding it back in. You accept this by pressing `Control S` to save the diff.

But there's a more powerful option available - rewind mode.

## Using Rewind Mode

Press `Escape` twice in quick succession to enter rewind mode. In this mode, you get to restore your code and conversation to any earlier point in the [session](https://www.aihero.dev/ai-coding-dictionary/session).

For instance, if you want to revert the command you just did, you can select the previous checkpoint. The one at the bottom is your current state, and the one above it is the point at which you said "revert that please".

Select it with `Enter`.

![Rewind mode interface showing checkpoint history](https://res.cloudinary.com/total-typescript/image/upload/v1784279343/ai-hero-images/crtl1jtitc1wxy7mxc0s.png)

## Choosing What to Restore

Now you have a few different options:

| Option | What It Does |
|--------|-------------|
| **Restore the code and the conversation** | Rewind your entire session to the point before this code edit was made |
| **Restore the conversation but keep the code** | Keep your current code state while reverting the conversation |
| **Restore the code but keep the conversation** | Keep your conversation history while reverting the code |

The option you'll use most often is to restore the full code and conversation. Once you do, the code is reverted and you're back to the point where you had the previous state.

If you want to go back further, open the rewind mode again with `Escape` twice and choose an earlier checkpoint. You can step backward through the entire history of your session.

There's also a `summarize from here` command available, but that's a topic for another time. If you want to cancel rewind mode, simply choose "nevermind" and stick to your current state.

![Rewind mode showing multiple checkpoints to navigate through](https://res.cloudinary.com/total-typescript/image/upload/v1784279344/ai-hero-images/ode1lxlwmeiuor7rucux.png)

## Persisting and Resuming Sessions

One other thing that's really important is the fact that an agent actually persists its sessions locally. This means you can quit out by pressing `Ctrl C` twice, and then you can resume it in multiple ways.

### Option 1: Resume with UUID

When you quit, you'll get output that shows a command you can run directly:

```
claude --resume [UUID]
```

Just run this command and you'll go back into the exact state you left previously.

### Option 2: Resume in a Fresh Session

Alternatively, you can `Ctrl C` twice to exit and open a new session by typing:

```
claude
```

This opens a totally fresh session. Inside, you can press:

```
/resume
```

Now you'll see all of the conversations you've had in this repository. You can even search through all of the sessions if you want. Select the one you were just using and press `Return` to go back into that same session.

![Resume menu showing list of previous sessions](https://res.cloudinary.com/total-typescript/image/upload/v1784279345/ai-hero-images/gnuaah32q9mvufyg1w2e.png)

### Option 3: Continue the Previous Session

If your session is interrupted for any reason, you can always resume it because the agent persists sessions locally.

Another way to pick up where you left off is to run:

```
claude --continue
```

This pulls you directly into exactly where you were, without needing to go through the resume menu.

## Summary

The agent allows you to navigate backwards and forwards in your conversation in several ways:

- **Enter rewind mode** - Press `Escape` twice to zoom through all checkpoints
- **Choose what to restore** - Pick whether to rewind code, conversation, or both
- **Persist sessions locally** - Quit and resume without losing progress
- **Multiple resume methods** - Use `--continue`, `/resume`, or the UUID command

With these tools, you can experiment freely knowing you can always step back to any previous point in your session.

<Quiz>
  <QuizQuestion data={{
    id: "rewind-restore-both-code-and-conversation",
    question: "You tried an approach, the agent edited files, and you want the whole attempt gone: the edits and the messages that produced them. Which rewind option do you pick?",
    type: "multiple-choice",
    choices: [
      { answer: "both", label: "Restore both the code and the conversation" },
      { answer: "convo", label: "Restore the conversation but keep the code" },
      { answer: "code", label: "Restore the code but keep the conversation" },
      { answer: "manual", label: "Choose nevermind and undo the files by hand" }
    ],
    correct: "both",
    answer: "Only the full restore rewinds the session to the point before the edit was made. Keeping the code leaves on disk exactly the edits you wanted gone, and keeping the conversation leaves the failed attempt in your history. Nevermind cancels rewind altogether and sticks you with your current state."
  }} />
  <QuizQuestion data={{
    id: "resume-picks-a-specific-past-session",
    question: "You are back in a repository you worked in last week and want a particular older conversation, not the one you were in most recently. How do you get to it?",
    type: "multiple-choice",
    choices: [
      { answer: "resume", label: "Run /resume and search the list of past sessions" },
      { answer: "continue", label: "Run claude --continue and steer it back yourself" },
      { answer: "rewind", label: "Press Escape twice and pick an earlier checkpoint" },
      { answer: "fresh", label: "Start a new session and describe the old one to it" }
    ],
    correct: "resume",
    answer: "/resume lists every conversation held in this repository and lets you search them, so you can pick the exact one. --continue pulls you into the session you were last in, which is not the one you want. Escape twice opens rewind, which moves within the session you are already in rather than switching to another. And a new session holds none of that history, since it lives in the persisted session."
  }} />
</Quiz>
