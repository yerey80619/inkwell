import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import Link from "next/link";
import { PenLine } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-accent" />
          <span className="font-serif text-xl font-bold">Inkwell</span>
        </div>
        <Link
          href="/auth"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted-bg"
        >
          Sign In
        </Link>
      </nav>

      <Hero />
      <Features />

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Inkwell. Write beautifully.</p>
      </footer>
    </div>
  );
}
