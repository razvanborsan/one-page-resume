export const RESUMES = [
`# Milo Vex
Product Engineer
San Francisco, CA · milo@milovex.dev · github.com/milovex

---

I build tools that help people think less about tooling. Spent the last two years making an AI write better code than me, then pretending that was the plan all along. Most productive when slightly confused.

## EXPERIENCE

### Product Engineer — Anthropic (Claude Code)
2023 — Present
- Designed the slash command system that ships with every Claude Code session
- Built the permission model so the AI can edit your files without ruining your day
- Reduced first-run-to-first-commit time by 40% by removing onboarding steps nobody finished
- Wrote the hooks system that lets users run shell commands before and after tool calls

### Product Engineer — Anthropic (Claude)
2022 — 2023
- Shipped the artifact rendering pipeline — the thing that lets Claude show you code and run it
- Prototyped the conversation branching UI that became the basis for editing messages
- Spent three weeks optimizing streaming latency; users noticed in hours, which was nice

### Frontend Engineer — Replit
2020 — 2022
- Built the multiplayer cursor system that made collaborative coding feel like a Google Doc
- Migrated the editor from Monaco to CodeMirror 6 without anyone filing a bug, somehow
- Owned the mobile web experience; made a terminal usable on a phone, which shouldn't work but does

## EDUCATION

### BS in Computer Science — UC Berkeley
Focus on programming languages and developer tools
Senior project: a Git GUI that your parents could use (they couldn't, but almost)

## SKILLS

TypeScript · React · Rust · Node · Systems thinking · CLI design · Making demos that accidentally ship · Reading other people's code without flinching · Knowing when the feature is done`,

`# Nora Ashby
Data Engineer
Chicago, IL · nora@noraashby.io · github.com/nashby

---

I make data pipelines that don't wake anyone up at 3am. Previously spent two years convincing people that "it works on my laptop" is not a deployment strategy. Happiest when a dashboard loads in under a second.

## EXPERIENCE

### Senior Data Engineer — Stripe
2022 — Present
- Rebuilt the merchant analytics pipeline to process 2B events/day with 40% fewer compute costs
- Designed the schema migration system that lets teams ship breaking changes without breaking anything
- On-call rotation lead; reduced P1 incidents from 12/month to 3 by fixing the alerting, not the thresholds

### Data Engineer — Datadog
2019 — 2022
- Built the ingestion layer for custom metrics that now handles 800K data points per second
- Wrote the anomaly detection service that catches metric regressions before customers notice
- Migrated 14TB of time-series data from Cassandra to a custom storage engine with zero downtime

### Software Engineer — Capital One
2017 — 2019
- Automated the credit risk reporting pipeline that used to take a team of analysts two days
- Built a real-time fraud detection prototype that caught patterns the batch system missed entirely
- Convinced the team to adopt dbt; it stuck and they still use it

## EDUCATION

### MS in Computer Science — University of Illinois
Focus on distributed systems and databases
Thesis: optimizing query planning for heterogeneous data lakes

## SKILLS

Python · SQL · Spark · Kafka · Airflow · dbt · Terraform · PostgreSQL · Writing runbooks people actually follow · Debugging distributed systems at 2am · Saying "have you checked the logs" diplomatically`,

`# Theo Campos
Design Engineer
Brooklyn, NY · theo@theocampos.com · dribbble.com/theoc

---

I sit between design and engineering and try to make sure neither side is sad. Most of my work is making interfaces feel inevitable — like they couldn't have been any other way. Unreasonably invested in easing curves.

## EXPERIENCE

### Design Engineer — Vercel
2022 — Present
- Built the new dashboard navigation that reduced time-to-deploy by 25% through better information hierarchy
- Created the component library's motion system; every transition in the product uses it now
- Designed and shipped the collaborative deployment preview comments feature end-to-end

### Frontend Engineer — Linear
2020 — 2022
- Implemented the keyboard-first interaction model that became a core part of Linear's identity
- Built the custom text editor with real-time sync, markdown shortcuts, and inline image handling
- Reduced bundle size by 35% by rewriting the icon system from individual SVGs to a sprite sheet

### UI Engineer — Figma
2018 — 2020
- Shipped the auto-layout engine's constraint visualization — the guides you see when resizing frames
- Built the prototype interaction panel that lets designers chain animations without writing code
- Wrote the color picker that handles P3 wide-gamut colors; it's still the same one they use

## EDUCATION

### BFA in Graphic Design — Rhode Island School of Design
Concentration in interactive media
Senior show: a generative typography system that responds to ambient sound

## SKILLS

TypeScript · React · Svelte · WebGL · Framer Motion · Figma API · CSS that sparks joy · Spatial reasoning · Advocating for the 8px grid · Making engineers care about kerning`,

`# Sam Nguyen
Software Engineer
Portland, OR · sam@sambuilds.dev · github.com/sambuilds

---

I like making things that work well and feel right. Most of my job is reading code someone else wrote and quietly figuring out what they meant. The rest is trying to name variables honestly.

## EXPERIENCE

### Software Engineer — Smalldoor
2022 — Present
- Built the onboarding flow that cut drop-off by 30%, mostly by removing three unnecessary steps
- Migrated a legacy billing system without a single customer noticing, which is the best compliment
- Wrote documentation that people actually read, reportedly a first for the engineering team

### Frontend Developer — Greenhouse Studio
2019 — 2022
- Shipped a design system used across four products; resisted the urge to call it a "platform"
- Debugged a race condition that had been open for 8 months by staring at it long enough
- Paired with designers weekly, learned more about spacing than any CS class ever taught me

### Junior Developer — Tidepool Labs
2017 — 2019
- Inherited a 12,000-line file and refactored it into something a new hire could follow in a day
- Automated a reporting task that used to take the ops team half a Friday
- Asked a lot of questions in code reviews; turns out that's useful too

## EDUCATION

### BS in Computer Science — Oregon State University
Focus on human-computer interaction
Senior project: a transit app that worked offline, which felt important at the time and still does

## SKILLS

JavaScript · TypeScript · React · Node · PostgreSQL · CSS that doesn't fight you · Writing things down · Asking good questions · Knowing when to stop`,

`# Ava Lin
Junior Developer
Austin, TX · ava@avalin.dev · github.com/avalin

---

Recent grad who writes code that works the first time about 40% of the time. The other 60% I learn something.

## EXPERIENCE

### Software Engineer Intern — Netlify
2024
- Added edge function support for three new regions; mostly copy-pasted the first one correctly
- Fixed a caching bug that had been quietly serving stale assets for six months

### Teaching Assistant — UT Austin CS Department
2023 — 2024
- Held office hours for 200 students in intro to systems; answered "what is a pointer" 400 times
- Wrote autograder tests that caught 90% of common mistakes before submission

## EDUCATION

### BS in Computer Science — UT Austin
Dean's list, focus on systems programming

## SKILLS

C · Python · JavaScript · React · Linux · Asking for help early · Reading error messages carefully`,

`# Raj Patel
Staff Engineer
Seattle, WA · raj@rajpatel.dev · github.com/rajpatel

---

I've been writing software for 15 years and have mass-deleted more code than most people have written. Currently focused on making large systems simpler, which turns out to be the hardest kind of engineering.

## EXPERIENCE

### Staff Engineer — Stripe
2021 — Present
- Led the migration of the payments state machine from a monolith to event-sourced microservices
- Designed the circuit breaker system that prevented three potential cascading failures in production
- Reduced API p99 latency from 800ms to 120ms by rewriting the merchant lookup path
- Mentored eight engineers across two teams; three were promoted within a year

### Senior Engineer — Dropbox
2017 — 2021
- Built the incremental sync engine that handles 50M file change events per day
- Architected the conflict resolution system for shared folders; it handles 99.7% of cases automatically
- Wrote the internal RFC process that the engineering org still uses for technical decisions
- Led the Python 2 to 3 migration for 2M lines of code across 400 services

### Software Engineer — Google (Maps)
2013 — 2017
- Implemented offline map tile caching that reduced data usage by 60% in emerging markets
- Built the place autocomplete ranking model that increased selection accuracy by 25%
- Contributed to the rendering pipeline that handles 100B map tile requests per month
- Designed the A/B testing framework for map UI experiments

### Software Engineer — Amazon
2010 — 2013
- Built the first version of the "customers also bought" recommendation widget for Kindle
- Reduced checkout page load time by 300ms by optimizing the session store
- Wrote the deployment pipeline for the digital content team; it survived Black Friday

## EDUCATION

### MS in Computer Science — Carnegie Mellon University
Focus on distributed systems
Thesis: consensus protocols for geo-replicated databases

### BS in Computer Engineering — Georgia Tech

## SKILLS

Java · Go · Python · Rust · Kafka · DynamoDB · PostgreSQL · Terraform · System design · Writing RFCs · Deleting code · Making on-call less painful · Knowing when not to build it`,

`# Elena Moss
Creative Technologist
London, UK · elena@elenamoss.co · github.com/elenamoss

---

I make websites that people screenshot and send to their friends. Background in graphic design, learned to code because I kept asking developers for things they said were impossible.

## EXPERIENCE

### Creative Technologist — R/GA London
2022 — Present
- Built an interactive annual report for Nike that got 2M unique visitors in the first week
- Created a WebGL product configurator for a luxury brand that increased engagement time by 4x

### Freelance Developer & Designer
2019 — 2022
- Designed and built portfolio sites for 30+ creatives; every one of them still gets compliments
- Made a generative art tool that was featured on Hacker News for a full day

## EDUCATION

### BA in Graphic Design — Central Saint Martins

## SKILLS

JavaScript · Three.js · GLSL · Figma · After Effects · Making things move beautifully`,

`# Marcus Chen
Backend Engineer
Toronto, ON · marcus@mchen.dev · github.com/marcuschen

---

I write the code that nobody sees but everybody depends on. Spent the last decade making servers do things reliably at scale. My favorite bug is always the one where the fix is deleting code.

## EXPERIENCE

### Senior Backend Engineer — Shopify
2021 — Present
- Redesigned the inventory reservation system to handle flash sales without overselling
- Built the webhook delivery pipeline that processes 4B events per month with 99.99% reliability
- Migrated the order management service from Rails to a Rust core; 10x throughput improvement
- Led the incident response for the largest traffic event in company history; zero customer impact

### Backend Engineer — PagerDuty
2018 — 2021
- Built the real-time incident timeline that aggregates events from 200+ integration sources
- Designed the notification deduplication system that reduced alert fatigue by 40%
- Rewrote the on-call scheduling engine to support complex rotation patterns across time zones
- Owned the Kafka cluster that ingests 500K events per second

### Software Developer — Wealthsimple
2016 — 2018
- Built the trade execution engine for the first version of Wealthsimple Trade
- Implemented fractional share purchasing; the math was harder than expected
- Wrote the reconciliation system that catches discrepancies between our ledger and the clearing house

### Junior Developer — Freshbooks
2014 — 2016
- Added multi-currency support to the invoicing system; learned that money is surprisingly complicated
- Built the CSV import tool that customers actually liked, which is rare for import tools

## EDUCATION

### BCS in Computer Science — University of Waterloo
Co-op placements at Bloomberg and Shopify

## SKILLS

Ruby · Rust · Go · PostgreSQL · Redis · Kafka · gRPC · Kubernetes · Database internals · Making things boring in a good way · Incident response · Writing postmortems that prevent repeats`,

`# Zoe Park
UX Engineer
Denver, CO · zoe@zoepark.design · github.com/zpark

---

I prototype faster than most people can write tickets. Believe that the best way to resolve a design debate is to build both versions before lunch.

## EXPERIENCE

### UX Engineer — Notion
2023 — Present
- Built the new page transition system that makes navigation feel instant
- Prototyped 15 interaction concepts for the Notion AI sidebar; three shipped

### Frontend Developer — Craft
2021 — 2023
- Implemented the block editor's drag-and-drop system with nested container support
- Built the real-time collaboration cursors with smooth interpolation

### Design Technologist — IDEO
2019 — 2021
- Created rapid prototypes for Fortune 500 clients; average turnaround was two days
- Built a physical-digital prototype for a healthcare client that changed their product direction

## EDUCATION

### BFA in Interactive Design — Parsons School of Design
Minor in computer science

## SKILLS

TypeScript · React · Swift · Framer · Origami · Prototyping in code · Animating with purpose · Talking to designers in their language`,
];

export const DEFAULT_MD = RESUMES[0];
