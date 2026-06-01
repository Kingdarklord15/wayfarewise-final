import { motion } from "framer-motion";

export default function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0.4, y: 18 }}
          animate={{ opacity: [0.45, 0.9, 0.45], y: 0 }}
          transition={{ opacity: { duration: 1.2, repeat: Infinity, delay: item * 0.08 }, y: { duration: 0.25 } }}
          className="soft-card h-96 rounded-lg"
        />
      ))}
    </div>
  );
}
