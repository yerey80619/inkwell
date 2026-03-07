"use client";

import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { AccountDropdown } from "@/components/AccountDropdown";
import { PenLine, ArrowLeft, Loader2, Check } from "lucide-react";

function RedirectToAuth() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth");
  }, [router]);
  return null;
}

function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const subscription = useQuery(api.subscriptions.getMySubscription);

  const hasAccess =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  useEffect(() => {
    if (subscription !== undefined && !hasAccess) {
      router.replace("/dashboard");
    }
  }, [subscription, hasAccess, router]);

  if (subscription === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}

import { Button } from "@/components/ui/Button";

function ProfileContent() {
  const router = useRouter();
  const user = useQuery(api.users.currentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const globalInstructions = useQuery(api.systemInstructions.getGlobal);
  const saveGlobalInstructions = useMutation(api.systemInstructions.saveGlobal);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [instructions, setInstructions] = useState("");
  const [instructionsInitialized, setInstructionsInitialized] = useState(false);
  const [savingInstructions, setSavingInstructions] = useState(false);
  const [savedInstructions, setSavedInstructions] = useState(false);

  useEffect(() => {
    if (user && !initialized) {
      setName(user.name || "");
      setEmail((user.email as string) || "");
      setInitialized(true);
    }
  }, [user, initialized]);

  useEffect(() => {
    if (globalInstructions !== undefined && !instructionsInitialized) {
      setInstructions(globalInstructions?.instructions || "");
      setInstructionsInitialized(true);
    }
  }, [globalInstructions, instructionsInitialized]);

  const hasChanges =
    initialized &&
    user &&
    (name !== (user.name || "") || email !== ((user.email as string) || ""));

  const hasInstructionsChanges =
    instructionsInitialized &&
    instructions !== (globalInstructions?.instructions || "");

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    try {
      await updateProfile({ name: name || undefined, email: email || undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveInstructions() {
    if (!hasInstructionsChanges) return;
    setSavingInstructions(true);
    try {
      await saveGlobalInstructions({ instructions });
      setSavedInstructions(true);
      setTimeout(() => setSavedInstructions(false), 2000);
    } finally {
      setSavingInstructions(false);
    }
  }

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-accent" />
          <span className="font-serif text-xl font-bold">Inkwell</span>
        </div>
        <AccountDropdown />
      </nav>

      <main className="mx-auto max-w-xl px-6 py-10 md:px-12">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="font-serif text-3xl font-bold">Profile</h1>
        <p className="mt-1 mb-8 text-muted">
          Manage your account details.
        </p>

        <div className="space-y-6 rounded-[20px] border border-border bg-surface p-8 shadow-soft">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              variant="accent"
              className="px-5 py-2.5 h-auto"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-accent">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </div>

        <h2 className="font-serif mt-12 text-2xl font-bold">AI Assistant Instructions</h2>
        <p className="mt-1 mb-6 text-muted">
          Set global instructions that guide the AI assistant across all your documents.
        </p>

        <div className="space-y-6 rounded-[20px] border border-border bg-surface p-8 shadow-soft">
          <div>
            <label htmlFor="global-instructions" className="mb-1.5 block text-sm font-medium text-foreground">
              Global System Instructions
            </label>
            <p className="mb-3 text-xs text-muted">
              These instructions are included in every AI conversation. Use them to set tone, style, or behavior preferences.
            </p>
            <textarea
              id="global-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Always respond in a formal tone. Keep responses concise and under 200 words. Use British English spelling."
              rows={5}
              className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSaveInstructions}
              disabled={!hasInstructionsChanges || savingInstructions}
              variant="accent"
              className="px-5 py-2.5 h-auto"
            >
              {savingInstructions ? "Saving..." : "Save Instructions"}
            </Button>
            {savedInstructions && (
              <span className="flex items-center gap-1.5 text-sm text-accent">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToAuth />
      </Unauthenticated>
      <Authenticated>
        <SubscriptionGate>
          <ProfileContent />
        </SubscriptionGate>
      </Authenticated>
    </>
  );
}
