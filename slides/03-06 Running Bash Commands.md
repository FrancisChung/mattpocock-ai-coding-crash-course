# Running Bash Commands

One super important part of working with Claude Code is running bash commands. Bash commands turn your [agent](https://www.aihero.dev/ai-coding-dictionary/agent) from just a passive code writer into something that can actually seek feedback loops, can actually work with your project and can use all the power of bash at its disposal to find information and to do stuff.

Now we can't just manually ask Claude "OK, run the dev server for me", and because it's quite smart it will understand "OK, I need to read the `package.json`, I need to find where the dev server is, and then I need to run it like this." But suffice to say, there are some times when you just know what command you want to run, and you just want to run it, and then put the result into the agent's [context](https://www.aihero.dev/ai-coding-dictionary/context).

There are really three main approaches to running bash commands in an agent:

1. Run commands directly and let the agent see the output
2. Background long-running processes and monitor them
3. Suspend the agent to run commands it won't see

## Running commands with bash mode

The way you run commands that the agent can see is by using **bash mode**. I've just restarted my agent instance. I'm going to just put an exclamation mark and now I've entered bash mode.

![Terminal showing the ! prefix to enter bash mode](https://res.cloudinary.com/total-typescript/image/upload/v1784209316/ai-hero-images/xrtyomhrfwizm4mthajj.png)

```
!
```

Anything you put in here will be turned into a bash command and actually run for the agent. For instance, you can run `npm run typecheck` inside here and now it just runs the command after you press enter.

![Terminal showing npm run typecheck being executed with the ! prefix in bash mode](https://res.cloudinary.com/total-typescript/image/upload/v1784209317/ai-hero-images/zmfo6m2c9okz1u8ck8je.png)

Now because I haven't run `npm install` in my setup here, I'm getting a lot of errors. These errors are now present to the agent in its context. So I'm going to get it to help me solve these errors and it will be able to see the errors and actually work with them.

It figures out that Zod is in `package.json`, but not installed. So it suggests that you should run `npm install`. There we go.

## Backgrounding long-running processes

This works well for commands that essentially have a start and an end. But what about commands that are supposed to persist, like long-running dev servers?

For that you can run `npm run dev` inside bash mode here:

```
! npm run dev
```

And while it's running you can actually press **Ctrl-B** to run it in the background. In this version of Claude Code, something appears that says "command was manually backgrounded with `userID` this."

![Message confirming the command was manually backgrounded with a userID](https://res.cloudinary.com/total-typescript/image/upload/v1784209318/ai-hero-images/izo7fexocnkddnw8xetv.png)

Any output from that task goes into a local file. You can see that underneath your status line there is a little background task showing. You can zoom downwards with the down arrow there, and you can press return to see it. Now you can actually view the shell and see what's going on.

![Background task panel showing the dev server running on localhost 5175](https://res.cloudinary.com/total-typescript/image/upload/v1784209319/ai-hero-images/tjzglv8owvxdfdtsmsnu.png)

You've got lots of options here. You can stop it with X if you want to, or you can just press left to go back and now you're back in your agent instance.

This is really useful when you're debugging a problem with your dev server, because the agent can see where all of the logs are being written to. It can try something out in the UI, maybe, or send a curl request, and then it can actually see the output of the dev server.

## Suspending the agent to run hidden commands

I've just reset my instance here so we can see another feature which is suspending the agent. If, for instance, you want to run something that you don't want the agent to see the results of, or you don't care to show it, and you have some [state](https://www.aihero.dev/ai-coding-dictionary/stateful) inside the agent that you want to preserve, then you can use suspend.

You can press **Ctrl-Z** inside here and the agent has been suspended. This means you can now run any command you want to.

![Running echo foo in a suspended terminal session](https://res.cloudinary.com/total-typescript/image/upload/v1784209368/ai-hero-images/dpnfygieil8tzupfc7fm.png)

```
echo foo
```

This is not visible to the agent.

![Running fg to bring the agent back with its state intact](https://res.cloudinary.com/total-typescript/image/upload/v1784209369/ai-hero-images/bfrsjj3knmfcmfwo80lg.png)

If you want to bring the agent back, you can just run `fg` here, and you get your agent instance back with all of its state.

This is great if you just want to say "OK, don't care about the agent, do something like whatever command I want, and then `fg` to bring it back."

## When to use each approach

The decision tree for this really looks like this:

| Goal                                | Approach               | Shortcut                    |
| ----------------------------------- | ---------------------- | --------------------------- |
| Agent needs to see the output       | Use bash mode          | `!` prefix                  |
| Long-running process (dev servers)  | Background with Ctrl-B | After `!` command           |
| Command should be hidden from agent | Suspend the agent      | Ctrl-Z, then `fg` to return |

If you want the output of the bash command you're running to be visible to the agent, then you can use bash mode by using the exclamation mark, and you can background that with Ctrl-B and then manage those backgrounded tasks.

Really, really useful for dev servers. You don't use it every single time, but when you do use it, it's usually for debugging some kind of dev server issue.

But if you want the command to be totally hidden from the agent, you can just suspend it quickly with Ctrl-Z.

Note: these are keyboard shortcuts that work on most systems, but you might need to do something different if you're on Mac.

So those are all the different ways that you can manage bash commands in your agent setup.

<Quiz>
  <QuizQuestion data={{
    id: "bash-mode-puts-output-in-context",
    question: "You want to run your type check yourself and then have the agent fix whatever it reports. How do you run it?",
    type: "multiple-choice",
    choices: [
      { answer: "bang", label: "Prefix it with ! so the agent sees the output" },
      { answer: "suspend", label: "Suspend with Ctrl-Z, run it, then return with fg" },
      { answer: "second", label: "Run it in a second terminal and paste the errors" },
      { answer: "background", label: "Background it with Ctrl-B and watch the panel" }
    ],
    correct: "bang",
    answer: "Bash mode runs the command and puts its output straight into the agent's context, so it can work with the errors immediately. Suspending exists precisely to hide output from the agent, so it would have nothing to go on. A second terminal makes you copy the errors across by hand. And Ctrl-B is for processes that keep running; a type check ends on its own."
  }} />
  <QuizQuestion data={{
    id: "background-a-long-running-dev-server",
    question: "You start the dev server in bash mode and it never hands the prompt back, because it is not going to exit. What do you do?",
    type: "multiple-choice",
    choices: [
      { answer: "ctrlb", label: "Press Ctrl-B to background it and carry on" },
      { answer: "ctrlz", label: "Press Ctrl-Z to suspend, then fg to come back" },
      { answer: "kill", label: "Press Ctrl-C to kill it and let the agent start it" },
      { answer: "wait", label: "Wait for it to finish before prompting again" }
    ],
    correct: "ctrlb",
    answer: "Ctrl-B backgrounds the running command, sends its output to a local file the agent can read, and gives you a background task under the status line to view or stop. Ctrl-Z suspends the whole agent rather than the server, and fg only brings the agent back. Killing it leaves you with no running server and no logs to debug against. And a dev server does not finish, so waiting stalls you indefinitely."
  }} />
  <QuizQuestion data={{
    id: "suspend-hides-a-command-from-the-agent",
    question: "You need to run a command whose output the agent must not see, and you want the agent's state intact afterwards. What do you do?",
    type: "multiple-choice",
    choices: [
      { answer: "suspend", label: "Press Ctrl-Z, run the command, then fg" },
      { answer: "bashmode", label: "Run it in bash mode and ignore the output" },
      { answer: "ask", label: "Ask the agent to disregard what it sees" },
      { answer: "quit", label: "Quit the agent and run it afterwards" }
    ],
    correct: "suspend",
    answer: "Ctrl-Z suspends the agent so the command runs where it cannot see it, and fg brings the agent back with all of its state. Bash mode exists to feed output into the context, so running it there puts in front of the agent the very thing you wanted hidden, as does asking it to disregard output it has already been given. Quitting hides the command but throws away the state you wanted to keep."
  }} />
</Quiz>
