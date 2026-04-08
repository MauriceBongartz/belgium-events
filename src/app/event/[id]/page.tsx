"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const EventMap = dynamic(() => import("@/components/EventMap"), { ssr: false });

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

function StarRating({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={onRate ? "button" : undefined}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onRate && setHovered(star)}
          onMouseLeave={() => onRate && setHovered(0)}
          className={`text-2xl transition-colors ${
            star <= (hovered || rating)
              ? "text-yellow-400"
              : "text-gray-600"
          } ${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review form
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchEvent();
    fetchReviews();
  }, [id]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) {
      setEvent(null);
    } else {
      setEvent(data);
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoadingReviews(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (rating === 0) {
      setFormError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert([
      {
        event_id: id,
        author_name: authorName.trim(),
        rating,
        comment: comment.trim(),
      },
    ]);

    if (error) {
      setFormError(error.message);
    } else {
      setSuccessMsg("Thank you for your review!");
      setAuthorName("");
      setRating(0);
      setComment("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="font-mono text-sm text-belgium-muted animate-pulse">Loading…</div>
        </main>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="font-display text-6xl font-bold text-belgium-muted mb-4">404</div>
            <h1 className="font-display text-2xl font-bold mb-2">Event not found</h1>
            <p className="text-belgium-muted mb-6 text-sm">This event doesn&apos;t exist or has been removed.</p>
            <Link href="/" className="btn-gold px-6 py-3">Back to events</Link>
          </div>
        </main>
      </>
    );
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

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

            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="font-display text-lg font-bold">{avgRating}</span>
                <span className="text-belgium-muted text-sm font-mono">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
              </div>
            )}

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
                <p key={i} className="text-gray-300 leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          </div>

          {/* Map */}
          {event.latitude && event.longitude && (
            <div className="mb-8">
              <p className="label mb-4">Location on map</p>
              <EventMap latitude={event.latitude} longitude={event.longitude} title={event.title} />
              <p className="font-mono text-xs text-belgium-muted mt-2">
                {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* ── REVIEWS SECTION ── */}
          <div className="border-t border-belgium-border pt-10 mt-10">
            <h2 className="font-display text-2xl font-bold mb-8">Reviews</h2>

            {/* Write a review */}
            <div className="border border-belgium-border p-6 mb-10">
              <h3 className="font-display text-lg font-semibold mb-5">Write a review</h3>

              {successMsg && (
                <div className="border border-green-800 bg-green-950/30 px-4 py-3 mb-5 font-mono text-sm text-green-400">
                  ✓ {successMsg}
                </div>
              )}
              {formError && (
                <div className="border border-red-800 bg-red-950/30 px-4 py-3 mb-5 font-mono text-sm text-red-400">
                  ✗ {formError}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="label">Your name *</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Marie"
                    required
                  />
                </div>

                <div>
                  <label className="label">Rating *</label>
                  <StarRating rating={rating} onRate={setRating} />
                </div>

                <div>
                  <label className="label">Your review *</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="How was the event?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full py-3"
                >
                  {submitting ? "Submitting…" : "Submit Review →"}
                </button>
              </form>
            </div>

            {/* Reviews list */}
            {loadingReviews ? (
              <p className="font-mono text-xs text-belgium-muted animate-pulse">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className="font-mono text-xs text-belgium-muted">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-belgium-border p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.author_name}</span>
                      <span className="font-mono text-xs text-belgium-muted">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-gray-300 text-sm leading-relaxed mt-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-belgium-border pt-6 mt-10">
            <p className="font-mono text-xs text-belgium-border">
              Added {format(new Date(event.created_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
