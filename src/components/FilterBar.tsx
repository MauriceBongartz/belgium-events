"use client";

import { CATEGORIES } from "@/lib/types";

interface FilterBarProps {
  selectedCategory: string;
  selectedTime: string;
  onCategoryChange: (cat: string) => void;
  onTimeChange: (time: string) => void;
}

const TIME_FILTERS = [
  { value: "all", label: "All dates" },
  { value: "upcoming", label: "Upcoming" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
];

export default function FilterBar({
  selectedCategory,
  selectedTime,
  onCategoryChange,
  onTimeChange,
}: FilterBarProps) {
  return (
    <div className="border-b border-belgium-border pb-6 mb-8">
      {/* Category filters */}
      <div className="mb-4">
        <p className="label mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
              selectedCategory === "all"
                ? "border-gold-500 text-gold-400 bg-gold-950/30"
                : "border-belgium-border text-belgium-muted hover:border-gold-700 hover:text-gold-600"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                selectedCategory === cat
                  ? "border-gold-500 text-gold-400 bg-gold-950/30"
                  : "border-belgium-border text-belgium-muted hover:border-gold-700 hover:text-gold-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Time filters */}
      <div>
        <p className="label mb-3">Time</p>
        <div className="flex flex-wrap gap-2">
          {TIME_FILTERS.map((t) => (
            <button
              key={t.value}
              onClick={() => onTimeChange(t.value)}
              className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                selectedTime === t.value
                  ? "border-gold-500 text-gold-400 bg-gold-950/30"
                  : "border-belgium-border text-belgium-muted hover:border-gold-700 hover:text-gold-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
