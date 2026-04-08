"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

interface ReviewSectionProps {
  eventId: string;
  initialReviews: Review[];
}

export default function ReviewSection({ eventId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(0);

  const supabase = createClient();

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: err } = await supabase
      .from("reviews")
      .insert([{ event_id: eventId, author_name: name.trim(), rating, comment: comment.trim() }])
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else {
      setReviews([data, ...reviews]);
      setName("");
      setRating(5);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
    setSubmitting(false);
  };

  return (
    <div className="border-t border-belgium-border pt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label">Reviews</p>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl font-bold">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
            {avgRating && (
              <span className="text-gold-400 font-mono text-sm">
                ★ {avgRating} / 5
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Existing reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="border border-belgium-border p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-sm">{review.author_name}</p>
                  <p className="font-mono text-xs text-belgium-muted mt-0.5">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-gold-400 font-mono text-sm shrink-0">
                  {"★".repeat(review.rating)}
                  <span className="text-belgium-border">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write a review form */}
      <div className="border border-belgium-border p-6">
        <p className="label mb-5">Write a review</p>

        {success && (
          <div className="border border-green-800 bg-green-950/30 px-4 py-3 mb-5 font-mono text-sm text-green-400">
            ✓ Review posted — thank you!
          </div>
        )}
        {error && (
          <div className="border border-red-800 bg-red-950/30 px-4 py-3 mb-5 font-mono text-sm text-red-400">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Your name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Marie Dupont"
              required
            />
          </div>

          {/* Star rating */}
          <div>
            <label className="label">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <span className={
                    star <= (hovered || rating) ? "text-gold-400" : "text-belgium-border"
                  }>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 font-mono text-xs text-belgium-muted self-center">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][hovered || rating]}
              </span>
            </div>
          </div>

          <div>
            <label className="label">Comment *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="Share your experience…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full"
          >
            {submitting ? "Posting…" : "Post Review →"}
          </button>
        </form>
      </div>
    </div>
  );
}
