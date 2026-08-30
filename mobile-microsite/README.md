# Mobile Microsite

A Claude Code skill that builds a cinematic, conversion-focused scroll website from a single prompt. You describe an industry or a brand. Claude researches it, writes the story, makes the visuals, builds the page, and tests it on a phone. What comes out is a website where the whole page behaves like one continuous film that plays as the visitor scrolls.

These sites are built to be shown live and to sell. The goal is simple: someone watches a 20 second clip of the site on a phone and says "no one has seen a website do that."

## What it makes

One prompt builds one site. You get to choose the look, or let Claude choose for you. There are three styles:

- **Cinematic Film.** Real generated footage, shot to shot, that scrubs as you scroll. Best when the brand sells a world or an experience (travel, food, fitness, real estate, product craft). This style needs a video engine (see Prerequisites).
- **Kinetic Type.** The words themselves are the film. Huge typography choreographed as one journey. Best when the brand sells authority, clarity, or a promise (law, finance, consulting, software, agencies). No video engine needed.
- **Graphic Editorial.** Flat color, cutouts, and print texture, animated like a moving magazine. Best when the brand sells culture, craft, or attitude (fashion, music, hospitality, indie products). No video engine needed.

Every build runs through five stages:

1. **Research.** Claude learns the industry or brand, finds the real customer, and mines the words that customer actually uses.
2. **Story.** It maps the film's chapters to a sales arc: the pain, the fear, the turn, the after-state, the offer.
3. **Film.** It art-directs the world (colors, fonts, motion, sound) and either generates the footage or composes the pure-code motion.
4. **Build.** It writes the whole page from scratch for that brand. No templates.
5. **Verify.** It screenshots every moment on a phone viewport, tests for jank, and records a short teaser clip.

## Two ways to make the film

- **Lane A, pure code (the default, zero setup).** The film is code-driven motion. It costs nothing and needs no accounts. This carries the Kinetic Type and Graphic Editorial styles.
- **Lane B, cinematic footage (opt-in, the signature look).** Real generated video, chained shot to shot. This is the Cinematic Film style. It needs your own video engine and credits (see Prerequisites).

If you are not sure, start with Lane A. It works for everyone and needs nothing installed.

## Install

Copy the whole `mobile-microsite` folder into one of these places:

- **Global (available in every project):** `~/.claude/skills/mobile-microsite`
- **One project only:** `your-project/.claude/skills/mobile-microsite`

Then restart Claude Code. To start a build, just say one of these:

- `spec site for [industry]` (for example: "spec site for luxury med spas")
- `build me a scroll-film site for my brand`
- `cinematic scroll site for [my product]`

## Prerequisites

You need these to run a build:

- **Claude Code.** This is a Claude Code skill.
- **ffmpeg.** For frames, video, and the teaser clip. Install with `brew install ffmpeg`.
- **Node 18 or newer.** The verify step runs on Node. When Claude asks, run `npm i puppeteer-core` inside the build folder.
- **Google Chrome installed.** The verify step drives your real Chrome to take true screenshots.

Optional, only for the Cinematic Film style (Lane B):

- **A video engine account plus its command-line tool, logged in.** Any image-to-video engine that accepts a start image will work. The skill is wired up and tested against Higgsfield Seedance as the reference. Kie.ai, fal, Replicate, and similar engines follow the same pattern.
- **Rough cost.** About 40 credits of draft footage per site. The skill always quotes the cost before it spends anything, drafts cheap first, and only makes the full-resolution version after you approve.

## What each file does

- **`SKILL.md`** is the process. It tells Claude how to run all five stages, how to write the copy, and how to keep the build high-converting.
- **`references/`** holds the laws Claude follows:
  - `playbook.md` is the footage law (how to storyboard and chain the video clips).
  - `engine.md` is the page engine (how the scroll scrubbing and motion actually work).
  - `wow.md` is the delight kit (the preloader, the interactive scroll moments, the finale payoff, sound, and touch effects).
- **`scripts/`** holds the mechanical helpers (plain shell and Node, no AI):
  - `chain-step.sh` generates one video clip chained from the last frame of the previous one, then checks the seam is clean.
  - `assemble.sh` stitches the clips into one master and extracts the frame set the page scrubs through.
  - `verify.js` screenshots every beat on a phone viewport, runs a jank test, and records the teaser clip.
  - `phone-shell.sh` writes a preview page that frames the site inside an iPhone shell, so you can see the mobile build on a laptop.

## Your first build

Type this into Claude Code:

```
spec site for boutique coffee roasters
```

The skill will ask you a few things (and every question has a "you decide" path, so you can defer any of them to Claude):

- What you are building and the one-line feeling.
- Whether Claude should create the visual world or use your own assets.
- The journey: where the film starts and where it ends.
- Real video or pure motion (Lane B or Lane A). Default is Lane A.
- What comes after the film (sections, the main call to action, contact and socials).
- Where it goes live (local only, or your own Vercel).

Before it builds anything, it pitches you two or three named concepts and marks its recommended one. You pick one, or say "you choose."

When it finishes, you get:

- The site itself.
- A phone preview page so you can see the mobile version on your laptop.
- A short teaser MP4, ready to post as a Reel.

## Notes

- **Mobile first.** The film is designed, generated, and tested at phone-portrait size first. Desktop is the adaptation.
- **Zero personal data.** This skill ships with no keys, no accounts, and no personal paths. You bring your own.
- **The design is done by Claude.** All the taste-heavy work (concepts, art direction, copy, and the actual code) is done by Claude. The scripts only do the mechanical work.
