import { motion } from "framer-motion";
import { cardPop } from "../animations/variants";
import { money } from "../utils/formatters";

export default function DestinationCard({
  destination,
  onSelect,
  onFavorite
}) {
  return (
    <motion.article
      layout
      variants={cardPop}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22
      }}
      className="soft-card shine group overflow-hidden rounded-lg"
    >
      <motion.img
        src={destination.image}
        alt={destination.name}
        className="h-48 w-full object-cover"
        whileHover={{ scale: 1.07 }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      />

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black">
              {destination.name}
            </h3>

            <p className="text-sm text-white/55">
              {destination.state}
            </p>
          </div>

          <motion.span
            initial={{
              scale: 0.8,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 18,
              delay: 0.12
            }}
            className="rounded-full bg-aqua px-3 py-1 text-sm font-black text-night"
          >
            {destination.match_score}%
          </motion.span>
        </div>

        <p className="min-h-16 text-sm text-white/68">
          {destination.description}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-white/10 p-2">
            <p className="text-white/45">
              Cost
            </p>

            <p className="font-black">
              {money(destination.estimated_cost.total)}
            </p>
          </div>

          <div className="rounded-lg bg-white/10 p-2">
            <p className="text-white/45">
              Crowd
            </p>

            <p className="font-black">
              {destination.crowd_level}
            </p>
          </div>

          <div className="rounded-lg bg-white/10 p-2">
            <p className="text-white/45">
              Rating
            </p>

            <p className="font-black">
              {destination.rating}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-aqua/10 p-3 text-xs text-aqua">
          Vector similarity:
          <strong>
            {" "}
            {destination.semantic_score || 0}%
          </strong>

          <span className="text-white/50">
            {" "}
            via {destination.embedding_source || "local"} embeddings
          </span>
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            Optimized for {destination.optimized_for}
          </span>

          <span className="rounded-full bg-coral/20 px-3 py-1 text-xs text-coral">
            {destination.travel_difficulty}
          </span>
        </div>

        <p className="mt-4 text-sm text-aqua">
          {destination.why_recommended}
        </p>

        <div className="mt-5 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(destination)}
            className="btn-primary flex-1 py-2"
          >
            Build Plan
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onFavorite(destination.name)}
            className="btn-secondary px-4 py-2"
          >
            Save
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}