# Executing Your Tickets Solution

<CommitMap packageManager="npm">
  <Commit id="implement-skill">Start the lesson: the `/implement`, `/tdd` and `/code-review` skills added</Commit>
  <Commit id="analytics-groundwork">After run 1: indexes, the seed rewrite and the progress prefactor</Commit>
  <Commit id="analytics-page">After run 2: the revenue overview, chart and range control</Commit>
  <Commit id="analytics-audience">After run 3: buyers, the leaderboard, questions and ratings</Commit>
  <Commit id="analytics-course-detail">After run 4: course progress, finished count and the drop-off funnel</Commit>
  <Commit id="analytics-quiz-and-geography">After run 5: quiz pass rates and revenue by country</Commit>
</CommitMap>

Alright, let's do it. Let's send off `/implement` with just the first issue.

## Run 1 - The groundwork ticket

![Claude Code exploring the codebase after reading issue #5](https://res.cloudinary.com/total-typescript/image/upload/v1785751277/ai-hero-images/rtxjtwcmd476562lndca.png)

We can see it's read the issue. It's now exploring the code base. And it's not using a [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) for this, interestingly. It's just going straight ahead.

And then bam, we are in with the first update. So it's updating `includeQuizzes`. It is doing the stuff described in the first issue it looks like.

### Auto Mode

One thing, by the way, that's really very important for these situations is [Auto Mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode), which is the ability to just run it and have a classifier just checking the [permission requests](https://www.aihero.dev/ai-coding-dictionary/permission-request).

So I can probably leave this for a bit and come back and the implementation for the first phase should be finished as well as hopefully the review.

This is a Claude Code-only feature, though I'm fairly sure that other [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) also will implement their own version of Auto Mode.

### The seed script

![Terminal output showing the seed script creating database entries](https://res.cloudinary.com/total-typescript/image/upload/v1785751279/ai-hero-images/euxcw7spix4dymf1ehha.png)

It's gone through and added a bunch of stuff to the seed script. It's also run a database migration. It looks like it's done all of that according to the stuff that's in the local [skill](https://www.aihero.dev/ai-coding-dictionary/skill) too, which is nice.

![Token counter showing 95k tokens used](https://res.cloudinary.com/total-typescript/image/upload/v1785751280/ai-hero-images/tspctub63eztzfxgrv3p.png)

Now up to 95k, still going on this seed script.

It looks like running the seed script itself produced some errors. Here we go. No seeded students with that email.

And so now it's going ahead and fixing them, which is nice.

### Verification loops

These kind of verification loops can absolutely eat [tokens](https://www.aihero.dev/ai-coding-dictionary/token), which is part of the reason why we're so careful with making sure the tasks are the right size.

If it hits any trouble with the implementation or it's something isn't behaving how it wants, then it can burn tokens trying to get where it needs to.

It's now doing some final verification. So it is doing the tests and the [type checking](https://www.aihero.dev/ai-coding-dictionary/automated-check). And now it's gone over to run the code review.

### The review process

![Code review skill being invoked with two sub-agents](https://res.cloudinary.com/total-typescript/image/upload/v1785751281/ai-hero-images/ozjn52ahhewvmllbo7yf.png)

A code review is a model-invokable skill, so it's able to just chain them together without asking you. And we can see it's initialized two [agents](https://www.aihero.dev/ai-coding-dictionary/agent) here. So it's initialized the standards review and the spec review.

Both of these are going to come back with a report that we can then take a look at to see if we want to change anything about the way it was implemented.

This is really great because we basically reset our smart zones. So with the sub-agents, because they're working in their own [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), we don't need to worry about the fact they're going to be made dumb by this $113k token [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) that we've got.

These two agents have now finished the standards review and the spec review and it has had four things come back and it's immediately gone and fixed them.

![List of four findings from the code review](https://res.cloudinary.com/total-typescript/image/upload/v1785751283/ai-hero-images/ajkfmvnvylsb1cmp44bh.png)

It looks like it found some duplicated code, it looked at some inaccurate percentages in a comment, there's some remaining hard-coded intermediate logs, and a misleading variable name.

So I didn't have to confirm that, it just went ahead and made those updates.

And if we zoom down to the bottom and zoom out a touch as well, then we end up with about 125k tokens used and it's got a summary of what landed.

### Deciding how to continue

So at this point, we need to decide how to continue. We could potentially do QA on this commit and on this issue right now, but I think I want to save my QA until right at the end.

So what I'm going to do is I'm going to open up this issue and as I'm going to immediately close it, which should then open up this issue to be worked on. So now it's number six.

I'm going to copy the link address and then we're going to implement this issue next.

### Clearing the context

The next question is what do we do with our context window? It's currently at 125k. I would usually just straight up [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) this context window.

The reason for that is that we have a really rich amount of [context](https://www.aihero.dev/ai-coding-dictionary/context) outside of the context window. We have the [spec](https://www.aihero.dev/ai-coding-dictionary/spec). We have the next [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket). We even have the previous ticket if it wanted to look at the intention of what was supposed to be done. And we have the commit in the commit history that it can read to see what was done.

So I'm feeling pretty positive that we can just clear the context and, you know, instantly done and we're able to implement the next issue.

## Run 2 - The page shell

![Issue #6 being fetched by the agent](https://res.cloudinary.com/total-typescript/image/upload/v1785751284/ai-hero-images/ueuyeonl8ffh3ckh1qcv.png)

So let's crack this off and let's see what it does.

There we go, issue six depends on five, which the latest commit appears to have landed. And it's now going to re-explore the code base structure.

This, by the way is where all of those [navigation pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer) that we've laid in pay off. Having a repo that's easy to explore means that it spends fewer tokens finding the information it needs which means that clearing is more possible which means you can move a bit faster.

### Identifying the seams

![Agent stating the seams under test](https://res.cloudinary.com/total-typescript/image/upload/v1785751285/ai-hero-images/yy7pbf4zm3zjcugj9yve.png)

It's nice here that it says it's specifically saying the seams under test are X, Y and Y. No tests against route or component internals. All arithmetic and range resolution live behind that boundary. Very cool.

### The red-green loop

![Test-driven development loop in action](https://res.cloudinary.com/total-typescript/image/upload/v1785751286/ai-hero-images/rn96pzxdrxak3iduvedp.png)

We can see that the red green loop is starting to kick off now so it's creating a minimal set of tests here in the analytics service. It creates a few more tests here and then it's going to once it's got the test harness in actually create the minimal implementation.

So now it's doing the green step here where it's actually creating the code and then the tests are going to go green. So we can see it ran the one shell command here if we look inside here then we can see that that individual test file is now passing.

This is a fast loop as well. This runs in under a second and it means that it can get very quick feedback on the code that it's working on.

It looks like its implementation is mostly done. 106k tokens, pretty good. And now we're into code review. So standards and spec review again.

### Reviewing the changes

![VS Code source control showing changed files](https://res.cloudinary.com/total-typescript/image/upload/v1785751287/ai-hero-images/olmihr9fjuharke7odcy.png)

In VS Code, we can look through the changed files by just looking at the source control tab here. And there's a bunch of stuff in here. We've got tests for the analytics service, tests for the analytics themselves.

It looks like some, we've got some pure functions in here, functions that don't emit like strange effects or anything. So those are good candidates for tests.

And then we've also got tests around the service itself. So we got the analytics service and then the `analyticsService.test.ts` that tests all of that stuff. And this test file is fairly large, about 400 lines.

One cool thing about the review is not only is it reviewing the code, it's also reviewing the tests that test the code. So it's going to test or check for edge cases that you haven't considered, things in the spec that should be tested that aren't being tested.

### Working while the agent cooks

By the way, while these long implementation [sessions](https://www.aihero.dev/ai-coding-dictionary/session) are happening, I'm usually off planning something else and kind of trying to make myself useful somewhere else in the code base, perhaps on a different branch or in a different work tree.

There's no real reason to sit around while the agent cooks here. You know, this is currently five, six minutes. And what the cool thing about this loop is that it's really minimal input from you. You just say, okay, do the next one now.

### The tautological test

Okay, it found some findings here. So it looks like it needs to delete some tests, I think. Ah, here we go. This is a classic tautological test.

![Code showing a test that just checks a constant equals itself](https://res.cloudinary.com/total-typescript/image/upload/v1785751289/ai-hero-images/eho0xzgezarxon4y9pfd.png)

It's literally just testing that a constant here called `platformFeeRate` is this value. Well, that's just configuration. You don't need to test that.

```ts
it("takes a fifth of gross as the platform fee", () => {
  expect(PLATFORM_FEE_RATE).toBe(0.2);
});
```

Looks like there were a fair few fixes, and it looks like this context window is just under the smart zone, so done a pretty good job nailing these estimates.

### Verification methods

It's doing some more verification and it looks like it's trying to run the actual live page. Having a look at it and trying to find the stuff in the UI on the page, which is an interesting verification process.

The feedback loops that your agent uses to get information are super important and so designing your code base so that you can produce better feedback loops and get the agent better output is so so important.

We're doing a pretty good job with our type checking and our tests because type checking is sort of checking the correctness of the code, tests is checking how it performs at runtime.

But we don't really have a way for it to verify a running application. For that, you could use something like the Chrome DevTools [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) server or similar. It can take photos of things. There's even agent-browser as well. That's a good one.

### Judgement calls

Okay, so it looks like we're up to 137k tokens, very nice. We've got 401 tests, so 32 new tests, and we've got some judgment calls to make too.

There's a kind of scoping error here. So it says that the course detail tab has real content. It looks like it actually went ahead and implemented something it wasn't supposed to but that's it says it's fine because it's easy to strip back.

It went ahead and adjusted something to basically add a gross and net instead of just gross. I mean, that's fine, I suppose.

Mostly, we don't have to worry about these too much. I'm going to do a final QA when everything lands.

## Run 3 - Compacting vs clearing

Just for variety let's actually run [compact](https://www.aihero.dev/ai-coding-dictionary/compaction) this time instead of clear. I'm going to run compact to run the next phase here and this is going to compact the conversation and we'll see if this makes any difference in terms of how much exploration it does.

![Copying the link address for issue #7](https://res.cloudinary.com/total-typescript/image/upload/v1785751290/ai-hero-images/jdwbzpkpbz9cjl6dui7f.png)

I'm going to close the next issue here, number six, close it like that, and then the next two are open here. So I'll grab this one by copying the link address.

Now I can go back into my conversation, I can say implement and then implement this ticket. And this will then be queued up for when the compaction ends.

### The cost of compacting

To tell you the truth, I mostly use just clear after each conversation, so I'm intrigued to see if compact speeds things up a little bit, gives it a little bit more context, or whether it's just not needed.

It's certainly slower, of course. We are paying in [output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens) to produce a summary of the previous conversation. I sort of wish it showed you exactly how many output tokens it was spending because it has to be a fair chunk.

![Compacted summary showing restored files](https://res.cloudinary.com/total-typescript/image/upload/v1785751292/ai-hero-images/vaoayldqdtepaet1madc.png)

We can see it's compacted and it kept some tests here, which I assume are needed for the next... It's kept quite a few files. It's restored the skill code review, so I understand we might need that too.

It's fetched the issue and it's still just continuing to explore. So it's doing, obviously it still needs to explore more than what it has. And I suppose the question is, is the compacted summary actually relevant to what it's doing? Not sure.

It is absolutely roasting here, so I've taken off my flannel shirt. Apologies.

### The hard violation

![Code review showing hard violation found by both axes](https://res.cloudinary.com/total-typescript/image/upload/v1785751293/ai-hero-images/lkxiawqqikrmranckhqu.png)

We now have another implementation complete, the review has been completed, both axes independently flagged the same hard violation, question count filters rows in the route. That sounds like instead of filtering on the server, they were piling them all into the client and it was doing client-side filtering. That's really bad.

The reason it's bad is that lots of material is traveling over the network just to be filtered away in the browser. That's super wasteful.

All right, this was a long one. This was 17 minutes 30 to build that ticket. We reached 140K tokens.

The spec axis caught a real gap, never enrolled was suppressed for team buyers.

You notice how far the implementation agent can actually deviate from the spec. And so having a review step does a pretty good job in catching those.

### Back to clearing

So let's now close number seven. Let's now head to eight, copy the link address and plug it in.

I don't think compacting really gave us anything, so I'm just going to clear, it's much faster, it's much cheaper, and we're just going to say implement eight.

The rule of thumb is if you have a if it's 50/50 between clear and compact then you should choose clear because it's cheaper and faster.

## Run 4 - The drop-off funnel

We're at the spec review for this chunk of work and we're at 77.5k tokens. Geez, okay, it's doing a really thorough job here.

Okay, it looks like it's committed again. We get another implemented, reviewed and committed summary. We've got our service, we've got our routes, got our tests.

144k tokens. These are creeping up. I'm going to clear the context.

I'm going to close the issue that we just did here, open up the final one, which is now unblocked, and let's go.

### Planning for QA

Once this one is done, I think I will do a final QA and just give everything a good crack and see what came back.

We're at, ooh, 11.25 in video time, but this is more like, I don't know, this has been about an hour of filming, I think.

While this has been going, I've been answering emails, I've been doing other stuff and checking back in occasionally seeing how things are going.

### Nailing the estimates

Okay, implementation is finished and looks like we've basically nailed it again. So it's 102.5k tokens, I mean, we've just smashed this.

I have to say it never ever goes this well in terms of how like task sizing. I sometimes have tasks that are so big, tickets that are so big that they go 300K tokens or something.

In those situations I mostly chalk it up as a learning experience and try to improve the skills so it catches those in future. Often they are something silly like a rename that accidentally touches way more that has a much bigger blast radius than I thought.

### The benefit of large context windows

Sometimes you can catch them, and sometimes you just can't. And that is one benefit of a large context window, is even if you screw up, it's not like it's going to compact at a weird moment. It will just keep going, keep going. And that is expensive, but it does mean you can continue, at least.

And of course you can still continue even if it compacts at a weird moment, but I find that compacting at strange moments means that it loses context in funny ways and it just doesn't end up working quite as well.

### The automated review

Alright, again, the reviews have found substantive findings. I'm really intrigued by that, by when we get the report at the end.

It's adding more test cases as well, which is interesting.

By the way, I think of this [automated review](https://www.aihero.dev/ai-coding-dictionary/automated-review) as just like an essential part of the process. I don't think of the output and then the review. It's like these are coming from the same developer in my head, or at least the same agent in my head, which is the implementation work is not ready until it's been reviewed by another agent.

## Run 5 - The final ticket

![Final commit summary showing 132k tokens used](https://res.cloudinary.com/total-typescript/image/upload/v1785751294/ai-hero-images/esqz9s7t0g9uftrzrx9z.png)

Okay, and we've got our final commit, clocking in at 132k tokens. So we've nailed it again.

So it has come back with a few judgment calls here and sometimes I will act on these judgment calls but for the purposes of this demo I'm not going to. I'm going to keep this fairly sparse. So I think though it's time to do some QA.

## QA - Testing the implementation

![Running npm run dev to test the application](https://res.cloudinary.com/total-typescript/image/upload/v1785751295/ai-hero-images/kjnfybp3xlocygqdiewe.png)

I'm going to open up a new terminal here, I'm going to run `npm run dev` and let's take a look at this application.

So I'll go into the dev UI, I'm going to switch over to Priya Nair. This is a new instructor and we've got a bunch of new, whoa, loads of new students.

So the seed data must have been significantly altered here. I'm going to go into her dashboard. I'll go into the new analytics page.

Okay, usefully, Priya doesn't have any courses. Let's switch over to Marcus Johnson, who does.

### Exploring the analytics

![Analytics dashboard showing revenue and top buyers](https://res.cloudinary.com/total-typescript/image/upload/v1785751296/ai-hero-images/dosz2onfcydp9pon8dok.png)

Let's close that. We've got some tabs up here, so overview and then course detail. We've got revenue over time. We've got some top buyers as well.

If we zoom up to the tabs here then we have some course data and then we pick a course.

This is really nice and detailed, isn't it? I'm going to go all time here to see if this changes anything.

![Course progress showing 23 of 23 reached, 1 lost inside](https://res.cloudinary.com/total-typescript/image/upload/v1785751297/ai-hero-images/dqjozrl0hneyuwan7ap4.png)

This data is actually really cool here. So we can see that 23 out of 23 reached, one lost inside. Slightly funny phrasing here, as though the student has been trapped within the course forever.

This is really cool analytics though, I would love to have this for my courses.

We've got some quiz results here, and we've got some revenue by country too.

This is looking really, really smart.

### Admin view

What happens now if we go into the dev ui and look as an admin here? What can the admin see?

![Admin view of the analytics dashboard](https://res.cloudinary.com/total-typescript/image/upload/v1785751298/ai-hero-images/whox4wrw0moqxk0koha2.png)

It looks like along with this we have now an admin page too. So it looks like in the course detail they can see everything. So an introduction to TypeScript.

They can see the drop-off here. If we look into overview, then we see the entire setup and they can filter down by instructors.

### Overall assessment

Overall, this is working, you know, outrageously well, really, really nicely done.

There is some stuff I would prefer to QA, for instance. There's lots of visual bugs I don't like. I can see that the text here, the hierarchy doesn't look quite right to me.

This little piece of UI doesn't look quite right.

### The importance of feedback loops

You can see though the stuff that the agent had a feedback loop for, such as the way things actually functioned and the way they worked, that seems to all be done really well.

So we can see that the analytics, I mean I haven't gone into the data to see if they're all correct, but they look plausible.

But the stuff it doesn't have a good feedback loop for, such as the user interface itself, is a little bit less refined.

Overall, I am pretty happy with this and I'm going to close the final ticket of the spec.

## Wrap-up

And with that, I'm going to consider this monster recording complete.

So well done for hanging in there. I would love to understand the decisions that you made during this exercise too.

### Key observations

Did you notice a difference between clearing and compacting? Did you find that the tickets that you'd created were properly vertically sliced?

I noticed that another reason this worked quite well is that the tickets were nicely vertically sliced and a lot of them just built on previous work.

### This approach scales

This approach scales to really, really big tasks. I've had specs that contain 30 tickets underneath them and they take a while to complete, but the amount of work you can pile through using this is incredible.

Especially because you've got the reviewer in there reviewing every commit before it lands.

So, well done, nice work, and I'll see you in the next one.
