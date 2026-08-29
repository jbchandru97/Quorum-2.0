/* Shared case-study copy. */

/* The user asks the same thing every time. What changes is how much
   the product knows about who is asking. */
export const STAGE_Q = "Where did I spend the most last month?";

export const STAGES = [
  {
    n: "Stage 01", h: "First visit",
    d: "Nothing is known yet, so nothing is assumed. The answer states the fact and stops.",
    type: null,
    habit: null,
    a: "Food delivery is AED 519 this month. That's 30% of your food spend, and up 18% from April.",
  },
  {
    n: "Stage 02", h: "Type established",
    d: "Behaviour has revealed a type. The same fact now carries a proposal, because this person acts on them.",
    type: "Curious Optimiser",
    habit: null,
    a: "Food delivery is AED 519, up 18% from April. Cutting back a few times a week could save you AED 150–200 a month.",
  },
  {
    n: "Stage 03", h: "Habits understood",
    d: "Enough history to reason across months rather than within one, and to price the habit instead of the month.",
    type: "Curious Optimiser",
    habit: "Orders food delivery weekly",
    a: "Food delivery again. AED 519 this month, and it has averaged AED 490 across three months. Three home-cooked meals a week would save you AED 2,160 a year.",
  },
];
