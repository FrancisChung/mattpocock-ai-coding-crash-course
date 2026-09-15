# Permissions

<CommitMap>
  <Commit id="make-a-schema-change">Start the lesson: the repo as the migrations exercise left it</Commit>
</CommitMap>

When working with an [agent](https://www.aihero.dev/ai-coding-dictionary/agent), you always need to think about risk versus reward, especially in how much power you give over to it. If you give an agent infinite power, it could do something dangerous by accident, like delete your entire [file system](https://www.aihero.dev/ai-coding-dictionary/filesystem).

To mitigate this risk, Claude Code has a very detailed permissions model. By default, it's very strict with itself about what it allows the agent to actually go and do.

## The Approval Flow

Let's say you ask an agent to run a simple command like `echo hello`. Because `echo` is an extremely safe command, the agent thinks this command is fine for it to run without asking.

![Echo command running without permission](https://res.cloudinary.com/total-typescript/image/upload/v1784209889/ai-hero-images/ovmugnfusfd7sybovzpc.png)

But if you ask it to do something like run a type check on the project, it might do something different. Instead of running it automatically, the agent [requests permission](https://www.aihero.dev/ai-coding-dictionary/permission-request) first.

![Permission request for pnpm typecheck command](https://res.cloudinary.com/total-typescript/image/upload/v1784209890/ai-hero-images/e5yepuoy7itc4awlb3az.png)

When the agent asks for permission, you'll see:

- The exact command it's going to run
- The reason it wants to run it
- Three options for how to respond

For example, when asking to run `pnpm typecheck`, you might see that it wants to run a type check using `react-router-typegen` and `tsc`.

![Three permission options: allow once, allow always, or reject](https://res.cloudinary.com/total-typescript/image/upload/v1784209891/ai-hero-images/yr0xzhtw2dfbrhrzezrz.png)

Your three options are:

1. **Allow once** - Yes, you're allowed to do this this time
2. **Allow always** - Yes, and you're allowed to then from now on run any `pnpm typecheck` command inside this project
3. **Reject and suggest** - No, and you can suggest a different command instead

If you don't want the agent to run a specific command, you can reject it and suggest an alternative. For instance, if you'd rather use `npx tsc` instead of `pnpm typecheck`, you can press Tab and give that reason.

![Suggesting an alternative command with npx tsc](https://res.cloudinary.com/total-typescript/image/upload/v1784209892/ai-hero-images/mdqopc8r8omaclqqrqh0.png)

The agent will then ask if it can run `npx tsc` instead. If you approve it with "allow always", you'll see something like `Bash(npx tsc *)` added to your permissions.

## Editing Permissions in Settings

Your permission preferences are recorded in a file at `.claude/settings.local.json`.

![The .claude folder showing settings.local.json file](https://res.cloudinary.com/total-typescript/image/upload/v1784209893/ai-hero-images/ay8zh771boo7a8gpokuu.png)

The syntax is important to understand here. You can actually edit this file yourself ahead of time to allow things to happen in the repo without needing to approve them each time.

If you want to allow a specific command, you can add it to the `allow` array:

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm typecheck)"
    ]
  }
}
```

If you want to say that all `pnpm` commands are available, you can use a wildcard:

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm *)"
    ]
  }
}
```

You can also disallow the agent from doing things by using the `deny` array.

For instance, if you don't want it to run `git push`, you might deny all git push commands:

```json
{
  "permissions": {
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

## Permissions Beyond Bash

It's not just bash commands that the agent needs permission to run. An agent can also search the web and fetch web pages to back up what it's seeing locally.

For example, you might ask it to fetch information about `react-router-typegen` from the web. The agent will ask you to approve a web search for "React router typegen".

![Permission request for web search](https://res.cloudinary.com/total-typescript/image/upload/v1784209893/ai-hero-images/ew3jeyvecxkitgxs5spp.png)

If you say yes and don't ask again, the agent adds it to `settings.local.json` and fetches from websites like [ReactRouter.com](https://reactrouter.com).

![Fetching from ReactRouter.com website](https://res.cloudinary.com/total-typescript/image/upload/v1784209894/ai-hero-images/mrgzb9zgeseaz2avndpu.png)

The permission is added as `WebFetch(domain:reactrouter.com)` in your settings file.

Once it fetches the information, it can give you a summary of how React Router typegen works based on the actual documentation.

## Sharing Permissions With Your Team

By default, `settings.local.json` is in your project and ignored by version control. This means the permissions apply only to you.

But if you want to share these permissions with your team and have a specific set of things always allowed within the repo, you can rename `settings.local.json` to `settings.json`.

This file can then be checked into version control and shared with your team.

When anyone on your team runs the agent on the repo, it will pick up these permissions automatically. This is incredibly powerful for anyone starting on your repo for the first time. They just run the agent, and it already knows what's allowed for that repo. This is a lot faster than having to manually set up the permissions yourself each time.

## Auto Mode vs Manual Permission Handling

There's another way to work with permissions: **[auto mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode)**. You can see the mode selector in the bottom left of Claude Code and cycle between them using Shift+Tab.

![Mode selector showing manual, edits, plan, and auto modes](https://res.cloudinary.com/total-typescript/image/upload/v1784209895/ai-hero-images/xfufdaijimu1fybc9ucs.png)

The available modes are:

- Manual mode
- Edits mode
- Plan mode
- Auto mode

Auto mode uses an LLM classifier to look at your conversation and check if the thing the agent is about to run is safe. For example, you can run `npm run typecheck` and the agent will run the shell command without asking for permission first.

![Running npm run typecheck in auto mode without permission prompt](https://res.cloudinary.com/total-typescript/image/upload/v1784209896/ai-hero-images/qecy4laukd9n9yq34ihj.png)

This is different from manual mode. The agent is able to classify itself whether the command is dangerous or not. This does mean some [tokens](https://www.aihero.dev/ai-coding-dictionary/token) are spent to check whether the command is safe, which costs a bit of time. So auto mode is a little bit slower, but it means you can run these things pretty much without needing to intervene.

The main classifier [model](https://www.aihero.dev/ai-coding-dictionary/model) is probably Claude Haiku. However, the classifier isn't perfect. It does allow some things you don't want to happen (like migrating databases sometimes), and it blocks some things you do want to happen (like creating GitHub issues).

But for most use cases, it's on the right side of OK. It does block most of the bad things that would happen, especially the stuff that's always bad like `rm -rf` on your file system. It also doesn't drive up your usage limits too much, making it a pretty good trade-off.

The `settings.json` file is still really useful with auto mode. The agent checks `settings.json` first, before running the command through the classifier. This means you can speed up common operations and not have to worry about the classifier by just having something in `settings.json`.

To set auto mode as your default, go into config and select `default permission mode`. You can choose this by pressing Enter or Space.

![Config menu showing default permission mode setting](https://res.cloudinary.com/total-typescript/image/upload/v1784209896/ai-hero-images/hbixwvn8uzcnrptb9wdg.png)

<Quiz>
  <QuizQuestion data={{
    id: "share-repo-permissions-via-settings-json",
    question: "Everyone on your team keeps approving the same handful of commands on a shared repo. How do you make the repo's rules arrive with the checkout?",
    type: "multiple-choice",
    choices: [
      { answer: "shared", label: "Rename settings.local.json to settings.json" },
      { answer: "each", label: "Ask each person to pick allow always once" },
      { answer: "auto", label: "Tell the team to switch on auto mode instead" },
      { answer: "readme", label: "Paste your local settings into the README" }
    ],
    correct: "shared",
    answer: "settings.local.json is ignored by version control, so what you approve never leaves your machine. Renamed to settings.json it can be checked in, and anyone running the agent on the repo picks the permissions up on their first run. Allow always still means every person approves everything once each. Auto mode makes a fresh judgement per command rather than recording the repo's rules. And a README is read by people, not by the agent."
  }} />
  <QuizQuestion data={{
    id: "auto-mode-classifier-tradeoff",
    question: "You switch to auto mode so the agent decides for itself whether a command is safe. What does that cost you?",
    type: "multiple-choice",
    choices: [
      { answer: "slower", label: "Each command is a little slower while it is checked" },
      { answer: "ignored", label: "Permissions in settings.json stop being consulted" },
      { answer: "anything", label: "Every command runs, including rm -rf on your disk" },
      { answer: "limits", label: "Your usage limits climb sharply as it checks" }
    ],
    correct: "slower",
    answer: "The check is a classifier model call, so tokens are spent and each command takes a little longer. settings.json is still read first, before the classifier ever runs, which is exactly how you speed common commands back up. The classifier is not a blank cheque either: it blocks the things that are always bad, such as rm -rf on your file system. And it does not drive usage limits up much, which is what makes the trade worth taking."
  }} />
  <QuizQuestion data={{
    id: "deny-array-blocks-a-command-outright",
    question: "There is one command you never want the agent to run in this repo, whatever it judges at the time: git push. What do you set up?",
    type: "multiple-choice",
    choices: [
      { answer: "deny", label: "A deny entry of Bash(git push *) in settings" },
      { answer: "allowrest", label: "An allow entry for every command except push" },
      { answer: "auto", label: "Auto mode, which classifies pushes as unsafe" },
      { answer: "prompt", label: "A note in your prompt telling it not to push" }
    ],
    correct: "deny",
    answer: "The deny array is the one of these that stops the command outright. Allow-listing everything else is unmaintainable and still says nothing about push itself. The classifier is imperfect in both directions, letting through things you did not want, so auto mode is not a guarantee. And an instruction in a prompt is not a permission rule: the rules live in the settings file."
  }} />
</Quiz>
