import { Sparkles, BookOpen, Type } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Writing Assistant",
    description:
      "Chat with AI that understands your document and references. Get suggestions, drafts, and edits in real time.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Context",
    description:
      "Add reference materials and notes as knowledge. The AI uses them to write more informed, accurate content.",
  },
  {
    icon: Type,
    title: "Rich Text Editing",
    description:
      "A beautiful, distraction-free editor with formatting controls. Headings, lists, quotes, and more.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif mb-4 text-center text-3xl font-bold">
          Everything you need to write well
        </h2>
        <p className="mb-16 text-center text-muted">
          A focused writing environment that brings AI and your knowledge together.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-serif mb-2 text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
