"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/types";
import Navbar from "@/components/Navbar";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
};

type FormState = {
  title: string;
  description: string;
  date: string;
  location: string;
  latitude: string;
  longitude: string;
  category: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  date: "",
  location: "",
  latitude: "",
  longitude: "",
  category: "Music",
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Form state
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");

  // Events list
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingUser(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch events when admin is logged in
  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    const { data } = await supabase
      .from("events")
      .select("id, title, date, location, category")
      .order("date", { ascending: true });
    setEvents(data ?? []);
    setLoadingEvents(false);
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ── CREATE EVENT ───────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      location: form.location.trim(),
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      category: form.category,
    };

    const { error } = await supabase.from("events").insert([payload]);

    if (error) {
      setFormError(error.message);
    } else {
      setSuccessMsg(`"${payload.title}" has been published!`);
      setForm(EMPTY_FORM);
      fetchEvents();
    }
    setSubmitting(false);
  };

  // ── DELETE EVENT ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert("Error deleting event: " + error.message);
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
    setDeletingId(null);
  };

  // ── RENDER STATES ──────────────────────────────────────────────────────────
  if (loadingUser) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="font-mono text-sm text-belgium-muted animate-pulse">Loading…</div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="section-tag">Admin access</div>
            <h1 className="font-display text-3xl font-bold mb-8">Sign in</h1>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <p className="font-mono text-xs text-red-500 border border-red-900 px-3 py-2">
                  {loginError}
                </p>
              )}

              <button type="submit" disabled={loginLoading} className="btn-gold w-full">
                {loginLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </main>
      </>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-6">🚫</div>
            <div className="section-tag">Access denied</div>
            <h1 className="font-display text-3xl font-bold mb-3">Not authorised</h1>
            <p className="text-belgium-muted mb-6 text-sm">
              You are signed in as <span className="text-white">{user.email}</span>, but only the admin may access this page.
            </p>
            <button onClick={handleLogout} className="btn-outline">Sign out</button>
          </div>
        </main>
      </>
    );
  }

  // ── ADMIN DASHBOARD ────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="section-tag">Admin panel</div>
              <h1 className="font-display text-3xl font-bold">Manage Events</h1>
              <p className="text-belgium-muted text-sm mt-1">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="btn-outline text-sm px-4 py-2">
              Sign out
            </button>
          </div>

          {/* Success */}
          {successMsg && (
            <div className="border border-green-800 bg-green-950/30 px-4 py-3 mb-6 font-mono text-sm text-green-400">
              ✓ {successMsg}
            </div>
          )}

          {/* Error */}
          {formError && (
            <div className="border border-red-800 bg-red-950/30 px-4 py-3 mb-6 font-mono text-sm text-red-400">
              ✗ {formError}
            </div>
          )}

          {/* ── EXISTING EVENTS ── */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4">Your Events</h2>
            {loadingEvents ? (
              <p className="font-mono text-xs text-belgium-muted animate-pulse">Loading events…</p>
            ) : events.length === 0 ? (
              <p className="font-mono text-xs text-belgium-muted">No events yet.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between border border-belgium-border px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-sm">{event.title}</p>
                      <p className="font-mono text-xs text-belgium-muted mt-0.5">
                        {new Date(event.date).toLocaleDateString("en-BE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {event.location} · {event.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      disabled={deletingId === event.id}
                      className="ml-4 text-xs font-mono text-red-500 border border-red-900 px-3 py-1 hover:bg-red-950/40 transition-colors disabled:opacity-50"
                    >
                      {deletingId === event.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── CREATE FORM ── */}
          <h2 className="font-display text-xl font-bold mb-6">Create New Event</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="e.g. Jazz Night at Ancienne Belgique"
                required
              />
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field min-h-[140px] resize-y"
                placeholder="Describe your event…"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input-field"
                placeholder="e.g. Ancienne Belgique, Brussels"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label">Latitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  className="input-field"
                  placeholder="50.8503"
                />
              </div>
              <div>
                <label className="label">Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  className="input-field"
                  placeholder="4.3517"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-4 text-base"
              >
                {submitting ? "Publishing…" : "Publish Event →"}
              </button>
            </div>
          </form>

          <div className="mt-6 border border-belgium-border p-4">
            <p className="font-mono text-xs text-belgium-muted mb-2 uppercase tracking-widest">Tip — finding coordinates</p>
            <p className="text-xs text-belgium-border leading-relaxed">
              Right-click any location on{" "}
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-400">
                Google Maps
              </a>{" "}
              and select &quot;What&apos;s here?&quot; to get the exact coordinates.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
