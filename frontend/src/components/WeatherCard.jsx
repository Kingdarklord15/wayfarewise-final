import { motion } from "framer-motion";

export default function WeatherCard({ weather }) {
  if (!weather) return null;
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-5">
      <h2 className="text-2xl font-black">Weather Intelligence</h2>
      <p className="mt-2 text-white/65">{weather.destination}: {weather.condition}, {weather.temperature_c}C</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {weather.forecast.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            className="rounded-lg bg-white/10 p-3"
          >
            <p className="font-bold">{day.day}</p>
            <p className="text-sm text-white/60">{day.condition}, {day.temperature_c}C</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-sm text-aqua">{weather.suggestion}</p>
    </motion.section>
  );
}
