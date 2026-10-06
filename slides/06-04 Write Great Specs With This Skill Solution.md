# Write Great Specs With This Skill Solution

<CommitMap packageManager="npm">
  <Commit id="to-spec-skill">Follow along: the `/to-spec` skill added</Commit>
</CommitMap>

# Write Great Specs With This Skill

We're going to run through the `/grill-me` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) again, where we're going to initialize it and then use dictation to describe what we want to build.

The full [spec](https://www.aihero.dev/ai-coding-dictionary/spec) this [session](https://www.aihero.dev/ai-coding-dictionary/session) produces is on GitHub: [Instructor Analytics Dashboard](https://github.com/ai-hero-dev/ai-coding-crash-course/issues/4). Worth having open alongside this article so you can read the finished document while we build up to it.

## The Initial Prompt

I would like to build an instructor analytics dashboard so that instructors have something to look at when they log into the platform.

Not only that, but we also need to be able to show them crucial information. They need to be able to see:

- How much they're earning on the platform
- Completion rates
- Lesson drop-off points

I'm pretty open to suggestions that you have about anything that we might want to implement here too.

![Dictating the initial prompt for the instructor analytics dashboard](https://res.cloudinary.com/total-typescript/image/upload/v1785749548/ai-hero-images/iymo3oicu8a2fwjfigdu.png)

I'm kind of interested in how this is going to go because we're [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) on a pretty open scope here. Part of the grilling session is going to be figuring out this scope and making sure that we're building the right thing.

## The Explore Phase

It's running a pretty deep explore phase. We've got `Map schema and domain model`, `Map routes, auth, and UI conventions`. So it's going pretty deep here initially.

![Claude running exploration subagents in the background](https://res.cloudinary.com/total-typescript/image/upload/v1785749549/ai-hero-images/dlaaviyt4rbn5lom4oxx.png)

And it's come back with a good chunk of stuff here.

### High-Quality Observations

It's made some observations at the start saying there is no earnings concept in the database - no fee, payout, refund, currency, price history.

How much they're earning is currently only derivable as the amount paid joined through `courses.instructor_id`. That's gross platform sales.

```typescript
// Current reality: earnings = SUM of purchase amounts
SUM(purchases.amount_paid)
  JOIN courses ON purchases.course_id = courses.id
  WHERE courses.instructor_id = ?
```

This is really high quality information, especially about drop-off has almost no data. This is giving us some really good insights as to what is feasible based on our current data model.

This is kind of like the engineer pushing back on the product owner saying, "No, I'm not sure we can do that with our current data model. That's a bigger lift than you think."

![Claude's observations about missing data in the current schema](https://res.cloudinary.com/total-typescript/image/upload/v1785749550/ai-hero-images/hnv7n8c7d11arxwabrse.png)

## Round 1: Answering the Questions

But let's now go through and answer these questions.

I agree with your recommendation that a new route under Instructor Analytics makes sense.

We want to see both a cross-course roll-up and a per-course deep dive.

I like the idea of having an admin see something here, and the admin should probably see all instructors with an instructor picker. That's pretty neat.

Let's say that the platform takes a 20% cut. So let's calculate that with a hard-coded rate constant.

When it comes to completion rates, that's an interesting one. I agree with your take that mean per-student calculated progress is probably the best thing, but I won't be sure about that until we see it in action.

I agree that lesson progress is probably cleaner and less lossy than video watch events.

Yes, I agree that a time range filter makes sense so we can have 30, 90 and all time.

That's the first batch done. That is feeling pretty good.

## Background Exploration

There were a couple of questions in there that I couldn't really tell what the answer would be until I saw it, and that's sometimes the nature of grilling. Sometimes you do need to actually see something there before you can figure it out.

One nice feature of grilling is in the [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) that support it, it can actually background an [agent](https://www.aihero.dev/ai-coding-dictionary/agent). So it can do some exploration in the background while you're continuing chatting, which I really like.

![Background exploration running while answering questions](https://res.cloudinary.com/total-typescript/image/upload/v1785749551/ai-hero-images/lcdgwrkbd8otbefgg486.png)

## Round 2: The "Zoom Out" Technique

We're now on to round two.

I agree that there are buyers and students and they are separate stats. And we should probably also have a leaderboard for the person who's bought the most so that we can reach out and actually contact them and say, offer them further support.

Here's an interesting case. For question number two, I'm actually not quite sure what it's on about, and so I'll show you what that looks like when I ask it for more information.

Duration-weight the progress calculation? I don't know, that's a bit too jargony for me.

I'm not sure what you mean by question two. Could you zoom out a little bit and give me more, maybe a bit simpler version of that question.

"Zoom out" is like the key leading word for the agent there. It's going to give me a bit more context about the question and hopefully I'll be able to answer it at that point.

Let's look now at question three.

I'm actually having a pretty similar feeling with question three, which is, I don't know what a genuinely monotonic funnel is, or I don't know what a real cliff is. You're talking in jargon, please help me out here.

### Implementation Questions

Next, it's asking about grouped SQL or reuse the student helpers in a loop.

This is a really important implementation question and it's doing a good job at explaining it from my level, but if you're not necessarily very experienced with development you might be confused by it and so you might want to ask it to zoom out again.

With number four, I think you should do whatever you feel you need to. It's very hard to anticipate performance questions beforehand, and so we may just want to build the thing that we think is the best effort and then measure performance afterwards.

For number five, yes, use recharts and shadcn's `chart.tsx`. That seems fine.

We want to put the course selector into URL search params, not client state.

I think for these extras let's actually just put all of them in and then we can always pull back later if needed. I think seeing everything on the screen will be helpful as a first pass and then for a V2 we can always pull it back.

That's a really interesting observation, by the way. We are doing a big chunk of work here, but we're not necessarily expecting the end state to be final, right? We're going to continue working on this. And so it makes sense sometimes to just splurge out a bunch of features and then pull them back.

Is that the end of this round? Yes.

### The Restated Questions

It's now restated the questions that we asked it to in plain terms, and this is much better.

How do we turn lessons done into a percentage?

Right, you either count the lessons directly or you weight longer lessons as more in the percentage.

![Claude restating the jargon-heavy questions in plain terms](https://res.cloudinary.com/total-typescript/image/upload/v1785749551/ai-hero-images/iqho4t0pyb0f5wpkqwbl.png)

In my experience, the lessons that are short in duration do not necessarily take less time to complete. You might be sending them off to do external work or sending them off to do an exercise.

So I think the only thing that makes sense is to count just purely by lessons.

Next, Q3 restated: what does each bar in the drop-off chart mean?

It's sort of pointing at a hole inside our drop-off logic, which assumes that students always do every single part of the course.

Let's have a look.

Maybe I just don't like this feature, to be honest.

I guess maybe we need to just sort of see it in action before we can tell.

I think option B is a sensible one for Q3, but I kind of need to see it in action before I know if this feature is even any good. So let's go with option B.

## Round 3: Seed Data and Leaderboards

We're on to round three.

Let's modify the seed data to match what we're actually seeing here so that we can QA it properly.

We still want 30, 90 all time. We may even want the last week as well, which is especially useful for launches.

I agree with your recommendation on 10.

Let's roll this through.

Note how little [context](https://www.aihero.dev/ai-coding-dictionary/context) we're spending on this planning. This is only about 40K here. We've not even had to do that much in terms of talking, I suppose. Like we're just answering the questions as they come with relatively short answers.

![Context usage showing approximately 40K tokens](https://res.cloudinary.com/total-typescript/image/upload/v1785749552/ai-hero-images/tzhnouyhtutk49vwpaxu.png)

It's sending off another [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) here to check the seed coupling to test. That's a really interesting question.

It's asking whether the seed data is coupled to how we're doing our testing, and I'm pretty sure it isn't, but this is something very important to verify.

![Background agent checking seed coupling to tests](https://res.cloudinary.com/total-typescript/image/upload/v1785749553/ai-hero-images/rlk3nnnp01g4oyqrtssn.png)

## Round 4: Final Details

It's saying one page or tabs. I think tabs make sense, but I probably won't know until I see it.

Zooming down, what do we have?

I want you to give your best effort on 12 and then we can critique it afterwards.

I agree that database indexes are important and so let's add them as part of this.

Sure, we can delete the dead include quizzes parameter on `calculateProgress`. That seems cheap and easy.

We do need to build an explicit empty state for a brand new instructor. That's a good catch.

![Claude catching the edge case of a brand new instructor with no data](https://res.cloudinary.com/total-typescript/image/upload/v1785749553/ai-hero-images/nputagb9kujpidvzjljv.png)

That's a really good catch by the way. That is like a classic thing that comes out in grilling is that the agent just thinks of an edge case that you haven't realized yet and just says, what do you want to do in this case and offers you a good recommendation. So nice.

16, yes the extended seed sounds good and that's the right level of scope.

Look at this, this is awesome. It's actually picking up on our testing services skill and it's asking what test coverage we want based on the steering that we've already provided it. Beautiful.

![Claude using the testing-services skill to ask about test coverage](https://res.cloudinary.com/total-typescript/image/upload/v1785749555/ai-hero-images/zxwjsu7rtovdg7jfxumo.png)

A little bit of our steering coming in and now affecting the way that we're grilling. Beautiful, beautiful stuff.

100% agree with your recommendation on test coverage.

OK, zooming down, zooming down. OK, that's it for round four. Lovely.

It looks like after this, the frontier is empty.

## Reaching Shared Understanding

We are reaching the state where we have a [shared understanding](https://www.aihero.dev/ai-coding-dictionary/design-concept) with the agent. I feel pretty confident about what we're building. I'm expecting a pretty big analytics page, a big chunk of new seed data, maybe tabs I think, and lots of new queries and quite a lot of new code I think.

![Frontier empty, reaching shared understanding with the agent](https://res.cloudinary.com/total-typescript/image/upload/v1785749556/ai-hero-images/ghzadkfz67oosfpqa3x7.png)

It's given us a very small kind of like output here of the information and so it's time to say `/to-spec`.

And all I'm going to do is just go forward slash `to-spec` here and it should just handle the rest.

![Typing the /to-spec command](https://res.cloudinary.com/total-typescript/image/upload/v1785749557/ai-hero-images/rfacv9r1pq6y3yf8ndod.png)

You just missed it there, but it immediately went off and read the information on how to issue the spec and where to put it and which issue tracker to use.

## The Test Seam Checkpoint

And it says before I write and publish the spec, once the test seams agreed.

Testing is a really important part of building anything, and so in the `/to-spec` skill, I have a little checkpoint here where it asks the user, where do you want your tests built? At which seam in the application?

![The test seam checkpoint in the /to-spec skill](https://res.cloudinary.com/total-typescript/image/upload/v1785749557/ai-hero-images/ngksywzpdmlw6ec0g58s.png)

This concept of test seams comes from _Working Effectively with Legacy Code_ by Michael Feathers. I do have the book, so I would do the traditional book wave, but I can't find it.

In this case, it's a very simple decision because we just have this proposed seams one here. So there's only one testing seam, which is we're testing the services themselves.

It says that only works if the root loader is a genuinely thin pass-through. And so what it's doing is it's designing around this constraint to make sure that we're using the existing test seams.

So let's zoom down here. Confirm the single-seam approach. Yes, it looks good.

![Confirming the single-seam testing approach](https://res.cloudinary.com/total-typescript/image/upload/v1785749559/ai-hero-images/gs5rtktmapfdlpvuegio.png)

So with that, it should have all the information it needs to go and write the spec.

## Walking Through The Spec

And we have our spec.

![The completed spec as a GitHub issue](https://res.cloudinary.com/total-typescript/image/upload/v1785749560/ai-hero-images/pykooud554jujaxrnb40.png)

Let's now walk through and just look at each individual section.

### The Why: Problem and Solution

One really important part of a spec is not just to tackle the what, but also tackle the why. If the agent has the why, then even if there's a point at which it has to make a tie-breaking decision about like, what should we be doing in this specific situation, this isn't on the spec, then because it's got the why, it can make an informed decision about the purpose of the thing it's building and hopefully get towards the solution better.

This why is in the problem statement and in the solution.

So the problem statement: instructors have no idea how they are doing. When an instructor logs in, they land on the marketing homepage and the only thing built for them is a list of their courses and a per course student roster.

![Reading the problem statement from the spec](https://res.cloudinary.com/total-typescript/image/upload/v1785749561/ai-hero-images/ynypqrc3s6jydghane0j.png)

And so the solution is a dedicated instructor analytics page reachable from the sidebar that gives instructor one screen answering "how is my teaching business doing."

### User Stories

Then we have a bunch of user stories here, a lot of them, so 49 of them.

Many of them are as an instructor, and then we've also got a few more as an admin, as a student, as a developer.

If you've never seen a user story before, this is what they look like. They say, as a role, I want something to happen so that something, something.

For instance:

> As an instructor with a course but no sales yet, I want each empty panel to explain itself, so that I can tell nothing has happened yet from this feature has broken.

That's the why.

![Example user story showing the as/I want/so that structure](https://res.cloudinary.com/total-typescript/image/upload/v1785749563/ai-hero-images/vkq4rawumdk2gny6e2vw.png)

The number of the user stories is weirdly important because then it can go and reference the number and say, OK, this fixes user story 35, this fixes user story 37, etc.

### Implementation Decisions

Then we go to implementation decisions. So this is some of the implementation decisions that need to be done in the spec.

There's an open question as to how many of these you should include. What I like to do is I like to imagine that these specs are going to be sitting around for a while before they're approved. The idea is you would pass this off to your team to say, okay, this is what I'm planning to build, this is how I'm planning to do it.

And so it doesn't necessarily reference like individual files, let's say. It's mostly saying, okay, these are the specifics of how we're implementing it.

For instance, it's got like types inside here, so `analytics_range`, and there are also some testing decisions here.

![Implementation decisions section showing types and approaches](https://res.cloudinary.com/total-typescript/image/upload/v1785749565/ai-hero-images/fophmixgrlo0vohnv536.png)

### Testing Strategy

We explicitly say what makes a good test, we say the testing seams, and we say the module's tested, the analytics service only.

![Testing strategy section of the spec](https://res.cloudinary.com/total-typescript/image/upload/v1785749566/ai-hero-images/qizglgswhxhnuzkkovth.png)

It also looks at the cases that must be covered and there's also a decently sized out of scope section.

The further notes stuff is nice.

We're even noting in here two designs the developer expects to critique. The two tabs split, and the final visual both accepted, with the explicit caveat they cannot be judged until they can be seen. Build the best version, expect iteration, do not treat either as settled.

![Further notes section mentioning designs to critique](https://res.cloudinary.com/total-typescript/image/upload/v1785749567/ai-hero-images/ob4pie4oh9o5lq41nunu.png)

## Why I Don't Read My Own Specs

You'll notice this has not really drifted at all from our conversation. And because of that, I rarely actually go and read these specs myself.

If I were to read the spec, what would I actually be testing for? I'd just be testing the agent's ability to summarize what we just talked about. And that's something that I kind of take on trust.

Overall, I'm super happy with this spec. This is a really great destination that we can then test against once we have our implemented code.

And hopefully the process of grilling and then running `/to-spec` made sense and especially the decision about the test seam as well.

Nice work, and I will see you in the next one.

