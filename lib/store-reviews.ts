import type { GenericReview } from "@/lib/types";

const STATES = [
  ["California", "Los Angeles"],
  ["Texas", "Austin"],
  ["New York", "Brooklyn"],
  ["Florida", "Miami"],
  ["Illinois", "Chicago"],
  ["Washington", "Seattle"],
  ["Colorado", "Denver"],
  ["Georgia", "Atlanta"],
  ["Arizona", "Phoenix"],
  ["Ohio", "Columbus"],
  ["Massachusetts", "Boston"],
  ["Oregon", "Portland"],
  ["Pennsylvania", "Philadelphia"],
  ["North Carolina", "Charlotte"],
  ["Michigan", "Detroit"],
  ["Virginia", "Richmond"],
  ["New Jersey", "Newark"],
  ["Tennessee", "Nashville"],
  ["Minnesota", "Minneapolis"],
  ["Wisconsin", "Madison"],
  ["Missouri", "Kansas City"],
  ["Maryland", "Baltimore"],
  ["Indiana", "Indianapolis"],
  ["Nevada", "Las Vegas"],
  ["Utah", "Salt Lake City"],
  ["Connecticut", "Hartford"],
  ["South Carolina", "Charleston"],
  ["Alabama", "Birmingham"],
  ["Kentucky", "Louisville"],
  ["Louisiana", "New Orleans"],
  ["Oklahoma", "Oklahoma City"],
  ["Iowa", "Des Moines"],
  ["Arkansas", "Little Rock"],
  ["Kansas", "Wichita"],
  ["Mississippi", "Jackson"],
  ["Nebraska", "Omaha"],
  ["New Mexico", "Albuquerque"],
  ["Idaho", "Boise"],
  ["Hawaii", "Honolulu"],
  ["Maine", "Portland"],
  ["New Hampshire", "Manchester"],
  ["Rhode Island", "Providence"],
  ["Montana", "Billings"],
  ["Delaware", "Wilmington"],
  ["South Dakota", "Sioux Falls"],
  ["North Dakota", "Fargo"],
  ["Alaska", "Anchorage"],
  ["Vermont", "Burlington"],
  ["Wyoming", "Cheyenne"],
  ["West Virginia", "Charleston"],
] as const;

const FIRST = [
  "Amina", "James", "Sofia", "Daniel", "Priya", "Noah", "Elena", "Omar",
  "Maya", "Chris", "Lina", "Theo", "Hannah", "Marcus", "Grace", "Andre",
  "Chloe", "Ryan", "Fatima", "Owen", "Natalie", "Jamal", "Brooke", "Ethan",
  "Lucia", "Colin", "Aisha", "Patrick", "Megan", "Luis", "Harper", "Derek",
  "Nina", "Caleb", "Rosa", "Ian", "Kelly", "Victor", "Ava", "Samir",
];

const LAST = "ABCDEFGHJKLMNPRSTW".split("");

const TITLES_5 = [
  "Better than the photos",
  "Would order again",
  "Well made and well packed",
  "Exactly as described",
  "Perfect as a gift",
  "Clean store, fair prices",
  "Fast and careful shipping",
  "Smooth checkout",
  "Arrived ready to use",
  "Easy from cart to door",
];

const TITLES_4 = [
  "Great value",
  "Happy overall",
  "Would recommend",
  "Solid purchase",
  "Good quality",
  "Worth it",
];

const BODIES_5 = [
  "Packaging was careful and the item looked even better in person. Checkout was quick and tracking updates were clear.",
  "Arrived on time and matched the description. The whole process from cart to delivery felt straightforward.",
  "Easy to buy, clear tracking, and the product feels well made. I would shop here again without hesitation.",
  "Exactly what I needed. The photos were accurate and shipping was smooth from start to finish.",
  "Gifted this and they loved it. Simple process from cart to door, and the packaging looked ready to give.",
  "Clean store, fair prices, and the item was packed securely. No surprises, which is what I want from an online order.",
  "Ordered in the evening and had tracking the next morning. Everything arrived undamaged and ready to use.",
  "Checkout was simple, the total was clear before I paid, and the order showed up when promised.",
];

const BODIES_4 = [
  "Solid quality for the price. Support answered my question the same day, which made the purchase easy.",
  "Happy with the purchase. Quality is good. Delivery took a little longer than I hoped, but the item was worth the wait.",
  "Good quality and a fair price. The site was easy to use. I would recommend it to a friend.",
  "The item does the job and arrived in good shape. Shipping was a day later than the first estimate.",
];

function dateFor(index: number) {
  const day = new Date(Date.UTC(2026, 8, 20));
  day.setUTCDate(day.getUTCDate() - index * 3);
  return day.toISOString().slice(0, 10);
}

/** 77 five-star and 33 four-star notes. 517 / 110 = 4.7. */
export function storeReviews(): GenericReview[] {
  const ratings = [
    ...Array.from({ length: 77 }, () => 5),
    ...Array.from({ length: 33 }, () => 4),
  ];

  return ratings.map((rating, index) => {
    const [state, city] = STATES[index % STATES.length];
    const first = FIRST[index % FIRST.length];
    const last = LAST[(index * 3) % LAST.length];
    const five = rating === 5;
    const titles = five ? TITLES_5 : TITLES_4;
    const bodies = five ? BODIES_5 : BODIES_4;
    return {
      reviewer: `${first} ${last}.`,
      rating,
      title: titles[index % titles.length],
      content: bodies[index % bodies.length],
      date: dateFor(index),
      verified: true,
      location: `${city}, ${state}, USA`,
    };
  });
}
