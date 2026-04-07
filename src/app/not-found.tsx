import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-mono text-8xl font-bold text-belgium-border mb-4">404</div>
        <h1 className="font-display text-2xl font-bold mb-3">Event not found</h1>
        <p className="text-belgium-muted mb-8">This event doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="btn-gold">
          Back to events
        </Link>
      </div>
    </main>
  );
}
