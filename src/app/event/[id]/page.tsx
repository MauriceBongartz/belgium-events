import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("@/components/EventMap"), { ssr: false });

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) notFound();

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-belgium-muted hover:text-gold-400 transition-colors mb-8"
          >
            <span>←</span>
            <span>All events</span>
          </Link>

          {/* Header */}
          <div className="border-b border-belgium-border pb-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="category-badge">{event.category}</span>
              {isPast && (
                <span className="font-mono text-xs uppercase tracking-wider px-2 py-1 bg-belgium-black border border-red-900 text-red-700">
                  Past event
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
              {event.title}
            </h1>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-belgium-border p-4">
                <p className="label">Date & Time</p>
                <p className="font-display text-lg font-semibold">
                  {format(eventDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-gold-500 font-mono text-sm mt-1">
                  {format(eventDate, "HH:mm")}
                </p>
              </div>

              <div className="border border-belgium-border p-4">
                <p className="label">Location</p>
                <p className="font-display text-lg font-semibold leading-snug">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <p className="label mb-4">About this event</p>
            <div className="prose prose-invert max-w-none">
              {event.description.split("\n").map((para: string, i: number) => (
                <p key={i} className="text-gray-300 leading-relaxed mb-4">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Map */}
          {event.latitude && event.longitude && (
            <div className="mb-8">
              <p className="label mb-4">Location on map</p>
              <EventMap
                latitude={event.latitude}
                longitude={event.longitude}
                title={event.title}
              />
              <p className="font-mono text-xs text-belgium-muted mt-2">
                {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* Footer meta */}
          <div className="border-t border-belgium-border pt-6">
            <p className="font-mono text-xs text-belgium-border">
              Added {format(new Date(event.created_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
