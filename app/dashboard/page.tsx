"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { NewDocumentButton } from "@/components/dashboard/NewDocumentButton";
import { AccountDropdown } from "@/components/AccountDropdown";
import { TrialPopup } from "@/components/TrialPopup";
import { PenLine, Loader2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

function RedirectToAuth() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth");
  }, [router]);
  return null;
}

function DashboardContent() {
  const documents = useQuery(api.documents.list);
  const user = useQuery(api.users.currentUser);
  const subscription = useQuery(api.subscriptions.getMySubscription);

  if (subscription === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  const hasAccess =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  if (!hasAccess) {
    return <TrialPopup userEmail={user?.email ?? undefined} />;
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

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="font-serif text-3xl font-bold">Your Documents</h1>
          <p className="mt-1 text-muted">
            Create a new document or continue where you left off.
          </p>
        </motion.div>

        {documents === undefined ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : documents.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
          >
            <FileText className="mb-3 h-10 w-10 text-border" />
            <p className="mb-1 text-sm font-medium text-muted">
              No documents yet
            </p>
            <p className="mb-6 text-xs text-muted">
              Create your first document to get started.
            </p>
            <NewDocumentButton />
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItemVariants}>
              <NewDocumentButton />
            </motion.div>
            {documents.map((doc) => (
              <motion.div key={doc._id} variants={staggerItemVariants}>
                <DocumentCard
                  id={doc._id}
                  title={doc.title}
                  updatedAt={doc.updatedAt}
                />
              </motion.div>
            ))}
          </motion.div>
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
