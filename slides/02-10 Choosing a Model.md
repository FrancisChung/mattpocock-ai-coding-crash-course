# Choosing A Model

One of the questions I get asked most often is: what [model](https://www.aihero.dev/ai-coding-dictionary/model) should I use? Does it make sense to swap models for certain situations?

My business partner Joel once observed the way I sigh on stream when chat tells me to use a different model and I have to explain it again. I do get a little bit annoyed by the constant barrage of people saying "try this model, try this model. This new model beats the rest of the models hands down. You have to try it or you're being left behind."

![Twitter conversation about model switching](https://res.cloudinary.com/total-typescript/image/upload/v1784126474/ai-hero-images/bahfbz5sbwsrpuufel1l.png)

## Model, Harness, and Environment

In my mental model, the model is just one part of a larger ecosystem. There's the [harness](https://www.aihero.dev/ai-coding-dictionary/harness) that surrounds it, and then the [environment](https://www.aihero.dev/ai-coding-dictionary/environment) that the harness plus model operates in.

![Diagram showing model, harness, and environment](https://res.cloudinary.com/total-typescript/image/upload/v1784126475/ai-hero-images/mppgqhhchshzkgothgqy.png)

I consider the model to be about 50-50 equal with the harness plus environment. In other words, the model is a very consequential part of the whole operation. If you switch out to a crap model, then you are not going to get anywhere.

But if you have a model that's working very well, then there's often things that you can do in your harness and your environment to improve the outputs that you get from the model.

I do want to talk about how you choose a model in this lesson, but I also want to de-emphasize it as an important consequential thing.

As long as you're using one of the models in the top tier, you will probably be okay.

![Graph showing models in top right corner](https://res.cloudinary.com/total-typescript/image/upload/v1784126476/ai-hero-images/xh0m0f9e408uoy4xtnpa.png)

At the time of recording, I'm currently on Claude Opus 4.8 medium. There is probably some optimization I could do with my model, but first I'm more interested in optimizing my harness and the environment my code runs in.

All the time I see low-hanging fruit that I can grab. And crucially, if I put the effort in to improve the environment and the harness, then that means I can swap out to any model and it should be okay.

I kind of think of the model as an employee in your company, and employees come and go. So if you can invest in your company infrastructure to make sure that any employee who comes in can succeed, then you're going to be in a good spot.

## Efficiency: Cost Per Task

However, with all that said, I do want to give you a mental model so that you can choose the right model in the right situation.

One thing I love about [the DeepSWE benchmark](https://deepswe.datacurve.ai/) is that it has average cost per task at the bottom.

If we go up here to its [output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens) filter you can see that if we choose output tokens then it's quite a different picture. For instance, Gemini 3.5 Flash spends a ton of [tokens](https://www.aihero.dev/ai-coding-dictionary/token) to not achieve very much.

But if we actually look at the cost per token, you can see it's actually relatively cheap and pulls it far back over this side of the picture. So some [model providers](https://www.aihero.dev/ai-coding-dictionary/model-provider) simply charge more per token than others.

Not only that, but for instance, these tokens are presumably billed at API token level, whereas if you purchase a subscription, it is much, much cheaper.

And so you're not only choosing a model, you're also choosing a pricing structure along with it.

So whenever you're doing these comparisons, you need to think about the fact that efficiency is the key. It's not just raw cost in tokens, it's what are you getting for those tokens.

![DeepSWE graph showing models grouped in top right corner](https://res.cloudinary.com/total-typescript/image/upload/v1784126477/ai-hero-images/aetvpuxgpmmuogjtvipl.png)

While this graph is fantastic because we can see everything grouped up towards the top right corner, which is the most efficient, this is still a pretty abstract benchmark that might not correspond to your actual work.

For more on subscription versus API pricing, see [Anthropic's plan comparison](https://support.claude.com/en/articles/11049762-choosing-a-claude-plan).

## Matching Quality to Task Needs

The next thing to say is that different tasks require different levels of quality.

![Graph showing GPT 5.6 SOL effort levels](https://res.cloudinary.com/total-typescript/image/upload/v1784126478/ai-hero-images/zaygpyx8yrxgifr4bro7.png)

For instance, if we look at a model like GPT 5.6 SOL, there might be situations where we only need to use the low [effort](https://www.aihero.dev/ai-coding-dictionary/effort) level. For instance, exploration, research and summarization might only need a low effort level.

Whereas detailed planning or code review it might be tempting to go up to the high effort level that really takes a big old jump. And so there's an element here of picking the right tool for the job.

That could mean using one model for planning for difficult stuff and another model for implementation.

## Assess Models With Your Own Data

Now, throughout this, I've been pointing at this graph as if it's the thing that you should trust here, but really I'm using this as an analogy for your own assessments.

What you need to be doing is watching your own usage, watching the bill like a hawk, and also just getting a sense for a model. Models really are like employees and the only way you can get the best out of your employees is by getting to know them.

And so you will develop your own personal hierarchy of models and effort levels. However, what I would say again is don't spend too much time min-maxing between all of these different choices.

I prefer to pick one I like and then stick with it. And what I find is that the more I work with the same model and the same effort level, the better I get at prompting it.

Later in the course, we will take a look at a more empirical way to assess models. That really is pretty simple, which is you take the same inputs and you set up two different models, or maybe the same model with different effort levels, or even the different harness, let's say, you just get two different setups to perform the same task.

Then you assess which one's better, maybe note that down somewhere, maybe run that experiment a few different times, and you've got some pretty good data. That's going to be better than looking at these graphs because these graphs don't correspond to the actual tasks that your [agents](https://www.aihero.dev/ai-coding-dictionary/agent) are going to be doing in your company every day.

## Key Takeaways on Model Selection

So to sum up then, models are just one part of the overall picture. They are an important part but it's about 50-50.

When you're choosing models, you're not just choosing output tokens or output tokens versus quality, it's also the cost per task.

As you start using a few different models, then you will get a sense for what your favourites are in certain situations. And in my opinion, you should probably stick to one model, one effort level and get to know it really, really well.

Everyone has an opinion about model selection. I would love to hear from you what your opinions are when it comes to this stuff and how you assess different models and different effort levels.

Join the conversation in the [AI Hero Discord](https://aihero.dev/discord).

<Quiz>
  <QuizQuestion data={{
    id: "model-vs-harness-where-to-optimize",
    question: "You are on a top tier model and the output your agent gives you is still not good enough. Where do you spend the next hour?",
    type: "multiple-choice",
    choices: [
      { answer: "harness", label: "On the harness and environment, which any model benefits from" },
      { answer: "swap", label: "On swapping to whichever model tops the newest benchmark" },
      { answer: "effort", label: "On raising the effort level of the model you already run" },
      { answer: "prompt", label: "On rewriting the prompt until this model gets the task right" }
    ],
    correct: "harness",
    answer: "The model is only about half the picture, and work put into the harness and environment survives a model change - like company infrastructure that lets any employee succeed. Swapping to the newest benchmark leader buys very little once you are already in the top tier. Effort tuning and prompt rewriting both improve one setup only, and you lose the gain the moment the model changes."
  }} />
  <QuizQuestion data={{
    id: "model-assessment-run-your-own-comparison",
    question: "A teammate insists a different model is better for your codebase. How do you settle it?",
    type: "multiple-choice",
    choices: [
      { answer: "compare", label: "Give two setups the same task and judge which result is better" },
      { answer: "graph", label: "Read the benchmark graph and take the model nearest the top right" },
      { answer: "cheapest", label: "Take whichever model shows the lowest average cost per task" },
      { answer: "rotate", label: "Switch model every week until one of them starts to feel best" }
    ],
    correct: "compare",
    answer: "Same inputs, two setups, judge the outputs, repeat it a few times - that is real data about your own work. A benchmark graph is abstract and may not correspond to the tasks your agents actually do, which rules out both reading the graph and picking the cheapest point on it. Rotating models weekly is min-maxing, and it stops you getting good at prompting any one of them."
  }} />
  <QuizQuestion data={{
    id: "model-cost-is-efficiency-not-token-price",
    question: "You are comparing two models on cost. What does the raw price per token miss?",
    type: "multiple-choice",
    choices: [
      { answer: "per-task", label: "Cost per task, and whether you pay API or subscription rates" },
      { answer: "context", label: "Context window size, which caps how much one task can hold" },
      { answer: "latency", label: "Time per task, which is the real cost of a slow model" },
      { answer: "effort", label: "Effort level, which is chosen separately from the model" }
    ],
    correct: "per-task",
    answer: "Efficiency is what you get for your tokens, so the question is cost per task, and a subscription makes the same model much cheaper than API rates. A model that burns a lot of cheap tokens can still win. Context window size and effort level are real choices, but neither is hidden inside the token price. Latency matters too, but it is not what the cost per task figure at the bottom of the benchmark is showing you."
  }} />
</Quiz>
