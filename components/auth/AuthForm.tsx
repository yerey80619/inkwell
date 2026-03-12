"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { authFormVariants, authItemVariants } from "@/lib/animations";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
      router.push("/dashboard");
    } catch (err) {
      setError(
        step === "signIn"
          ? "Invalid email or password."
          : "Could not create account. The email may already be in use."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        variants={authFormVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8 text-center" variants={authItemVariants}>
          <div className="mb-4 flex items-center justify-center gap-2">
            <PenLine className="h-6 w-6 text-accent" />
            <span className="font-serif text-2xl font-bold">Inkwell</span>
          </div>
          <p className="text-muted">
            {step === "signIn"
              ? "Welcome back. Sign in to continue."
              : "Create an account to get started."}
          </p>
        </motion.div>

        <motion.div
          className="rounded-[32px] border border-border bg-surface p-8 shadow-raised"
          variants={authItemVariants}
        >
          <div className="mb-6 flex rounded-xl border border-border p-1">
            <button
              type="button"
              onClick={() => {
                setStep("signIn");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                step === "signIn"
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("signUp");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                step === "signUp"
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>

            <input name="flow" type="hidden" value={step} />

            {error && (
              <motion.p
                className="text-sm text-red-600"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="accent"
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {step === "signIn" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
