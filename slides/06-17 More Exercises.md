# More Exercises

This course used one shared codebase for every exercise. The fastest way to test what you've learned is a request with no answer key.

Below are ten feature requests for that same platform, numbered for reference only, not ranked by difficulty. Each one states a problem from the end user's perspective, and a proposed solution: one reasonable way to solve it, not the only way. Work out your own solution before you read the proposed one. Two of these problems need infrastructure this repo doesn't have yet. Notice that before you start, not after.

## The Requests

### 1. Achievement Badges

**Problem.** A student who finishes a course, passes every quiz in a section, or keeps a streak going gets no acknowledgment for it. There's nothing to look back on, and no signal to a returning student that their effort was noticed.

**Proposed solution.** Award a badge for each milestone: a finished course, a section with every quiz passed, a streak of a given length. Show the collection on the student's profile. This is one shape among several. What counts as a milestone is a decision for you to make, not this list.

### 2. Bookmarks / Notes

**Problem.** A student reading a lesson has no way to mark it for later or attach a thought to it. Anything worth remembering has to live outside the platform, disconnected from the content it's about.

**Proposed solution.** Let a student bookmark a lesson and attach a private note to it, with a page listing every bookmark across every course. This is a starting point, not a full design. Whether a note is freeform text, tied to a timestamp in a video, or something else entirely is still open.

### 3. Certificates of Completion

**Problem.** A student who finishes a course has no artifact to show for it outside the platform. Nothing to put on a CV, share, or point to as proof it happened.

**Proposed solution.** Generate a downloadable PDF certificate once a student meets some definition of "finished." That definition is the real decision here, and this proposal deliberately leaves it open: every lesson viewed and every quiz passed are two different bars, and picking one changes what the certificate actually certifies.

### 4. Code Playground

**Problem.** A student reading a lesson about code has to leave the platform, open an editor, and set up a project just to try an idea. That gap between reading and doing costs them momentum.

**Proposed solution.** Let a student run a code snippet in the browser without leaving the lesson. This proposal is incomplete on purpose: the real decision is the execution sandbox, a Web Worker, an iframe, or a hosted service, and that choice shapes everything else, including whether this is safe to build with the infrastructure this repo currently has.

### 5. Course Announcements

**Problem.** An instructor has no way to reach every enrolled student at once. Anything they want to say to the whole class has to go through some channel outside the platform.

**Proposed solution.** Let an instructor post an announcement tied to a course, and surface it to enrolled students without them going looking for it. Where it surfaces, a banner, a feed, a notification, is left open on purpose, since the right answer depends on how the rest of the platform already handles visibility.

### 6. Learning Streaks

**Problem.** A student who studies every day has no way to see that pattern reflected back at them. The only record of their consistency is their own memory of it.

**Proposed solution.** Track which days a student completes at least one lesson, and render it as a GitHub-style contribution calendar. This proposal skips the streak rule on purpose: whether a missed day resets the count to zero or just breaks the current run is a real design choice, not a default to inherit.

### 7. Lesson Search

**Problem.** A student who remembers a phrase from a lesson but not which one has no way to find it again, short of scrolling back through the course by hand.

**Proposed solution.** Add full-text search across lesson content, not just titles. This proposal doesn't settle the scope: whether search covers one course or every course the student is enrolled in changes the shape of the index, and that choice belongs to you.

### 8. Rate Limiting

**Problem.** Nothing stops one client from sending far more requests than the API was built to handle, whether that's a bug in a script or someone probing for weaknesses.

**Proposed solution.** Reject requests over a threshold, scoped per user or per IP within a time window. What happens to a rejected request, an error, a queue, silence, is left unspecified here on purpose. It's a design decision, and this is only one way to make it.

### 9. Stripe Integration

**Problem.** The current purchase flow is a mock. No real money moves, so nothing about the platform's payment behavior has been tested against a real payment provider.

**Proposed solution.** Replace the mock with real Stripe processing, confirmed through webhooks rather than the initial request alone. This proposal is a starting point, not a spec: it doesn't cover what happens when a payment fails partway through, and it needs a real Stripe account before any of it can be tested.

### 10. Student Profiles

**Problem.** A student who wants to show what they've done on this platform, to a hiring manager, a peer, anyone, has no page to point them to.

**Proposed solution.** Give each student a public profile: courses completed, badges earned, a short bio. This proposal leaves the boundary undrawn on purpose. What a student controls about their own profile, and what stays fixed, is a decision worth making before you build the edit surface.

## Steps To Complete

### Scope It

- [ ] Repeat the prompt back in your own words in a [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session

Confirm the scope before you touch any code.

- [ ] Decide whether the scope needs a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) or you can implement it directly

A small, well-scoped request doesn't need one.

### Build It

- [ ] Implement it

- [ ] Code review it

- [ ] QA it manually

Click through the feature yourself before you trust it.

### Iterate

- [ ] Give follow-ups until the feature matches what you imagined

- [ ] Ship another request from the list if you want to keep going
