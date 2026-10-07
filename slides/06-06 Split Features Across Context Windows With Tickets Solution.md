# Split Features Across Context Windows With Tickets Solution

<CommitMap packageManager="npm">
  <Commit id="to-tickets-skill">Follow along: the `/to-tickets` skill added</Commit>
</CommitMap>

You've [grilled](https://www.aihero.dev/ai-coding-dictionary/grilling) the feature, you've turned it into a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) - now you need to break it down into [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket).

Let's run `/to-tickets` and see what happens.

![Running the /to-tickets command in Claude Code](https://res.cloudinary.com/total-typescript/image/upload/v1785750366/ai-hero-images/fzv8dcovlrfmlztghwos.png)

## The first proposal: 10 tickets

It comes back pretty fast and gives us 10 tickets.

10 tickets feels way too much for this. If you think of the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) as 150,000 [tokens](https://www.aihero.dev/ai-coding-dictionary/token), then this would mean we are budgeting 1.5 million tokens for this feature.

That feels like way too much to me. I'm picturing that maximum we would need 450k. So let's say three tickets.

The way I'm able to make that judgment call is just a gut feeling really, just having done a lot of this, a lot of looking at these proposed ticket breakdowns and seeing what comes out.

450k even feels generous. I think this could probably even be done in two [sessions](https://www.aihero.dev/ai-coding-dictionary/session), but I don't want to push it.

![Claude's initial 10-ticket breakdown showing horizontal slicing](https://res.cloudinary.com/total-typescript/image/upload/v1785750367/ai-hero-images/b4n4acgnk6xljddnwfde.png)

## Horizontal slicing is still a problem

What we can see here too is doing classic horizontal slicing as well, which is frustrating because I'm really trying inside the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) to not get it to do this, but it still just persistently does it.

This is why I feel a human looking at this is so important, by the way.

I think 10 is not a good candidate, I'm just going to say:

```
I would like to break this down into maximum three tickets.
I think ten feels way too much.
```

Let's give this a go.

## Three tickets, but Claude pushes back

Okay, it's now given me three pretty large pieces of work here and it's actually saying:

> One trade I want to be explicit about: tickets two and three are larger than a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window).

![Claude's warning about tickets exceeding context window size](https://res.cloudinary.com/total-typescript/image/upload/v1785750368/ai-hero-images/bwajkdz4qmcnb7hymrml.png)

So it's saying that it's pretty scared about this overview tab. Okay. Maybe we'll pull it to like five or something.

What I can see though is that these three are pretty good vertical slices. There is some groundwork that's being done here. There's some stuff that's kind of being included in this PR that probably could be elsewhere. So there's indexes, the seed rewrite, and the dead parameter prefactor.

Prefactor by the way if you've never heard of this - this is just a refactor before you do some work.

This will burn a lot of tokens because we're just like plowing in a bunch of seed data, and so just like lots of [output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens) will be produced during this. And so I guess it makes sense to have it before we do any of the other vertical slices.

But the other ones, because they're now grouping a ton of work together, they are by definition vertical because they're like building out throughout an entire feature.

So let's see if it retains the vertical slices when we go to five:

```
Could we have five tickets instead of three?
```

## Five tickets: the sweet spot

Okay, so the groundwork is looking the same here and then it starts then with a page shell. That's a good classic vertical slice. I really like that.

It then goes on and adds some extra overview panels, then the course detail selector, progress and drop-off funnel and course detail extras. Okay.

It's even explicitly saying here:

> Every ticket lands as something you can look at

![Claude's message stating every ticket lands as something you can look at](https://res.cloudinary.com/total-typescript/image/upload/v1785750368/ai-hero-images/yb646ltvz7xlz79fgg5f.png)

## Blocking relationships and parallel work

It also, by the way, does this clever thing where it has blocking relationships here.

So technically we can do these in parallel if we wanted to. For instance, in the overview panels, like two, we've got the page shell, and then three is blocked by two and four is blocked by two.

So this means we could work on one and two and then split up to do three and four in separate context windows if we wanted to.

![Dependency graph showing tickets 3 and 4 both blocked by ticket 2](https://res.cloudinary.com/total-typescript/image/upload/v1785750370/ai-hero-images/sttnynjuwkqxqbe9rkib.png)

That's entirely optional, you don't have to do that, but it is a little bit quicker if you can make that work. And this means that we can scale this [skill](https://www.aihero.dev/ai-coding-dictionary/skill) up to actually fanning out, producing multiple pieces of work and merging them back together.

So, okay, I'm pretty happy with this. Let's publish them to the tracker.

## The published tickets

Okie doke, here we go. We have our [Instructor Analytics Dashboard](https://github.com/ai-hero-dev/ai-coding-crash-course/issues/4) and it now has five sub-issues underneath it.

![GitHub issues page showing the parent issue #4 with five sub-issues](https://res.cloudinary.com/total-typescript/image/upload/v1785750371/ai-hero-images/se8fkn0dgceufagulqds.png)

So we've got our spec and we have the first one that's unblocked, which is the groundwork.

We get an explicit link to the parent, and then we get what to build and the acceptance criteria.

Notice this ticket is pretty light here because we have the parent spec to rely on. All we're doing is really specifying which bit of the spec we're building now.

![Ticket #5 showing parent link and acceptance criteria](https://res.cloudinary.com/total-typescript/image/upload/v1785750371/ai-hero-images/yhhanzipoqbleo1hhehr.png)

And having this explicit acceptance criteria is really nice for giving it a point where it can stop.

## Review the tickets lightly

What I recommend you do is read through some of these. Again, I don't recommend actually reviewing each of these because they're just summaries of the things that we've decided already.

These tickets are relatively light, they're just splitting up the spec so that we can go and work on it.

## Share your experience

I would love to hear from you how your experience went.

- Did you create the same number of tickets as I did?
- Did you spot vertical slices?
- Did you get any weird horizontal slicing stuff?

Do ping in the [Discord](https://aihero.dev/discord) to join the conversation.

So we have our set of tickets. Nice work, and I will see you in the next one.
