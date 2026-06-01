import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "demo@travel.ai", password: "password123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Create an account first.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-[min(520px,calc(100%-32px))] items-center pt-24">
      <form onSubmit={submit} className="glass w-full rounded-lg p-7">
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-white/60">Log in to view saved trips and favorites.</p>
        {error && <p className="mt-4 rounded-lg bg-coral/20 p-3 text-sm text-coral">{error}</p>}
        <label className="mt-6 block">
          <span className="label">Email</span>
          <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="mt-4 block">
          <span className="label">Password</span>
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm text-white/60">
          New here? <Link to="/signup" className="font-bold text-aqua">Create account</Link>
        </p>
      </form>
    </main>
  );
}
