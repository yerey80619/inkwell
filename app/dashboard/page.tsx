"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { NewDocumentButton } from "@/components/dashboard/NewDocumentButton";
import { PenLine, LogOut, Loader2 } from "lucide-react";

function RedirectToAuth() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth");
  }, [router]);
  return null;
}

function DashboardContent() {
  const { signOut } = useAuthActions();
  const documents = useQuery(api.documents.list);
  const user = useQuery(api.users.currentUser);

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-accent" />
          <span className="font-serif text-xl font-bold">Inkwell</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted">
              {user.email as string}
            </span>
          )}
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Your Documents</h1>
          <p className="mt-1 text-muted">
            Create a new document or continue where you left off.
          </p>
        </div>

        {documents === undefined ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <NewDocumentButton />
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                id={doc._id}
                title={doc.title}
                updatedAt={doc.updatedAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToAuth />
      </Unauthenticated>
      <Authenticated>
        <DashboardContent />
      </Authenticated>
    </>
  );
}
