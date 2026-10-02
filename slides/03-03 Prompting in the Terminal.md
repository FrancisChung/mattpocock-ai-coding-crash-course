# Prompting in the Terminal

Now that you understand the basics of prompting, here are some built-in features you can use to improve how you work with [agents](https://www.aihero.dev/ai-coding-dictionary/agent).

## Referencing Files With @

You may want to reference individual files in your agent. To do this, press `@` to open the file picker.

![Claude Code interface showing the @ file picker with fuzzy search filtering through project files](https://res.cloudinary.com/total-typescript/image/upload/v1784208949/ai-hero-images/z6oyekrfm7u2j6avr61f.png)

You can then:

- Use arrow keys to browse through files
- Type to fuzzy search for specific files like `routes.ts`
- Press return to pull that file into your text box

You can add multiple files this way - just repeat the process. For instance, you might add `components.json` after `drizzle.config.ts`. You can also use tab to pull files into your text window.

Once you press enter, both files get read into the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) immediately. The agent reads the files directly on the first request without needing extra [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call).

This is especially useful when you need to pass in a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) or specific configuration file that the agent should reference directly.

## Stashing A Prompt With Ctrl+S

Sometimes you're not ready to send a prompt, but you don't want to lose it. You can stash it instead.

Type your prompt - for example: "hello, how are you"

If you're not ready to send it, press `Ctrl+S` to stash it.

![The agent interface showing a stashed prompt marker](https://res.cloudinary.com/total-typescript/image/upload/v1784208950/ai-hero-images/yhx1xupf5cuggzbyo3tb.png)

You'll see a "stashed" indicator. Now you can type something else into the text box. When you're ready, the stashed prompt will rehydrate back into your input.

For example:

- Stash: "hello, how are you"
- Type something new: "hello"
- Press return
- The original stashed prompt gets restored into the text box

This is really useful when you're giving the agent feedback. You might send something, realize you're not ready, pull back, insert something else in the middle, and then finalize your prompt before sending it.

## Pasting In Images

You can copy and paste images directly into the agent - even screenshots.

![A browser showing a Wikipedia image of Lake Bled in Slovenia](https://res.cloudinary.com/total-typescript/image/upload/v1784208950/ai-hero-images/abrqn57ei83mel35sezw.png)

For example, here's an [image of Lake Bled in Slovenia](https://en.wikipedia.org/wiki/Lake_Bled#/media/File:Lake_Bled_from_the_Mountain.jpg). Right-click on an image and copy it. Then paste it into the text box. You'll see a "pasting" indicator in the bottom left, and the image appears in your input.

![The agent interface with an image pasted into the text box](https://res.cloudinary.com/total-typescript/image/upload/v1784208951/ai-hero-images/brb1bpz1d0wdju6ojg8x.png)

You can now ask the agent about the image. It will analyze it and respond.

![The agent responding with details about Lake Bled, mentioning the Church of the Assumption and its bell tower](https://res.cloudinary.com/total-typescript/image/upload/v1784208952/ai-hero-images/kdabva7izboeuiskqdjn.png)

Images become part of your prompt, so you can reference screenshots, mockups, and other visuals directly without uploading them separately.

## Summary

You now know three powerful prompting techniques:

- **Reference files** using `@` to pull specific files into [context](https://www.aihero.dev/ai-coding-dictionary/context)
- **Stash prompts** with `Ctrl+S` to save half-written prompts and rehydrate them later
- **Paste images** from your clipboard to include screenshots and visuals in your prompts

<Quiz>
  <QuizQuestion data={{
    id: "at-reference-loads-file-on-first-request",
    question: "You already know the exact config file the agent has to follow. What happens when you pull it in with @ rather than describing it in words?",
    type: "multiple-choice",
    choices: [
      { answer: "immediate", label: "Its contents are in the context window on the first request" },
      { answer: "editor", label: "The agent opens it in your editor for you to review first" },
      { answer: "later", label: "The agent is told to read it later if it turns out to matter" },
      { answer: "link", label: "A link to the file is stored and resolved only when needed" }
    ],
    correct: "immediate",
    answer: "The file picker reads the file straight into the context window, so the agent has it on the first request with no extra tool call. It is not a deferred instruction or a stored link that gets resolved later, and nothing is opened in your editor: @ only fills your text box."
  }} />
  <QuizQuestion data={{
    id: "stash-a-half-written-prompt",
    question: "You are halfway through a long prompt when you realise the agent needs one quick correction first. What do you do with the draft?",
    type: "multiple-choice",
    choices: [
      { answer: "stash", label: "Press Ctrl+S to stash it, send the short one, and it returns" },
      { answer: "scratch", label: "Copy the draft into a scratch file, then paste it back after" },
      { answer: "send", label: "Send the half-written prompt now and finish your thought after" },
      { answer: "retype", label: "Delete the draft, send the short message, and type it out again" }
    ],
    correct: "stash",
    answer: "Ctrl+S holds the draft and rehydrates it into the text box once the other message has gone. A scratch file and retyping both do by hand what the stash does for you, and sending the half-written prompt hands the agent instructions you had not finished, which it will act on."
  }} />
</Quiz>
