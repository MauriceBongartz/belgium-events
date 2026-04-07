import Link from "next/link";
import { format } from "date-fns";
import { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <Link href={`/event/${event.id}`} className="block group">
      <article
        className="event-card card opacity-0 animate-fade-up cursor-pointer"
        style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Date block */}
          <div className="shrink-0 text-center border border-belgium-border p-3 min-w-[56px]">
            <div className="font-mono text-xs text-gold-500 uppercase tracking-wider">
              {format(eventDate, "MMM")}
            </div>
            <div className="font-display text-2xl font-bold leading-none mt-0.5">
              {format(eventDate, "dd")}
            </div>
            <div className="font-mono text-xs text-belgium-muted mt-0.5">
              {format(eventDate, "yyyy")}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-end">
            <span className="category-badge">{event.category}</span>
            {isPast && (
              <span className="font-mono text-xs uppercase tracking-wider px-2 py-1 bg-belgium-black border border-red-900 text-red-700">
                Past
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-gold-400 transition-colors leading-snug">
          {event.title}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-belgium-muted text-sm">
          <svg className="w-3.5 h-3.5 shrink-0 text-gold-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{event.location}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 text-belgium-muted text-sm mt-1.5">
          <svg className="w-3.5 h-3.5 shrink-0 text-gold-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{format(eventDate, "EEEE, MMMM d · HH:mm")}</span>
        </div>

        {/* Arrow */}
        <div className="mt-4 flex items-center gap-1 text-gold-700 text-xs font-mono uppercase tracking-widest 
                        group-hover:text-gold-400 group-hover:gap-2 transition-all">
          <span>View event</span>
          <span>→</span>
        </div>
      </article>
    </Link>
  );
}
