"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Embed, { EmbedExporter } from "./Embed";
import PersonaStarters from "./PersonaStarters";
import StageTimeline from "./StageTimeline";
import { AqlMark } from "@/components/demo/AqlMark";

/* The back button is opt-in: ?back=1 (or true) shows it, anything else
   hides it and the section list moves up to take its place. This page is
   standalone, so a visitor arriving directly has nowhere to go back to;
   only a link from the portfolio should offer it. Read through
   useSyncExternalStore so the server render and the first client render
   agree (false), then it settles on the real value. */
const noSub = () => () => {};
function useShowBack() {
  return useSyncExternalStore(
    noSub,
    () => {
      const v = new URLSearchParams(location.search).get("back");
      return v === "1" || v === "true";
    },
    () => false
  );
}

const SECTIONS = [
  ["challenge",  "The Challenge"],
  ["people",     "Who It's For"],
  ["home",       "Where AI Lives"],
  ["principles", "Principles"],
  ["flow",       "The Flow"],
  ["learning",   "Personalisation"],
  ["ritual",     "The Ritual"],
  ["rejected",   "Rejected"],
  ["built",      "Built With AI"],
  ["closing",    "Closing Notes"],
] as const;

const PEOPLE = [
  { id: "optimiser", n: "Type 01", name: "Curious Optimiser",
    d: ["Hunting for opportunities.",
        "Motivated by spending less and keeping more.",
        "Will happily go three levels deep if each level pays out.",
        "Treats a saving the AI finds as a small win."],
    a: ["Where did I spend the most last month?", "Find saving opportunities in my May spending"] },
  { id: "checker", n: "Type 02", name: "Anxious Checker",
    d: ["Opens the app often, sometimes several times a day.",
        "Wants reassurance more than insight.",
        "The best answer is frequently the boring one: nothing unusual happened."],
    a: ["Am I still on track this month?", "Did anything unusual go out this week?"] },
  { id: "scroller", n: "Type 03", name: "Passive Scroller",
    d: ["Low engagement, low patience.",
        "Will not go looking for value.",
        "It has to be surfaced without effort, in one glance, or it never reaches them at all."],
    a: ["Give me a 10-second summary", "Show me bills due this week"] },
];


const REJECTED = [
  { n: "Rejected 01", h: "Push notifications", d: [
    "It has to guess what you want before you have asked for anything. An assistant earns its keep by answering a question you actually have, so pushing a conclusion at someone inverts the relationship.",
    "It lands outside the product, where none of the follow-up exists. You cannot open the working, tag a figure, or ask the next question from a lock screen.",
    "The timing is unwinnable. Too early and the month is not finished. Too late and you have already moved on.",
  ] },
  { n: "Rejected 02", h: "Banners", d: [
    "It holds permanent space to say one fixed thing to everyone, while an AI surface is premised on the opposite: what it says next depends on who is asking.",
    "A message that cannot change per person, at the moment they look, becomes furniture. Furniture gets ignored.",
    "It sits beside the widget whose number prompted the question, competing with the exact thing it should have been attached to.",
  ] },
];


/* Tool marks, drawn inline so nothing loads from a third-party host. */
/* Official brand marks, taken verbatim from Simple Icons (24x24, single
   path, monochrome by design so they inherit currentColor). */
const Mark = ({ d, label }: { d: string; label: string }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" role="img" aria-label={label}>
    <path d={d} />
  </svg>
);

const CLAUDE_D = "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";
const NEXT_D = "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z";
const VERCEL_D = "m12 1.608 12 20.784H0Z";
const FIGMA_D = "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z";
const FRAMER_D = "M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z";

const TOOLS = [
  { name: "Claude Code",   role: "design and build",       logo: <Mark d={CLAUDE_D} label="Claude" /> },
  { name: "Next.js",       role: "React, App Router",      logo: <Mark d={NEXT_D} label="Next.js" /> },
  { name: "Framer Motion", role: "motion",                 logo: <Mark d={FRAMER_D} label="Framer" /> },
  { name: "Vercel",        role: "deployed",               logo: <Mark d={VERCEL_D} label="Vercel" /> },
  { name: "Figma",         role: "the submission deck",    logo: <Mark d={FIGMA_D} label="Figma" /> },
];

export default function CaseStudy() {
  const showBack = useShowBack();
  const [active, setActive] = useState<string>("challenge");

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="cs-shell">
      <nav className="cs-toc" aria-label="Contents">
        {showBack && (
          /* href is left off deliberately until the portfolio URL exists */
          <a className="cs-back">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.7"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </a>
        )}
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>{label}</a>
        ))}
      </nav>

      <main className="cs-main">
        {/* ───────── hero ───────── */}
        <header className="cs-hero">
          <div className="cs-brand"><AqlMark size={30} /><span>Aql&nbsp;AI</span></div>
          <h1>Envisioning an AI-native<br />finance experience</h1>
          <p className="cs-quote">&ldquo;Hey, I want to know how my spending was last month.&rdquo;</p>

          <div style={{ marginTop: 34 }}>
            <Embed id="hero" />
          </div>

          <div className="cs-hero-actions">
            <a className="cs-cta" href="/demo/playground" target="_blank" rel="noopener">
              <AqlMark size={22} />
              <span>View the prototype</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </header>

        {/* ───────── 01 ───────── */}
        <section className="cs-sec" id="challenge">
          <p className="cs-eyebrow"><b>01</b> The challenge</p>
          <div className="cs-narrow cs-stack">
            <h2>Anyone can show a graph. That&rsquo;s not enough.</h2>
            <div className="cs-body" style={{ marginTop: 4 }}>
              <p>A finance app already knows everything about you, your habits, your patterns, your goals.
                Surfacing that data without understanding you is no different from an Excel sheet with
                better typography.</p>
              <p>The real opportunity is AI that knows your data <b>and</b> knows you, and uses both to
                personalise every response.</p>
            </div>
            <p className="cs-pull" style={{ marginTop: 12 }}>Data + AI + personalisation is the bar this had to clear.</p>
          </div>
        </section>

        {/* ───────── 02 ───────── */}
        <section className="cs-sec" id="people">
          <p className="cs-eyebrow"><b>02</b> Who you&rsquo;re designing for</p>
          <div className="cs-stack-lg">
            <div className="cs-narrow cs-stack">
              <h2>Three people open the same app for three different reasons.</h2>
              <p className="cs-lede">Products used to be designed for the majority. With AI the experience
                can bend to each person inside the target audience, so the first job is knowing which one
                is asking, and what &ldquo;a good answer&rdquo; means to them.</p>
            </div>

            <div className="cs-people">
              {PEOPLE.map(p => (
                <article className="cs-person" key={p.id}>
                  <div className="cs-portrait">
                    <Image src={`/personas/${p.id}.webp`} alt={`${p.name} persona`} width={112} height={112} />
                  </div>
                  <div>
                    <p className="cs-who">{p.n}</p>
                    <h3>{p.name}</h3>
                  </div>
                  <ul className="cs-why">{p.d.map(x => <li key={x}>{x}</li>)}</ul>
                  <div className="cs-asks">{p.a.map(q => <span key={q}>{q}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 03 ───────── */}
        <section className="cs-sec" id="home">
          <p className="cs-eyebrow"><b>03</b> Where the AI lives</p>
          <div className="cs-stack-lg">
            <div className="cs-narrow cs-stack">
              <h2>It learns who&rsquo;s asking, then gives them a room to ask in.</h2>
            </div>

            <div className="cs-block">
              <div className="cs-stack">
                <h3>Onboarding is only the first guess.</h3>
                <ul className="cs-why">
                  <li>Onboarding sets an initial profile, but it is the weakest signal the product will
                    ever have.</li>
                  <li>The real learning is behavioural: what gets opened, how deep it goes, what gets
                    asked again, what gets ignored.</li>
                  <li>The empty state is where that knowledge becomes visible, which is why it is never
                    truly empty and never the same twice.</li>
                </ul>
              </div>
              <PersonaStarters />
            </div>

            <div className="cs-block">
              <div className="cs-stack">
                <h3>So the conversation gets its own tab, not a side panel.</h3>
                <ul className="cs-why">
                  <li>Two credible patterns: a panel that assists while you work, or a place you go to
                    when you have a question.</li>
                  <li>In a CRM the work lives in the app and AI augments it.</li>
                  <li>In a finance app people open the product <b>because</b> they have a question,
                    closer to how you use an LLM. A panel would make the AI a passenger to a screen you
                    were already on.</li>
                  <li>A dedicated tab also holds up as the AI takes on more: generating reports, building
                    dashboards, eventually taking actions. A drawer cannot carry that. A room can.</li>
                </ul>
              </div>
              <Embed id="home" caption="A full page. The conversation is the surface, not a sidecar." />
            </div>
          </div>
        </section>

        {/* ───────── 04 ───────── */}
        <section className="cs-sec" id="principles">
          <p className="cs-eyebrow"><b>04</b> Design principles</p>
          <div className="cs-narrow cs-stack" style={{ marginBottom: 28 }}>
            <h2>Four rules everything else answers to.</h2>
          </div>
          <ol className="cs-rules">
            <li><span className="cs-num">01</span><h3>AI as an overarching layer</h3>
              <p>Not a feature bolted to a screen. A capability that reaches across the product.</p></li>
            <li><span className="cs-num">02</span><h3>Security without compromise</h3>
              <p>Convenience never buys itself with trust. The bank&rsquo;s obligations come first.</p></li>
            <li><span className="cs-num">03</span><h3>Honest and transparent by design</h3>
              <p>Show the working. If a number is estimated, say so before the user has to ask.</p></li>
            <li><span className="cs-num">04</span><h3>AI creativity, design-system guardrails</h3>
              <p>We don&rsquo;t author the response. We author the parts it&rsquo;s allowed to compose from.</p></li>
          </ol>
        </section>

        {/* ───────── 05 ───────── */}
        <section className="cs-sec" id="flow">
          <p className="cs-eyebrow"><b>05</b> The flow</p>
          <div className="cs-narrow cs-stack" style={{ marginBottom: 18 }}>
            <h2>Asking a question should end with something you can act on.</h2>
            <p className="cs-lede">Five steps, from noticing a number on the dashboard to keeping a chart that
              answers it. Watch how far a single question travels: the assistant meets it where it was
              asked, answers in a form you can read at a glance, opens the working underneath, lets you
              push on any part of it, and ends by leaving something behind on your dashboard.</p>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Step 01</p>
              <h3>The invitation lives where the answer already is</h3>
              <ul className="cs-why">
                <li>No push, no banner. The invitation appears inside the Spending Summary widget the
                  user is already reading.</li>
                <li>The widget grows a gradient edge and offers the next step, so the benefit is visible
                  before the click.</li>
                <li>It asks for no new behaviour. They were looking at their spend anyway.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="nudge" caption="The nudge appears inside the widget, a moment after landing." />
            </div>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Step 02</p>
              <h3>Money is easier to read as a picture</h3>
              <ul className="cs-why">
                <li>A paragraph of figures asks you to hold six numbers in your head and compare them
                  yourself.</li>
                <li>A chart does that comparison for you, so the answer lands before you finish
                  reading it.</li>
                <li>So the answer arrives in two beats: plain language saying what happened, then the
                  visual carrying the detail.</li>
                <li>The words give you the conclusion. The chart lets you check it.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="answer" caption="The answered state: plain language on top, the chart carrying the detail." />
            </div>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Step 03</p>
              <h3>Depth is additive, never disruptive</h3>
              <ul className="cs-why">
                <li>Clicking a category opens its full breakdown beside the thread, not on top of it.</li>
                <li>The panel carries the chart, the insight, and the transactions behind the number.</li>
                <li>The conversation stays exactly where it was, so depth costs you nothing.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="drill" caption="The report panel, open alongside the answer rather than on top of it." />
            </div>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Step 04</p>
              <h3>Follow up on anything the answer showed you</h3>
              <ul className="cs-why">
                <li>Any piece of an answer can be taken further. Hover a card, a chart or a figure and a
                  follow-up arrow appears. The card shown here is only an example.</li>
                <li>Clicking pulls that piece into the composer as context, so the next question is asked
                  against it and nothing gets retyped.</li>
                <li>The assistant also has a good idea of what you will ask next, offered as ghosted text
                  with a <kbd>Tab</kbd> chip.</li>
                <li>One key accepts it. Start typing and it disappears. A starter, not a decision.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="tag" caption="Hover any part of an answer, click the arrow, then Tab to accept the suggested question." />
            </div>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Step 05</p>
              <h3>An answer worth keeping becomes part of the app</h3>
              <ul className="cs-why">
                <li>Saving the chart puts it on the dashboard.</li>
                <li>The dashboard re-lays itself out around the new arrival and highlights it on
                  landing, so the change is obvious.</li>
                <li>It gets personalised by use, not by a settings screen nobody opens.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="saved" caption="The dashboard after the user has saved a chart, reflowed around it." />
            </div>
          </div>
        </section>

        {/* ───────── 06 ───────── */}
        <section className="cs-sec" id="learning">
          <p className="cs-eyebrow"><b>06</b> Personalisation over time</p>
          <div className="cs-narrow cs-stack" style={{ marginBottom: 28 }}>
            <h2>The longer you use it, the better it knows you.</h2>
            <p className="cs-lede">Personalisation isn&rsquo;t a toggle, it&rsquo;s a process. Same person,
              same question, three stages of the product knowing who is asking.</p>
          </div>
          <StageTimeline />
        </section>

        {/* ───────── 07 ───────── */}
        <section className="cs-sec" id="ritual">
          <p className="cs-eyebrow"><b>07</b> The monthly ritual</p>
          <div className="cs-narrow cs-stack" style={{ marginBottom: 18 }}>
            <h2>Habits are earned, not enforced.</h2>
            <p className="cs-lede">Getting people back each month isn&rsquo;t a notification problem,
              it&rsquo;s a value problem. Two behaviour-triggered patterns, mutually exclusive. A user gets
              one or the other, never both.</p>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Pattern 01 · first-time user</p>
              <h3>Surface the reward, ask for nothing</h3>
              <ul className="cs-why">
                <li>No opt-in is asked for.</li>
                <li>At the start of the next month the report is already built and waiting inside the
                  Aql AI nav item.</li>
                <li>It uses the AI gradient accent to signal it was generated and is ready, rather than
                  reading as a generic system notification.</li>
                <li>The payoff lands on the first click, which is the only way a habit gets a second
                  chance.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="navcard" caption="Watch the left nav: the report surfaces itself a moment after landing." />
            </div>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">Pattern 02 · repeat user</p>
              <h3>Recognise the pattern, offer to automate</h3>
              <ul className="cs-why">
                <li>Once the same action repeats, reviewing monthly spend two or three times, the
                  assistant offers to run it automatically.</li>
                <li>Framed as recognition rather than a pitch, so the user feels understood rather than
                  sold to.</li>
                <li>Timing matters as much as wording: it appears <b>after</b> the review, never during
                  it.</li>
                <li>Interrupting the thing you are rewarding is how you lose the habit you just
                  earned.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="optin" caption="The June report runs, then the opt-in arrives above the composer." />
            </div>
          </div>

          <div className="cs-step">
            <div className="cs-step-txt">
              <p className="cs-step-n">And then</p>
              <h3>Round-Up, once the habit is real</h3>
              <ul className="cs-why">
                <li>Nothing is sold until the report has been read and both patterns are resolved.</li>
                <li>Only then does Aql introduce a product: a savings feature framed entirely in the
                  user&rsquo;s own numbers, AED 240 they could already have set aside.</li>
                <li>A savings pitch is worthless in the abstract, and obvious the moment someone has
                  finished looking at where their money went.</li>
              </ul>
            </div>
            <div className="cs-step-media">
              <Embed id="roundup" caption="Timed to the moment spending is top of mind." />
            </div>
          </div>

          <p className="cs-pull cs-narrow" style={{ marginTop: 30 }}>
            The goal isn&rsquo;t to remind people to come back. It&rsquo;s to give them a reason to.
          </p>
        </section>

        {/* ───────── 08 ───────── */}
        <section className="cs-sec" id="rejected">
          <p className="cs-eyebrow"><b>08</b> What didn&rsquo;t make it</p>
          <div className="cs-narrow cs-stack" style={{ marginBottom: 26 }}>
            <h2>Two patterns every finance app reaches for, and why neither survives here.</h2>
            <p className="cs-lede">Both are perfectly good patterns. Both were built for a product that
              shows you things. This one is built to be asked things, and that difference breaks them.</p>
          </div>
          <div className="cs-list">
            {REJECTED.map(r => (
              <div key={r.n}>
                <div className="side"><p className="cs-who">{r.n}</p><h4>{r.h}</h4></div>
                <div className="main"><ul className="cs-why">{r.d.map(x => <li key={x}>{x}</li>)}</ul></div>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── 09 ───────── */}
        <section className="cs-sec" id="built">
          <p className="cs-eyebrow"><b>09</b> Built With AI</p>
          <div className="cs-narrow cs-stack">
            <h2>Building with AI closed the gap between an idea and a working thing.</h2>
            <ul className="cs-why" style={{ marginTop: 4 }}>
              <li>An idea used to survive a long trip before anyone could feel it: sketch, mock, write
                the motion down, wait for a build. Most never made it, and the ones that did arrived
                flattened.</li>
              <li>Building with AI cuts that to minutes, so you find out what works by using it rather
                than arguing about it.</li>
              <li>This was an assessment. Instead of static screens and a written description of how they
                should behave, I built the whole flow as a working web app with <b>Claude Code</b> and
                submitted that.</li>
              <li>Every interaction decision was made by running it: how long the answer waits before it
                speaks, when the report panel slides in, how the dashboard rearranges around a chart you
                just saved. None of it can be judged from a still frame.</li>
            </ul>
            <div className="cs-stack-row" style={{ marginTop: 24 }}>
              {TOOLS.map(t => (
                <span className="cs-chip" key={t.name}>
                  <span className="cs-chip-logo">{t.logo}</span>
                  <b>{t.name}</b><i>{t.role}</i>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 10 ───────── */}
        <section className="cs-sec" id="closing">
          <p className="cs-eyebrow"><b>10</b> Closing notes</p>
          <div className="cs-narrow cs-stack" style={{ marginBottom: 30 }}>
            <h2>What this was really an exploration of.</h2>
            <p className="cs-lede">A spending review was the excuse. The subject was how deep a
              conversation with a finance AI can go, and what it has to know about you to get there.</p>
          </div>
          <ul className="cs-next">
            <li><b>It should adapt to the person asking.</b> The same question deserves a different answer
              depending on who is asking and what they will do with it.</li>
            <li><b>It should know more than your transactions.</b> Your history, your habits, what you
              opened last time, what you ignored, what you asked twice.</li>
            <li><b>It should keep learning after the first session.</b> Onboarding is the weakest signal it
              will ever have. Everything useful comes from behaviour over time.</li>
            <li><b>Answers should be explorable, not final.</b> Any part of a response can be pulled back
              into the conversation and pushed further.</li>
            <li><b>It should meet you where the question already is.</b> Inside the widget you were
              reading, not behind a button somewhere else.</li>
            <li><b>It should show its working.</b> A number you can open is worth more than a number you
              have to trust.</li>
            <li><b>Habits are earned.</b> Ask for a commitment only after you have shown the value, and
              never interrupt the thing you are rewarding.</li>
          </ul>
          <div className="cs-hero-actions" style={{ justifyContent: "flex-start", marginTop: 34 }}>
            <a className="cs-cta" href="/demo/playground" target="_blank" rel="noopener">
              <AqlMark size={22} />
              <span>View the prototype</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <p className="cs-sign">Questions, challenges, pushback are all welcome.<br /><span>{"// JB"}</span></p>
        </section>
      </main>

      <EmbedExporter />
    </div>
  );
}
