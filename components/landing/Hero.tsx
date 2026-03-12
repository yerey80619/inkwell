"use client";

import Link from "next/link";
import { PenLine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { heroStaggerVariants, heroItemVariants } from "@/lib/animations";

export function Hero() {
  return (
    <motion.section
      className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center"
      variants={heroStaggerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 shadow-soft"
        variants={heroItemVariants}
      >
        <PenLine className="h-4 w-4 text-accent" />
        <span className="text-sm text-muted">AI-Powered Writing</span>
      </motion.div>

      <motion.h1
        className="font-serif max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl"
        variants={heroItemVariants}
      >
        Write with clarity.
        <br />
        <span className="text-accent">Powered by knowledge.</span>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
        variants={heroItemVariants}
      >
        Inkwell is your AI writing companion. Add reference materials, let AI
        help you draft and refine, and produce beautiful documents effortlessly.
      </motion.p>

      <motion.div
        className="mt-10 flex items-center gap-4"
        variants={heroItemVariants}
      >
        <Button asChild withSparkles>
          <Link href="/auth">
            Get Started
            <Sparkles 
              size={16} 
              className="ml-2 text-white/70 group-hover:text-white group-hover:rotate-12 transition-all duration-300" 
            />
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <a href="#features">
            Learn More
          </a>
        </Button>
      </motion.div>
    </motion.section>
  );
}
