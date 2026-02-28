import Link from "next/link";
import { PenLine } from "lucide-react";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 shadow-sm">
        <PenLine className="h-4 w-4 text-accent" />
        <span className="text-sm text-muted">AI-Powered Writing</span>
      </div>

      <h1 className="font-serif max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
        Write with clarity.
        <br />
        <span className="text-accent">Powered by knowledge.</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        Inkwell is your AI writing companion. Add reference materials, let AI
        help you draft and refine, and produce beautiful documents effortlessly.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/auth"
          className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-light hover:shadow-md"
        >
          Get Started
        </Link>
        <a
          href="#features"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted-bg"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
