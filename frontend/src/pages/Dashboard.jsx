import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authService.dashboard().then(setData).catch((err) => setError(err.response?.data?.message || "Could not load dashboard"));
  }, []);

  return (
    <main className="mx-auto w-[min(1180px,calc(100%-32px))] pt-28 pb-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-black text-aqua">User dashboard</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">Welcome back, Traveler.</h1>
          <p className="mt-3 text-white/60">
  Plan, organize and save your dream trips with WayfareWise.
</p>
        </div>
        <Link to="/planner" className="btn-primary">Plan New Trip</Link>
      </div>
      {error && <p className="rounded-lg bg-coral/20 p-4 text-coral">{error}</p>}
      {!data ? (
        <div className="soft-card h-80 animate-pulse rounded-lg" />
      ) : (
        <div className="grid gap-5">
          <section className="grid gap-5 lg:grid-cols-3">
            {Object.entries(data.stats).map(([label, value]) => (
              <article
  key={label}
  className="glass rounded-lg p-5 hover:scale-[1.02] transition"
>
                <p className="text-sm uppercase text-white/50">{label.replace("_", " ")}</p>
                <p className="mt-2 text-5xl font-black text-aqua">{value}</p>
              </article>
            ))}
          </section>
         <section className="grid gap-5 lg:grid-cols-2">

  <DashboardPanel title="Saved Trips">
    {data.saved_trips.length ? data.saved_trips.map((trip) => (
      <div
  key={trip.id}
  className="rounded-lg bg-white/10 p-4"
>
  <h3 className="font-black text-lg">
    🧳 {trip.trip?.selected?.name || "Saved Trip"}
  </h3>

  <p className="mt-2 text-sm text-white/60">
    
  </p>
</div>
    )) : <Empty text="No saved trips yet." />}
  </DashboardPanel>

  <DashboardPanel title="Travel Insights">

  <div className="rounded-lg bg-white/10 p-4">
    <p className="text-white/60 text-sm">
      Most Recent Trip
    </p>
    <p className="font-black text-lg">
      {data.saved_trips[0]?.trip?.selected?.name || "None Yet"}
    </p>
  </div>

  <div className="rounded-lg bg-white/10 p-4">
    <p className="text-white/60 text-sm">
      Trips Planned
    </p>
    <p className="font-black text-lg">
      {data.saved_trips.length}
    </p>
  </div>

  <div className="rounded-lg bg-white/10 p-4">
    <p className="text-white/60 text-sm">
      AI Travel Planning
    </p>
    <p className="font-black text-lg text-aqua">
      Active
    </p>
  </div>

</DashboardPanel>

</section>
        </div>
      )}
    </main>
  );
}

function DashboardPanel({ title, children }) {
  return (
    <section className="glass rounded-lg p-5">
      <h2 className="mb-4 text-2xl font-black">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function Empty({ text }) {
  return <p className="rounded-lg bg-white/10 p-3 text-sm text-white/55">{text}</p>;
}
