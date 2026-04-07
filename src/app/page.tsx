"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Event } from "@/lib/types";
import EventCard from "@/components/EventCard";
import FilterBar from "@/components/FilterBar";
import Navbar from "@/components/Navbar";
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO
} from "date-fns";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (!error && data) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    return events.filter((e) => {
      // Category filter
      if (category !== "all" && e.category !== category) return false;

      // Time filter
      const d = parseISO(e.date);
      if (timeFilter === "upcoming" && d < now) return false;
      if (timeFilter === "this-week") {
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        if (d < start || d > end) return false;
      }
      if (timeFilter === "this-month") {
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        if (d < start || d > end) return false;
      }

      return true;
    });
  }, [events, category, timeFilter]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="border-b border-belgium-border">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="section-tag">Belgium · Events</div>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4">
                What&apos;s happening
                <br />
                <span className="text-gold-500">in Belgium</span>
              </h1>
              <p className="text-belgium-muted text-lg max-w-xl">
                Discover concerts, festivals, cultural happenings, and more across Belgium.
              </p>
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <FilterBar
            selectedCategory={category}
            selectedTime={timeFilter}
            onCategoryChange={setCategory}
            onTimeChange={setTimeFilter}
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-belgium-border rounded mb-4 w-1/3" />
                  <div className="h-6 bg-belgium-border rounded mb-3" />
                  <div className="h-4 bg-belgium-border rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🇧🇪</div>
              <p className="font-display text-xl text-belgium-muted mb-2">No events found</p>
              <p className="text-sm text-belgium-border">
                {events.length === 0 ? "Check back soon — events coming!" : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-xs text-belgium-muted uppercase tracking-widest">
                  {filtered.length} event{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-belgium-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-4 bg-black border border-gold-900" />
            <div className="w-1.5 h-4 bg-gold-500" />
            <div className="w-1.5 h-4 bg-red-600" />
            <span className="ml-2 font-mono text-xs text-belgium-muted">Belgium Events</span>
          </div>
          <p className="font-mono text-xs text-belgium-border">
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
