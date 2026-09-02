# Claude and Your IDE

Claude Code integrates with your editor of choice through the `/ide` command. You don't have to use VS Code like this course does - you can use Cursor, Windsurf, Antigravity, or whatever tools are available to you.

The `/ide` command lets you manage your IDE integrations and check their status.

```
/ide
```

When you run this command, it shows you which editor you're connected to.

![Terminal showing Visual Studio Code connection status](https://res.cloudinary.com/total-typescript/image/upload/v1784209071/ai-hero-images/sd29y01a0go4rdmo7wbf.png)

In this case, we're connected to Visual Studio Code because the Claude Code for VS Code extension has been installed.

![Claude Code for VS Code extension installed in the editor](https://res.cloudinary.com/total-typescript/image/upload/v1784209072/ai-hero-images/xxf3s3vkctucxkka0osl.png)

If you run `/ide` in your terminal, it will show you how to install the matching extension for whatever IDE you're using.

Once you confirm and exit the command, you're ready to start using the integration.

## Reviewing Diffs in Your Editor

The main reason to connect your editor is for diff management. This comes up constantly when working with [agents](https://www.aihero.dev/ai-coding-dictionary/agent).

For example, if you prompt the agent to "remove the test watch command from package.json," it will read the file and make updates to it.

Without an editor connection, the diff would display in the terminal as text, which is awkward and hard to [review](https://www.aihero.dev/ai-coding-dictionary/human-review). But with your editor connected, you see the diff displayed right inside your IDE.

This is much better. You can:

- Scroll through the file to see context
- Review the exact changes the agent made
- Accept all changes with the "Accept Proposed Changes" button
- Click into the diff and make manual tweaks before saving
- Save the file to confirm the changes

![Reviewing the decent edit in VS Code's diff view](https://res.cloudinary.com/total-typescript/image/upload/v1784209072/ai-hero-images/ylxahtet8o6pqcaf7oc3.png)

Being able to dive in and tweak the agent's output directly in your editor is powerful. And reviewing diffs in a proper IDE instead of the terminal makes the whole workflow much smoother.

## Why Use an Editor?

There are more features and more ways your editor can integrate with agents, but the diff feature is the one you'll use 99% of the time. It's the primary reason to run your agent inside your editor rather than just in the terminal.

If you're following along, feel free to go back through the video if you get stuck, or ask questions in the [Discord](https://aihero.dev/discord) if you run into trouble.

Nice work - see you in the next one.
