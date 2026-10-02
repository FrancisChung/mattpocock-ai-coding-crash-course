# Effort

[Effort](https://www.aihero.dev/ai-coding-dictionary/effort) is a dial you can adjust on the [model](https://www.aihero.dev/ai-coding-dictionary/model) that is provided by pretty much every [model provider](https://www.aihero.dev/ai-coding-dictionary/model-provider) now. In Claude Code here you can specify `/effort` and then choose the effort level you want.

![Claude Code showing the /effort command with different effort levels displayed](https://res.cloudinary.com/total-typescript/image/upload/v1784118751/ai-hero-images/qextun0tafvvlwomeyud.png)

The dial ranges from faster effort levels on the left to smarter effort levels on the right. This video explores how to decide what effort level to use for your work.

## Comparing Low vs Max Effort

Let's see what the difference looks like in practice. Setting effort to `max` and asking the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) to explore a codebase and tell you about it produces very different results compared to setting it to `low`.

![Terminal showing max effort run with 41,000 tokens used and 2 minutes 15 seconds elapsed](https://res.cloudinary.com/total-typescript/image/upload/v1784118752/ai-hero-images/fvjdpc479zlti8pno7ri.png)

When running the same prompt with different effort levels:

| Metric         | Low Effort              | Max Effort                                                     |
| -------------- | ----------------------- | -------------------------------------------------------------- |
| Time taken     | 1 minute 11 seconds     | 2 minutes 15 seconds                                           |
| Tokens used    | 11,000                  | 41,000                                                         |
| Analysis depth | Basic facts, tech stack | Deeper exploration, features, file structure, potential issues |

The low effort version captured the basic facts about the repo - it figured out the request logger subproject and the tech stack.

The max effort version went deeper, exploring actual features, authentication implementation details, and file structure. It even found some documentation drift that the low effort version missed.

The max effort approach put in more work and got slightly better feedback, but it spent four times as many [tokens](https://www.aihero.dev/ai-coding-dictionary/token) to do so. That's the core trade-off: more thinking for more cost.

So what is happening here? Why is it putting more effort in? What mechanism is it using to do that?

## How Reasoning Tokens Work

Models can produce three types of outputs: text, [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call), and reasoning. Those reasoning tokens are the model's own train of thought, a kind of stream of consciousness for what the model is thinking.

In some interfaces, these reasoning tokens are displayed to the user. Some agents show them directly. But in Claude Code, you only see the text and tool calls - the reasoning happens behind the scenes.

The theory behind this comes from an [older technique called **Chain of Thought Prompting**](https://arxiv.org/pdf/2201.11903). The research showed that when you ask a model to show its working, it does a better job.

![Chain of Thought paper showing standard prompting example with incorrect answer](https://res.cloudinary.com/total-typescript/image/upload/v1784118753/ai-hero-images/xg4rlrubh81kj1b8cnay.png)

For example, with standard prompting:

```
The cafeteria had 23 apples. If they used 20 to make lunch
and bought 6 more, how many apples do they have?

Answer: 27
```

This answer is wrong. But if you get the model to go through the steps:

```
They had 23 apples originally
They used 20 to make lunch: 23 - 20 = 3
They bought 6 more apples: 3 + 6 = 9

Answer: 9
```

By showing its reasoning, the model gets the right answer.

When you increase effort, you're essentially telling the model: produce more reasoning tokens, show more of your thinking.

## Effort Levels and Benchmark Performance

This approach is proven across benchmarks to increase performance. [DeepSWE](https://deepswe.datacurve.ai/) is a reputable benchmark that shows how different models perform at different effort levels.

![DeepSWE benchmark graph showing performance vs cost for different effort levels](https://res.cloudinary.com/total-typescript/image/upload/v1784118753/ai-hero-images/rziqhl3gcttxmsfsxsbf.png)

Looking at the performance data:

| Model   | Low | Medium | High | Extra High | Max |
| ------- | --- | ------ | ---- | ---------- | --- |
| Claude  | 60% | 65%    | 69%  | 70%        | 70% |
| GPT 5.6 | 45% | 61%    | 69%  | -          | -   |

As effort increases, so does the cost per task.

![DeepSWE graph showing Claude Sonnet 5 cost and performance metrics](https://res.cloudinary.com/total-typescript/image/upload/v1784118754/ai-hero-images/m6igfxeysyi8nurhzw6z.png)

Claude Sonnet 5, for instance, starts at 31% quality on low effort but costs $26 per task. To get better performance, you might switch to GPT 5.6, which only costs $1.86 to outperform that baseline.

**The critical insight**: effort is not just a quality trade-off. It's also a latency trade-off. The more tokens you use, the sooner you hit the [dumb zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), where the model's reasoning becomes degraded. More effort means you're burning through your token budget faster, leaving less room for actual work.

## Choosing Your Effort Level

The first point: avoid `max` effort. Max and even `extra high` are extremely wasteful uses of tokens. Model providers include these settings mainly to push their benchmark scores higher by a few percentage points. If they can squeeze out 2% improvement on benchmarks, that might rank them higher than competitors.

But your concern is different: day-to-day cost, latency, and quality.

For a model like GPT 5.6, the difference between low, medium, and high can feel like you're using different models entirely. It's a genuinely impactful difference. However, don't over-optimize your setup by constantly tweaking effort levels per task.

Instead, pick one setting and stick with it. The author uses **Claude Opus 4.8 with medium effort** and doesn't change it task by task. The reasoning is simple: consistency matters more than optimization.

When you change and tune your model and its effort level, you're modifying one part of your system. But when you change the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) and [environment](https://www.aihero.dev/ai-coding-dictionary/environment), you can swap out models and improve the entire system. By staying model agnostic and keeping your effort level consistent, you preserve flexibility.

This is a subjective take - different approaches work for different workflows. You can share your own experiences and discuss which models work best for you in the [Discord](https://aihero.dev/discord). The key is making a deliberate choice and measuring the results rather than constantly adjusting knobs.

### What to Consider When Choosing Effort

When deciding on an effort level, you need to balance multiple factors:

| Factor | Low Effort | Medium Effort | High Effort | Max Effort |
|--------|-----------|---------------|-------------|------------|
| **Cost** | Cheapest | Moderate | Higher | Most expensive |
| **Speed** | Fastest | Fast | Slower | Slowest |
| **Quality** | Basic | Good | Better | Marginally better |
| **Dumb zone risk** | Lowest | Low | Higher | Highest |
| **Best for** | Mechanical edits, simple tasks | Everyday work | Genuinely hard problems | Benchmarking only |

The sweet spot for most work is medium effort. It provides a good balance of cost, speed, and quality without burning through your token budget unnecessarily.

## Final Recommendations

The effort setting dramatically changes both the cost and quality of the model you're using. Before settling on an approach:

- **Check the benchmarks** - Look at performance graphs for the models you use on sites like [DeepSWE](https://deepswe.datacurve.ai/). They show token spend ratios and differences between low, medium, and high.
- **Remember benchmarks are flawed** - The work you do day-to-day is probably very different from what benchmarks test. The only way to know what works for you is to try different effort levels in your actual workflow.
- **Avoid constant min-maxing** - Pick a model and effort level that feels right, and stick with it. The time you spend tuning is time you're not shipping.
- **Be consistent** - A stable, predictable setup beats endlessly optimized one-offs.

The goal is to make an informed choice and move forward, not to find the perfect setting. Your setup should serve your workflow, not constrain it.

<Quiz>
  <QuizQuestion data={{
    id: "effort-pick-one-and-stick",
    question: "You sit down to a normal day of feature work and open the effort menu. What do you pick?",
    type: "multiple-choice",
    choices: [
      { answer: "medium", label: "Medium, and leave it there for the next task too" },
      { answer: "max", label: "Max, because this feature matters more than the last one" },
      { answer: "per-task", label: "Whichever fits each task, changed as the work changes" },
      { answer: "low", label: "Low, and raise it only once the output looks wrong" }
    ],
    correct: "medium",
    answer: "Medium is the sweet spot for everyday work, and the point of picking it is that you stop moving it - consistency beats optimisation, and time spent tuning is time not shipping. Max is a benchmarking setting rather than a working one. Tuning per task, or ratcheting up from low each time something fails, is the constant min-maxing that costs you more time than it ever wins back."
  }} />
  <QuizQuestion data={{
    id: "effort-spends-token-budget-not-just-money",
    question: "Raising the effort level costs you more money. What else does it cost?",
    type: "multiple-choice",
    choices: [
      { answer: "budget", label: "Token budget, so you reach the dumb zone sooner" },
      { answer: "quality", label: "Quality, since the extra reasoning confuses the model" },
      { answer: "tools", label: "Tool calls, since reasoning tokens are produced instead" },
      { answer: "nothing", label: "Nothing else, since the token bill is the only cost" }
    ],
    correct: "budget",
    answer: "Effort is a latency trade-off as well as a quality one - more reasoning tokens burn the budget faster and leave less room before the dumb zone. Extra reasoning raises quality rather than lowering it, which is the whole point of chain of thought. Reasoning does not replace tool calls, since text, tool calls and reasoning are three separate kinds of output. And the bill is not the only cost, or the choice would be easy."
  }} />
  <QuizQuestion data={{
    id: "max-effort-is-for-benchmarks",
    question: "Why do model providers ship a max effort level at all?",
    type: "multiple-choice",
    choices: [
      { answer: "benchmarks", label: "To push their benchmark score up a couple of points" },
      { answer: "quality", label: "To give day to day work the best possible output" },
      { answer: "speed", label: "To let heavy users buy a faster answer on hard tasks" },
      { answer: "smart-zone", label: "To keep a long session inside the smart zone for longer" }
    ],
    correct: "benchmarks",
    answer: "Max exists so a provider can squeeze out a couple of percent on a benchmark and rank above a competitor. It is not for day to day work, where the quality gain over high is marginal and the token cost is not. Higher effort is slower, not faster. And spending more tokens on reasoning moves you toward the dumb zone rather than holding you in the smart zone."
  }} />
</Quiz>
