# Codebase Exploration Solution

Let's start by running an initial exploration prompt to see what happens. A lot of stuff will happen very quickly, so let's zoom out to get a better view.

What we're looking for is the number of files, the searches, and the [tools](https://www.aihero.dev/ai-coding-dictionary/tool) that the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) uses to explore the directory. To see this in more detail, press Ctrl+O, this shows a more verbose version of the output.

![Verbose output showing detailed tool usage](https://res.cloudinary.com/total-typescript/image/upload/v1784723865/ai-hero-images/xccofy1jlg0xgxbkrhuo.png)

### Examining the verbose output and tool usage

Looking at the top of the output, just after the initial prompt was added, we can see the sequence of tools the agent used:

The first thing it reads is the **README** file. It then finds the `package.json` by running a bash command:

```bash
find . -name package.json -not -path '*/node_modules/*'
```

This is a Linux command that searches for `package.json` files while excluding the `node_modules` directory.

Once found, it reads the `package.json` file. It then reads two more files at once: the request-logger `package.json` and the request-logger `README`. This gives it all the information it needs to produce a tech stack table.

If we search inside the logs for "tool_result", we can see all the [tool results](https://www.aihero.dev/ai-coding-dictionary/tool-result). There are eight tags total, which means there are four tool results. The only files read were the main README, the `package.json`, and the files for the request-logger. This is really just a surface-level skim.

After this first exploration, the agent has only spent around **26.1k [tokens](https://www.aihero.dev/ai-coding-dictionary/token)**, not that many at all.

![Token count showing 26.1k tokens used](https://res.cloudinary.com/total-typescript/image/upload/v1784723866/ai-hero-images/bjmhbqui446hb1juwamv.png)

## Requesting deeper code analysis

Now let's ask it for a follow-up with a more detailed request:

```
Give me a much more in-depth understanding about the different parts of the app, the different modules inside it, and go ahead and read a ton of source code to give me more information.
```

By doing this, we're asking the agent to put in more effort and do more legwork. It says it's going to do a deep dive. It lists some directories, finds various areas, and starts reading files in parallel: schema, database, routing, services, and so on.

![Agent reading multiple files in parallel](https://res.cloudinary.com/total-typescript/image/upload/v1784723867/ai-hero-images/cmn5cndy3p4wzzqlqnod.png)

One interesting thing here is that the agent isn't opening up any [sub-agents](https://www.aihero.dev/ai-coding-dictionary/subagent). It's reading all the files directly into the parent agent's [context](https://www.aihero.dev/ai-coding-dictionary/context).

This process takes a while. The agent is working through extremely long amounts of raw code files. The amount of information it now has access to is much richer than before.

## Understanding non-deterministic behavior

Because [models](https://www.aihero.dev/ai-coding-dictionary/model) are [non-deterministic](https://www.aihero.dev/ai-coding-dictionary/non-determinism), sometimes the agent will explore by putting code directly into its main [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), but sometimes it will use sub-agents instead.

To show you what using sub-agents looks like, let's go back to where we gave the initial prompt for a more in-depth understanding. We'll add three words to the end of that request:

```
Give me a much more in-depth understanding about the different parts of the app, the different modules inside it, and go ahead and read a ton of source code to give me more information. Use subagents.
```

This explicit mention of sub-agents should prompt the agent to spawn sub-agents to do the exploration.

![Prompt with 'Use subagents' instruction](https://res.cloudinary.com/total-typescript/image/upload/v1784723868/ai-hero-images/ezinhfk9ps77a0uij4fa.png)

## The divide-and-conquer approach

The agent first gets a quick map of the structure, then dispatches sub-agents to deep-dive different areas in parallel. Remember, we've rewound to the point where it only had the `package.json` and README. All the previous deep-dive information is gone from its context window.

The agent decides to divide and conquer. It splits the work into four areas and dispatches a sub-agent to deep-read each in parallel:

- The data layer
- The service layer
- The routes/UI layer
- The request-logger proxy

![Four sub-agents dispatched for different areas](https://res.cloudinary.com/total-typescript/image/upload/v1784723869/ai-hero-images/ausummdxmd58fd4k2ynk.png)

Looking at the bottom right, we can see all the tokens that these sub-agents are spending. This is a pretty expensive operation, we're at around 200k tokens and rising, spread across these four sub-agents.

![Token counter showing 200k tokens across sub-agents](https://res.cloudinary.com/total-typescript/image/upload/v1784723870/ai-hero-images/rqp5rmvx0fenzmfftvyz.png)

From these sub-agents, we're going to get seriously rich detail. The way they work is they send back a summary of their findings to the parent agent.

Check out the routes/UI layer sub-agent alone, it uses 159k tokens just for that one area.

Once all four deep reads complete, we have extremely detailed information. The agent even spotted a deliberate architectural outlier, which is very clever.

![Agent output identifying deliberate architectural outlier](https://res.cloudinary.com/total-typescript/image/upload/v1784723870/ai-hero-images/vl42n66qufiw6yqyqdhv.png)

The routes and UI layer is very deeply researched, the service layer has comprehensive coverage, and the request-logger is thoroughly documented. For all of that work by the sub-agents, the parent agent's context window only used around **65.1k tokens**, that's remarkably efficient for analyzing the entire repository and chunking it down into a tiny summary.

![Parent agent context showing only 65.1k tokens](https://res.cloudinary.com/total-typescript/image/upload/v1784723872/ai-hero-images/bzrhukn0t4liwpwafwld.png)

### How sub-agents report back

If we look inside the logs, we can find the summaries that come back from the sub-agents. They arrive as system notifications, automated background task events.

![System notification from sub-agent in logs](https://res.cloudinary.com/total-typescript/image/upload/v1784723872/ai-hero-images/tzbjccpjbwpu1emmlfqp.png)

Here's what one sub-agent's report looks like. It comes through with an "UI layer overview" and gives a complete route map with all the different areas:

- Public (unauthenticated routes)
- Auth (outside app layout)
- Purchase and redeem flows
- Instructor (authoring tools)
- Admin
- Team
- API endpoints

![Sub-agent report showing complete route map](https://res.cloudinary.com/total-typescript/image/upload/v1784723874/ai-hero-images/fjvu5ojsx2hqpfck7jnu.png)

The report includes lots of pattern information and personas. It also contains a list of notable UI components and some developer experience features. Inside the report, there's extra information about key file paths, which is super critical, so the parent agent can just read those file paths if it needs to.

![Key file paths section in sub-agent report](https://res.cloudinary.com/total-typescript/image/upload/v1784723875/ai-hero-images/mkswu5kyxallyquo5h6b.png)

This is what a sub-agent reports back: an extremely detailed summary to the parent agent that's extremely dense in terms of token quality. You're not having raw files passed in here. It's a really well-crafted summary that the parent agent can then use to find relevant files if needed.

### Why this pattern works

Most of the time on large repositories, this is how sub-agents work:

1. The sub-agent reads a bunch of files
2. It synthesizes all that information
3. It reports back a summary, including key file paths and lots of detail, to the parent agent

The parent agent (the orchestrator) stays lean, while the sub-agents spend their tokens doing deep exploration and summarizing their findings.

![Diagram showing orchestrator and sub-agent relationship](https://res.cloudinary.com/total-typescript/image/upload/v1784723876/ai-hero-images/ozxbltlkeyefllfouu7e.png)

The alternative is what we saw earlier, the agent just does its exploration itself, reading all the files directly into its own context.

## Choosing your exploration strategy

Many prefer having sub-agents go off and do the exploration. This way, you keep a really tight context window in the orchestrator.

This is where paying attention to your starting context window pays off. If your starting context is really big, then you're going to pay that cost every time you open a sub-agent. Keeping it small means it's more economical and you get more time in the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone).

So it makes sense why exploration is so important and why using sub-agents for exploration is so effective, it lets you scale your understanding of large codebases while keeping token costs reasonable.

In the next lesson, we're going to show you a technique for learning any repository.

Good work, I'll see you in the next one.
