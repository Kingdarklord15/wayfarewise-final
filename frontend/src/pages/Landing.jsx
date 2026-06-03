import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import { cardPop, fadeUp, stagger } from "../animations/variants";


  const features = [
  [
    "Smart Recommendations",
    "Get personalized destination suggestions based on your budget, interests, season, and travel preferences."
  ],
  [
    "Trip Planner",
    "Create detailed day-by-day itineraries including attractions, activities, dining options, and experiences."
  ],
  [
    "Destination Insights",
    "Explore key destination details, ratings, travel suitability, and popular highlights."
  ],
  [
    "Preference-Based Matching",
    "Discover destinations that align with your mood, interests, preferred season, and travel style."
  ],
  [
    "Budget Management",
    "Compare travel choices and find destinations that fit within your spending plan."
  ],
  [
    "Interactive Navigation",
    "Browse destinations, attractions, and recommended routes through interactive maps."
  ]
];

export default function Landing() {
  return (
    <>
      <Hero />
      <main className="mx-auto w-[min(1180px,calc(100%-32px))] py-20">
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 md:grid-cols-3">
          {features.map(([title, text]) => (
            <motion.article variants={cardPop} whileHover={{ y: -8, scale: 1.02 }} key={title} className="soft-card shine rounded-lg p-6">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-aqua text-lg font-black text-night">
                {title.slice(0, 2)}
              </div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm text-white/65">{text}</p>
            </motion.article>
          ))}
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 overflow-hidden rounded-lg border border-white/10 bg-white/5 p-8 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>

              <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">From vague travel intent to a full trip plan.</h2>
              <p className="mt-5 text-white/68">
                Users can enter their budget, travel style,
                season, group type, and interests to receive
                AI-ranked destinations, personalized itineraries,
                travel insights, and interactive trip planning tools.
              </p>
              <Link to="/planner" className="btn-primary mt-7 inline-flex">
                Try the Planner
              </Link>
            </div>
            <div className="grid gap-3">
              {["Travel preferences", "Destination Ranking", "Trip Recommendations", "Itinerary Creation", "Save trip"].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 rounded-lg bg-white/10 p-4"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-coral font-black text-night">{index + 1}</span>
                  <span className="font-bold">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
