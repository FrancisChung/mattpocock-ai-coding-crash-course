# How Much Did It Cost?

Understanding how you get billed for the work that [agents](https://www.aihero.dev/ai-coding-dictionary/agent) do is very important, and it's a lot harder than you might think. The cost is spread out over [sessions](https://www.aihero.dev/ai-coding-dictionary/session), [turns](https://www.aihero.dev/ai-coding-dictionary/turn), and [model provider requests](https://www.aihero.dev/ai-coding-dictionary/model-provider-request).

The usual experience of paying for agent work is watching your bill climb higher and higher without being able to attribute it to anything specific. You can see your bill climbing, but you're not quite sure what the optimization surface is. How do you improve it? How do you get things cheaper, or fix the bad habits that are causing sessions to become expensive?

## The numbers do exist

Well, the numbers that explain it do exist. The provider returns them on every model provider request.

Every time you send a model provider request during a turn, you are sending [input tokens](https://www.aihero.dev/ai-coding-dictionary/input-tokens), and then you are getting back [output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens) from the response.

- **Input tokens** are what you send: the current state of the repo, the current state of what the agent knows in the [environment](https://www.aihero.dev/ai-coding-dictionary/environment)
- **Output tokens** are what the agent produces

And output tokens are billed at a much higher rate than input tokens.

![Claude API pricing page showing input tokens at $10 per million and output tokens at $50 per million](https://res.cloudinary.com/total-typescript/image/upload/v1785244793/ai-hero-images/jeogsbavdgjtc9l5eeqb.png)

### Pricing comparison

For instance, if we look at [Claude Haiku 4 on the API rates](https://platform.claude.com/docs/en/about-claude/pricing), we can see that input tokens are $10 per million tokens sent, whereas output tokens are five times that - they're $50 per million tokens.

Input tokens are usually by far the larger number. The request output is often just a few hundred tokens, either producing a [tool call](https://www.aihero.dev/ai-coding-dictionary/tool-call) or replying to something you just sent it, whereas the input is the entire session so far.

Every single model provider request you're building up state, which is then going into input tokens, whereas the output tokens stay relatively static.

## Exploring the request logger

To take a look at this, we can examine the request logger. Start it, then copy and paste the command it prints into a new terminal to start an agent through it.

We'll send a simple message and then go into the logs to look at the first request that comes back.

If we go all the way down to the response tag, we can see a usage output with some really interesting numbers. We can see that there were only two input tokens used and the output tokens were 14.

![Request logger showing usage statistics with input tokens, output tokens, and cache token counts](https://res.cloudinary.com/total-typescript/image/upload/v1785244794/ai-hero-images/tkk1rqmz2u4qrsexhtok.png)

So it came back with its typical "hello, what can I help you with today?" message. The interesting question is: why were the input tokens only two here? Because we know that it sends the full [system prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt) along with it.

Well, we can see that we have `cache_creation_input_tokens` and then `cache_read_input_tokens`. In other words, some of these input tokens were cached in the [prefix cache](https://www.aihero.dev/ai-coding-dictionary/prefix-cache).

![Request logger showing cache_creation_input_tokens and cache_read_input_tokens fields](https://res.cloudinary.com/total-typescript/image/upload/v1785244795/ai-hero-images/o740h2dnzjvvv8jm8gnq.png)

## How the prefix cache works

Most [providers](https://www.aihero.dev/ai-coding-dictionary/model-provider) keep a prefix cache. When a request begins with the same set of tokens as a recent request, then the provider reuses the work that it did on that stretch and bills it as [cached input tokens](https://www.aihero.dev/ai-coding-dictionary/cache-tokens) instead.

If we go back to the pricing page, we can see that cache hits and refreshes are billed at 10 times lower than base input tokens.

However, what we did wasn't a cache read - it was a cache write. The logs show `cache_creation_input_tokens: 22214`. In other words, we have now created the cache, which we're then going to hit on the subsequent request.

## Warming up the cache

Let's go into our agent again and send another message. Then if we look at the log that it creates, we can see in the response it pulled in 504 input tokens, created a cache output of 59, but then read 22,000.

In other words, now we have warmed up the cache and we are now hitting the cache. So in effect, we were only billed for around 500, maybe approaching 600 input tokens here, plus the 46 output tokens that were produced.

![Request logger showing second request with majority of tokens from cache_read_input_tokens](https://res.cloudinary.com/total-typescript/image/upload/v1785244796/ai-hero-images/j2ex7ctahoswcajbhadp.png)

We can see there are output tokens but there are also thinking tokens, which are billed the same as output tokens since they're essentially the same.

This means that subsequent requests do get cheaper because your input tokens write to a cache, which are then cached as input tokens, and these cached input tokens are billed significantly lower.

## Sessions and the cache

This is, of course, suited to the way that sessions work because they grow by appending. Every request is the previous request with just a bit more at the end.

That's why you notice that the request is designed in the way that it is - it has the stuff that rarely changes at the start of the request and stuff that does change more often further down, often actually delivered inside user messages.

## The complexity of session billing

That's why figuring out the billing for a session is so complicated, because there are so many variables here.

Sure, you've written to the cache in the first model provider request, but then you've mostly read from the cache on the second. But maybe on the third, you've produced lots of output tokens, which are very expensive.

Maybe you took an hour's break between turn 2 and turn 3, and so the cache was totally exhausted - it had timed out by that point.

## Context management matters

Now most of this, of course, is the harness's concern. It's the [harness](https://www.aihero.dev/ai-coding-dictionary/harness)'s job to make sure that information is organized in the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) so that you get the best out of your cache.

But one thing I want you to notice here is that every input token you provide to the agent gets re-added into the session every single request. In other words, it's very easy to build up sediments in this very first model provider request that then gets taken through and is continually built every single model provider request.

This means that keeping [context](https://www.aihero.dev/ai-coding-dictionary/context) small and keeping context relevant is not only good for the agent, but it's also good for your wallet.

And helping you navigate the difference between input tokens, cached input tokens and output tokens will hopefully help this whole thing feel a bit less opaque.


<Quiz>
  <QuizQuestion data={{
    id: "prefix-cache-billing-discount",
    question: "The provider reuses a stretch of your request from its prefix cache. How is that stretch billed?",
    type: "multiple-choice",
    choices: [
      { answer: "ten-lower", label: "At ten times lower than base input tokens" },
      { answer: "ten-higher", label: "At ten times higher than base input tokens" },
      { answer: "same-input", label: "At exactly the same rate as base input tokens" },
      { answer: "free", label: "Not at all, since the work was already done once" }
    ],
    correct: "ten-lower",
    answer: "Cache hits and refreshes are billed ten times lower than base input tokens. They are not free - a cache read still shows up on the bill as cache_read_input_tokens - and they are cheaper than base input tokens rather than the same rate, and certainly not more expensive."
  }} />
  <QuizQuestion data={{
    id: "cache-timeout-between-turns",
    question: "You send a message, take an hour's break, then send another. The second message bills far more input tokens than the messages before the break. What happened?",
    type: "multiple-choice",
    choices: [
      { answer: "cache-expired", label: "The prefix cache timed out, so nothing could be read from it" },
      { answer: "restart", label: "The session restarted, so the system prompt was sent a second time" },
      { answer: "dumb-zone", label: "The break pushed the session into the dumb zone, forcing a retry" },
      { answer: "thinking", label: "The thinking tokens from the last turn were re-billed as input" }
    ],
    correct: "cache-expired",
    answer: "A long enough gap exhausts the prefix cache, so the whole prefix is charged at the base input rate again. The session did not restart - it keeps appending, which is why the prefix matched at all before the break. The dumb zone describes the quality of the output rather than the bill, and thinking tokens are billed the same as output tokens, not as input."
  }} />
  <QuizQuestion data={{
    id: "context-size-is-a-billing-lever",
    question: "Why does keeping the context small save you money, rather than only improving what the agent produces?",
    type: "multiple-choice",
    choices: [
      { answer: "resent", label: "Every input token is re-sent on every model provider request" },
      { answer: "output-rate", label: "Output tokens are charged at a lower rate in shorter sessions" },
      { answer: "skip-cache", label: "A small context skips the prefix cache and its write cost" },
      { answer: "fewer-turns", label: "A small context makes the harness send fewer turns per session" }
    ],
    correct: "resent",
    answer: "A session grows by appending, so a token added in the first request is sent again on every request after it - sediment there is paid for many times over. Output tokens are billed at one rate whatever the session length, the prefix cache is a saving you want rather than a cost to avoid, and the number of turns is set by the work rather than by the size of the context."
  }} />
</Quiz>
