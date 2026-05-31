import { motion } from "framer-motion";
import { money } from "../utils/formatters";

export default function HotelCard({ hotel }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.14)" }}
      transition={{ duration: 0.24 }}
      className="rounded-lg bg-white/10 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-black">{hotel.name}</h4>
          <p className="text-sm text-white/55">{hotel.type} stay</p>
        </div>
        <span className="rounded-full bg-aqua px-2 py-1 text-xs font-black text-night">{hotel.match_score}%</span>
      </div>
      <div className="mt-3 flex justify-between text-sm text-white/70">
        <span>{money(hotel.price)} / night</span>
        <span>{hotel.rating} rating</span>
      </div>
    </motion.article>
  );
}
