import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

import {
  detailReveal,
  fadeUp,
  pageFade,
  stagger
} from "../animations/variants.js";

import ChatAssistant from "../components/ChatAssistant.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import HotelCard from "../components/HotelCard.jsx";
import MapPanel from "../components/MapPanel.jsx";
import PlannerForm from "../components/PlannerForm.jsx";
import Skeleton from "../components/Skeleton.jsx";
import WeatherCard from "../components/WeatherCard.jsx";

import { useAuth } from "../context/AuthContext.jsx";

import { authService } from "../services/authService";
import { travelService } from "../services/travelService";

import { money } from "../utils/formatters.js";

const initialPreferences = {
  from_city: "Delhi",
  budget: "15000",
  days: "3",
  interests: "",
  season: "winter",
  group_type: "friends",
  mood: "relaxing",
  hotel_type: "budget"
};

export default function Planner() {

  const { isAuthed } = useAuth();

  const [preferences, setPreferences] = useState(
    initialPreferences
  );

  const [recommendations, setRecommendations] = useState([]);
  const [selected, setSelected] = useState(null);

  const [mapData, setMapData] = useState(null);

  const [itinerary, setItinerary] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [weather, setWeather] = useState(null);

  const [gems, setGems] = useState([]);

  const [budget, setBudget] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  async function generate(event) {

    event.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      console.log(
        "Sending preferences:",
        preferences
      );

      const data =
        await travelService.recommendations(
          preferences
        );

      setRecommendations(
        data.recommendations
      );

      setMapData(data.map);

 

    } catch (error) {

      setMessage(
        "Start the Flask backend on port 5000, then generate again."
      );

    } finally {

      setLoading(false);
    }
  }

  async function selectDestination(
    destination,
    scroll = true
  ) {

    setSelected(destination);

    const [
      planData,
      hotelsData,
      weatherData,
      gemsData,
      budgetData
    ] = await Promise.all([

      travelService.itinerary({
        ...preferences,
        destination_id: destination.id
      }),

      travelService.hotels(
        destination.id,
        preferences
      ),

      travelService.weather(
        destination.id
      ),

      travelService.hiddenGems(
        destination.id
      ),

      travelService.budget(
        destination.id,
        preferences
      )

    ]);
    console.log("PLAN DATA =", planData);

    setItinerary(
      planData?.itinerary || planData || []
    );

    setMapData(
      planData?.map ?? mapData
    );

    setHotels(
      hotelsData?.hotels || []
    );

    setWeather(
      weatherData.weather
    );

    setGems(
      gemsData?.hidden_gems || []
    );

    setBudget(
      budgetData || { breakdown: {} }
    );

    if (scroll) {

      document
        .querySelector("#trip-detail")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }
  }

  async function saveFavorite(name) {

    if (!isAuthed) {

      setMessage(
        "Login first to save favorites."
      );

      return;
    }

    await authService.favorite(name);

    setMessage(
      `${name} saved to favorites.`
    );
  }

  async function saveTrip() {

    if (!isAuthed) {

      setMessage(
        "Login first to save this trip."
      );

      return;
    }

    await travelService.saveTrip({
      selected,
      itinerary,
      hotels,
      budget
    });

    setMessage(
      "Trip saved to your dashboard."
    );
  }

  return (

    <motion.main
      variants={pageFade}
      initial="hidden"
      animate="show"
      className="mx-auto w-[min(1180px,calc(100%-32px))] pt-28 pb-16"
    >

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-8"
      >

        <motion.p
          variants={fadeUp}
          className="font-black text-aqua"
        >
          Planner workspace
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-2 text-4xl font-black md:text-6xl"
        >
          Build an AI-personalized trip.
        </motion.h1>

      </motion.div>

      <LayoutGroup>

        <motion.div
          layout
          className="grid gap-5 lg:grid-cols-[420px_1fr]"
        >

          <motion.div
            layout
            className="space-y-5"
          >

            <PlannerForm
              preferences={preferences}
              setPreferences={setPreferences}
              onSubmit={generate}
              loading={loading}
            />

            <ChatAssistant
              preferences={preferences}
              onResults={setRecommendations}
            />

          </motion.div>

          <motion.div
            layout
            className="space-y-5"
          >

            <AnimatePresence mode="popLayout">

              {message && (

                <motion.div
                  key="message"
                  initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.98
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: -8
                  }}
                  className="rounded-lg bg-coral/20 p-4 text-coral"
                >

                  {message}

                </motion.div>
              )}

            </AnimatePresence>

            <AnimatePresence mode="wait">

              {loading ? (

                <motion.div
                  key="loading"
                  variants={detailReveal}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >

                  <Skeleton />

                </motion.div>

              ) : recommendations.length ? (

                <motion.div
                  key="results"
                  layout
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  className="grid gap-5 xl:grid-cols-2"
                >

                  {recommendations.map(
                    (destination) => (

                      <DestinationCard
                        key={destination.id}
                        destination={destination}
                        onSelect={selectDestination}
                        onFavorite={saveFavorite}
                      />
                    )
                  )}

                </motion.div>

              ) : (

                <motion.div
                  key="empty"
                  variants={detailReveal}
                  initial="hidden"
                  animate="show"
                  exit={{
                    opacity: 0,
                    y: 10
                  }}
                  className="glass rounded-lg p-8"
                >

                  <h2 className="text-2xl font-black">
                    Ready when you are.
                  </h2>

                  <p className="mt-2 text-white/60">
                    Get personalized travel recommendations and
build a complete itinerary in seconds.
                  </p>

                </motion.div>
              )}

            </AnimatePresence>

          </motion.div>

        </motion.div>

        {selected && (

          <motion.section
            layout
            variants={detailReveal}
            initial="hidden"
            animate="show"
            id="trip-detail"
            className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"
          >

            <motion.div
              layout
              className="space-y-5"
            >

              <MapPanel map={mapData}
 />

              <WeatherCard weather={weather} />

              <motion.section
                layout
                className="glass rounded-lg p-5"
              >

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>

                    <p className="font-black text-aqua">
                      AI itinerary
                    </p>

                    <h2 className="text-3xl font-black">
                      {selected.name}
                    </h2>

                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={saveTrip}
                    className="btn-primary"
                  >
                    Save Trip
                  </motion.button>

                </div>

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="mt-5 grid gap-4"
                >

                    {itinerary?.map((day) => (

                      <motion.article
                        variants={fadeUp}
                        whileHover={{ x: 4 }}
                        key={day.day}
                        className="rounded-lg bg-white/10 p-4"
                      >

                        <p className="font-black text-coral">
                          Day {day.day}
                        </p>

                        <h3 className="text-xl font-black">
                          {day.title}
                        </h3>

                        <div className="mt-3 grid gap-2 text-sm text-white/68">

                          <p>
                            <strong className="text-white">
                              Morning:
                            </strong>{" "}
                            {day.morning}
                          </p>

                          <p>
                            <strong className="text-white">
                              Afternoon:
                            </strong>{" "}
                            {day.afternoon}
                          </p>

                          <p>
                            <strong className="text-white">
                              Evening:
                            </strong>{" "}
                            {day.evening}
                          </p>

                        </div>

                      </motion.article>
                    ))}

                  </motion.div>

                </motion.section>

              </motion.div>

              <motion.aside
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-5"
              >

                <motion.section
                  variants={fadeUp}
                  className="glass rounded-lg p-5"
                >

                  <h2 className="text-2xl font-black">
                    Budget Optimization
                  </h2>

                  {budget && (

                    <div className="mt-4 grid gap-2 text-sm">

                      {Object.entries(
                        budget?.breakdown || {}
                      )
                        .filter(
                          ([key]) =>
                            key !== "savings_tip"
                        )
                        .map(([key, value]) => (

                          <motion.div
                            whileHover={{ x: 4 }}
                            key={key}
                            className="flex justify-between rounded-lg bg-white/10 p-3"
                          >

                            <span className="capitalize text-white/60">
                              {key}
                            </span>

                            <strong>
                              {money(value)}
                            </strong>

                          </motion.div>
                        ))}

                      <p className="mt-2 text-aqua">
                        {budget?.breakdown?.savings_tip}
                      </p>

                    </div>
                  )}

                </motion.section>

                <motion.section
                  variants={fadeUp}
                  className="glass rounded-lg p-5"
                >

                  <h2 className="text-2xl font-black">
                    Hotels
                  </h2>

                  <div className="mt-4 grid gap-3">

  {hotels?.length > 0 ? (
    hotels.map((hotel) => (
      <HotelCard
        key={hotel.name}
        hotel={hotel}
      />
    ))
  ) : (
    <div className="rounded-lg bg-white/10 p-6 text-center">
      <div className="text-4xl mb-3">🏨</div>
      <h3 className="font-black text-lg">
        Coming Soon
      </h3>
      <p className="text-white/60 mt-2">
        Hotel recommendations will be available in a future update.
      </p>
    </div>
  )}

</div>

                </motion.section>

                <motion.section
                  variants={fadeUp}
                  className="glass rounded-lg p-5"
                >

                  <h2 className="text-2xl font-black">
                    Hidden Gems
                  </h2>

                  <div className="mt-4 grid gap-3">

  {gems?.length > 0 ? (
    gems.map((gem) => (
      <motion.div
        whileHover={{ x: 4 }}
        key={gem.name}
        className="rounded-lg bg-white/10 p-3"
      >
        <p className="font-black">
          {gem.name}
        </p>

        <p className="text-sm text-white/60">
          {gem.reason}
        </p>
      </motion.div>
    ))
  ) : (
    <div className="rounded-lg bg-white/10 p-6 text-center">
      <div className="text-4xl mb-3">💎</div>
      <h3 className="font-black text-lg">
        Coming Soon
      </h3>
      <p className="text-white/60 mt-2">
        Hidden gem recommendations will be available in a future update.
      </p>
    </div>
  )}

</div>

                </motion.section>

              </motion.aside>

            </motion.section>
          )}

        </LayoutGroup>

      </motion.main>
    );
  }
