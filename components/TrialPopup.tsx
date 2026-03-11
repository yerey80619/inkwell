"use client";

import { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import {
  PenLine,
  Sparkles,
  FileText,
  BookOpen,
  Headphones,
  Loader2,
  CheckCircle2,
  LogOut,
} from "lucide-react";

const CHECKOUT_LINK =
  "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_CeymxKF5b2QpImBJPAZb8Rf29Kl65q2z6ucM31QnP4W/redirect";

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing Assistant",
    description: "Get intelligent suggestions and chat-based help as you write.",
  },
  {
    icon: FileText,
    title: "Unlimited Documents",
    description: "Create as many documents as you need with no restrictions.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description:
      "Add reference material so the AI understands your context and style.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get help when you need it with dedicated priority support.",
  },
];

interface TrialPopupProps {
  userEmail?: string;
}

import { Button } from "@/components/ui/Button";

export function TrialPopup({ userEmail }: TrialPopupProps) {
  const { signOut } = useAuthActions();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutInstance, setCheckoutInstance] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (checkoutInstance) {
        checkoutInstance.close();
      }
    };
  }, [checkoutInstance]);

  useEffect(() => {
    if (!checkoutSuccess) return;
    // Convex reactivity will auto-update the subscription query and unmount
    // this component. Reload is a fallback in case the webhook is slow.
    const timeout = setTimeout(() => {
      window.location.reload();
    }, 30000);
    return () => clearTimeout(timeout);
  }, [checkoutSuccess]);

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/dashboard`;
      const params = new URLSearchParams();
      if (userEmail) params.set("customer_email", userEmail);
      params.set("success_url", successUrl);

      const url = `${CHECKOUT_LINK}?${params.toString()}`;

      const checkout = await PolarEmbedCheckout.create(url, {
        theme: "light",
      });

      setCheckoutInstance(checkout);
      setCheckoutOpen(true);

      checkout.addEventListener("success", () => {
        setCheckoutOpen(false);
        setCheckoutInstance(null);
        setCheckoutSuccess(true);
      });

      checkout.addEventListener("close", () => {
        setCheckoutOpen(false);
        setCheckoutInstance(null);
      });
    } catch (error) {
      console.error("Failed to open checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-[32px] border border-border bg-surface p-8 shadow-raised text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-accent mb-4" />
          <h2 className="font-serif text-xl font-semibold">
            Payment successful!
          </h2>
          <p className="mt-2 text-sm text-muted">
            Setting up your subscription. You&apos;ll be redirected to your
            dashboard momentarily&hellip;
          </p>
          <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-muted" />
        </div>
      </div>
    );
  }

  if (checkoutOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-[32px] border border-border bg-surface p-8 shadow-raised">
        <div className="mb-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <PenLine className="h-6 w-6 text-accent" />
            <span className="font-serif text-2xl font-bold">Inkwell</span>
          </div>
          <h2 className="font-serif text-xl font-semibold">
            Start your free trial
          </h2>
          <p className="mt-1 text-sm text-muted">
            Unlock the full power of AI-assisted writing.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted-bg text-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{benefit.title}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 rounded-xl bg-muted-bg px-4 py-3 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-serif text-3xl font-bold">$19</span>
            <span className="text-sm text-muted">/mo</span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Cancel anytime. No commitment.
          </p>
        </div>

        <Button
          onClick={handleStartTrial}
          disabled={loading}
          variant="accent"
          className="w-full"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Start free trial
        </Button>

        <button
          onClick={() => void signOut()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
