import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, stagger, cardPop } from "../animations/variants";

export default function Hero() {
  return (
    <section className="hero-bg relative flex min-h-screen items-center overflow-hidden pt-24">
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-[18%] h-24 w-24 rounded-full border border-aqua/25 bg-aqua/10 blur-sm"
      />

      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 22, 0], x: [0, -14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[18%] left-[9%] h-32 w-32 rounded-full border border-coral/20 bg-coral/10 blur-sm"
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[1fr_420px] lg:items-center"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-extrabold text-aqua"
          >
            AI-Powered Travel Planning
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl"
          >
            Plan trips that match your budget, interests, and travel style.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-lg text-white/72"
          >
            Discover destinations, generate itineraries, optimize budgets,
            and explore places through interactive maps.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link to="/planner" className="btn-primary inline-flex">
              Generate Trip
            </Link>

            <Link to="/dashboard" className="btn-secondary inline-flex">
              Open Dashboard
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={cardPop}
          whileHover={{ y: -8 }}
          className="glass shine rounded-lg p-5"
        >
          <div className="mb-4">
            <h2 className="text-xl font-black">
              What WayfareWise Can Do
            </h2>
            <p className="text-sm font-bold text-white/55">
              Core Features
            </p>
          </div>

          <div className="grid gap-3">
            {[
              "Personalized destination recommendations",
              "AI itinerary generation",
              "Budget planning",
              "Interactive maps",
              "Travel insights"
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg bg-white/10 p-3"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}