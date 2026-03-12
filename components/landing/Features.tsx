"use client";

import { Sparkles, BookOpen, Type } from "lucide-react";
import { motion } from "framer-motion";
import { featureCardVariants } from "@/lib/animations";

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
        <motion.h2
          className="font-serif mb-4 text-center text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 250, damping: 24 }}
        >
          Everything you need to write well
        </motion.h2>
        <motion.p
          className="mb-16 text-center text-muted"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 250, damping: 24, delay: 0.1 }}
        >
          A focused writing environment that brings AI and knowledge together.
        </motion.p>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="rounded-2xl border border-border bg-surface p-8 shadow-soft transition-shadow hover:shadow-medium"
              variants={featureCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
