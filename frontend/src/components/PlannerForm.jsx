import { motion } from "framer-motion";
import { fadeUp, stagger } from "../animations/variants";

export default function PlannerForm({
  preferences,
  setPreferences,
  onSubmit,
  loading
}) {

  function update(field, value) {

    setPreferences((current) => ({
      ...current,
      [field]: value
    }));
  }

  return (

    <motion.form
      variants={stagger}
      initial="hidden"
      animate="show"
      onSubmit={onSubmit}
      className="glass rounded-lg p-5"
    >

      <div className="mb-5">

        <p className="text-sm font-bold text-aqua">
          Smart Travel Planner
        </p>

        <h2 className="text-2xl font-black">
          Tell us your travel style
        </h2>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <motion.label variants={fadeUp}>

          <span className="label">
            From city
          </span>

       <select
  className="input"
  value={preferences.from_city}
  onChange={(e) =>
    update("from_city", e.target.value)
  }
>

  {[
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Chandigarh",
    "Jaipur"
  ].map((city) => (

    <option
      className="text-night"
      key={city}
      value={city}
    >
      {city}
    </option>

  ))}

</select>

        </motion.label>

        <motion.label variants={fadeUp}>

          <span className="label">
            Budget
          </span>

          <input
  className="input"
  placeholder="e.g. 15000"
  value={preferences.budget}
  onChange={(e) =>
    update("budget", e.target.value)
  }
/>
        </motion.label>

        <motion.label variants={fadeUp}>

          <span className="label">
            Days
          </span>

          <select
            className="input"
            value={preferences.days}
            onChange={(e) =>
              update("days", e.target.value)
            }
          >

            <option value="2" className="text-night">
              2
            </option>

            <option value="3" className="text-night">
              3
            </option>

            <option value="4" className="text-night">
              4
            </option>

            <option value="5" className="text-night">
              5
            </option>

            <option value="7" className="text-night">
              7
            </option>

          </select>

        </motion.label>

        <motion.label variants={fadeUp}>

          <span className="label">
            Season
          </span>

          <select
            className="input"
            value={preferences.season}
            onChange={(e) =>
              update("season", e.target.value)
            }
          >

            {[
              "winter",
              "spring",
              "summer",
              "autumn"
            ].map((season) => (

              <option
                className="text-night"
                key={season}
                value={season}
              >
                {season}
              </option>
            ))}

          </select>

        </motion.label>

        <motion.label variants={fadeUp}>

          <span className="label">
            Group
          </span>

          <select
            className="input"
            value={preferences.group_type}
            onChange={(e) =>
              update("group_type", e.target.value)
            }
          >

            {[
              "friends",
              "solo",
              "couple",
              "family"
            ].map((group) => (

              <option
                className="text-night"
                key={group}
                value={group}
              >
                {group}
              </option>
            ))}

          </select>

        </motion.label>

        <motion.label variants={fadeUp}>

          <span className="label">
            Mood
          </span>

          <select
            className="input"
            value={preferences.mood}
            onChange={(e) =>
              update("mood", e.target.value)
            }
          >

            {[
  "Relaxing",
  "Adventure",
  "Nature",
  "Luxury",
  "Romantic",
  "Cultural"
].map((mood) => (

              <option
                className="text-night"
                key={mood}
                value={mood}
              >
                {mood}
              </option>
            ))}

          </select>

        </motion.label>

        <motion.label
          variants={fadeUp}
          className="md:col-span-2"
        >

          <span className="label">
            Interests
          </span>

         <input
  className="input"
  placeholder="e.g. mountains, photography, cafes, nature"
  value={preferences.interests}
  onChange={(e) =>
    update("interests", e.target.value)
  }
/>

        </motion.label>

        <motion.label variants={fadeUp}>

          <span className="label">
            Hotel style
          </span>

          <select
            className="input"
            value={preferences.hotel_type}
            onChange={(e) =>
              update("hotel_type", e.target.value)
            }
          >

            {[
              "budget",
              "workcation",
              "family",
              "luxury",
              "backpacking"
            ].map((style) => (

              <option
                className="text-night"
                key={style}
                value={style}
              >
                {style}
              </option>
            ))}

          </select>

        </motion.label>

      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="btn-primary mt-5 w-full disabled:opacity-60"
      >

        {loading
          ? "Generating..."
          : "Find Matching Destinations"}

      </motion.button>

    </motion.form>
  );
}