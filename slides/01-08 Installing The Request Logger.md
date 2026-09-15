# Installing The Request Logger

[Agents](https://www.aihero.dev/ai-coding-dictionary/agent) can feel like a black box. You type a message, the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) sends a request to the [model provider](https://www.aihero.dev/ai-coding-dictionary/model-provider), and you never see what's in it, not the [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt), not the [tool](https://www.aihero.dev/ai-coding-dictionary/tool) definitions, not any of it.

The course repo ships a **request logger** to fix that. It's a small proxy that sits between your agent and the model provider, passes everything through untouched, and writes a readable copy of every [request](https://www.aihero.dev/ai-coding-dictionary/model-provider-request) to disk.

## Steps To Complete

### Start The Request Logger

- [ ] In a terminal, start the request logger from the repo root:

```bash
npm run request-logger
```

The first time you run it, it asks which coding agent you use. If your agent can use more than one model provider, it asks which one. Then it asks whether to remember your answer, so it only has to ask once.

It then starts a local web server listening on `localhost:8787`, and prints the exact command for the agent you picked.
![Terminal showing the request logger listening on localhost:8787](https://res.cloudinary.com/total-typescript/image/upload/v1786014759/ai-hero-images/t5aykyifb0qwyqmrdjqa.png)

- [ ] In a second terminal, copy and paste the command the request logger printed, and run it

That command starts your agent pointed at the logger. Do not write it yourself. The logger builds it for your agent, so it is correct as printed. Some agents also need a small config file, and the logger prints that too.

The command sets everything at startup, so your agent must be launched with it.

- [ ] Send a short message to the agent and confirm it responds as normal

The proxy passes everything through untouched. Your agent should feel identical to use.
![Agent responding normally while the request logger is running](https://res.cloudinary.com/total-typescript/image/upload/v1786014760/ai-hero-images/ioaevqmr7z5d5kr7ubbx.png)

### Explore The Log Files

- [ ] Open the `request-logger/logs/` folder

After sending a message, you'll see timestamped files appear. Each timestamp is in UTC.
![The request-logger/logs folder showing timestamped log files](https://res.cloudinary.com/total-typescript/image/upload/v1786014760/ai-hero-images/zqzsalw3zkmr9ao3gkng.png)

- [ ] Open the newest `.md` file - this is the readable render and the one to start from

The three file types for each request are:

| File | Contents |
| --- | --- |
| `.md` | The readable render - start here |
| `.request.txt` | The verbatim request body |
| `.response.txt` | The raw response stream |

- [ ] Note that you may see more than one log entry per message you send

Claude Code fires a quota probe at startup, a deliberate one-token request to check subscription headroom. That probe lands as its own log entry (often a 429 error), separate from the real [turn](https://www.aihero.dev/ai-coding-dictionary/turn). So two entries for one message is expected, not a retry.

### Navigate The Readable Render

- [ ] Familiarise yourself with the XML tag structure of the `.md` file

The file uses XML tags rather than Markdown headings to delimit sections, because the captured content is itself full of Markdown headings. The sections are:

```
<meta>         - timestamp, model, endpoint, status
<headers>      - request headers (authorization is redacted)
<request>
  <params>     - max_tokens, stream, thinking settings
  </params>
  <system-prompt>
  </system-prompt>
  <tools>
  </tools>
  <messages>
  </messages>
</request>
<response>     - stop reason and token usage
</response>
```

- [ ] Scroll through the `<tools>` block and note how large it is relative to the rest of the file

Tool schemas are JSON and take up the majority of the file. On a one-word prompt like `Hello!`, this can run to over 1,000 lines out of roughly 1,300 total.
![The readable .md log file open, showing the large tools block](https://res.cloudinary.com/total-typescript/image/upload/v1786014761/ai-hero-images/abvgx5bs47gxuq2btcip.png)

- [ ] Find the `<system-prompt>` block and read what's in it

This is the standing brief your agent prepends to every request before you've typed anything. It includes things like your working directory, platform, and [session](https://www.aihero.dev/ai-coding-dictionary/session) guidance.

- [ ] Find the `<messages>` block and locate your actual message inside it

You'll also see a system-reminder turn injected before your message with context like the current date. This is a message, not part of the system prompt, only visible here because of the logger.

- [ ] Check the `<response>` block for the [token](https://www.aihero.dev/ai-coding-dictionary/token) usage figures

Even a single `Hello!` can result in tens of thousands of [cached tokens](https://www.aihero.dev/ai-coding-dictionary/cache-tokens) being read. The full system prompt and tool definitions are sent on every turn.

You can shut the request logger down now. We'll call it out specifically when we need it again later in the course.


