"use client";

import { useParams, useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { KnowledgePanel } from "@/components/editor/KnowledgePanel";
import { AIChatPanel } from "@/components/editor/AIChatPanel";
import { ArrowLeft, Check, Loader2, PenLine } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { AccountDropdown } from "@/components/AccountDropdown";
import type { Editor } from "@tiptap/react";

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

function DocumentView() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as Id<"documents">;
  const document = useQuery(api.documents.get, { id: documentId });
  const updateDocument = useMutation(api.documents.update);
  const [title, setTitle] = useState("");
  const [titleInitialized, setTitleInitialized] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (document && !titleInitialized) {
      setTitle(document.title);
      setTitleInitialized(true);
    }
  }, [document, titleInitialized]);

  const handleTitleBlur = useCallback(() => {
    if (document && title !== document.title) {
      updateDocument({ id: documentId, title: title || "Untitled" });
    }
  }, [document, title, documentId, updateDocument]);

  const handleEditorReady = useCallback((editor: Editor | null) => {
    if (editor) {
      editorRef.current = editor;
    }
  }, []);

  const handleInsertText = useCallback((text: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.chain().focus().command(({ tr, dispatch }) => {
      if (dispatch) {
        const end = tr.doc.content.size;
        tr.insertText("\n\n" + text, end);
      }
      return true;
    }).run();
  }, []);

  if (document === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted">Document not found.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:bg-accent-light"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-accent" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="font-serif bg-transparent text-lg font-semibold outline-none placeholder:text-muted"
              placeholder="Untitled"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Check className="h-3.5 w-3.5" />
            Saved {formatTimestamp(document.updatedAt)}
          </span>
          <AccountDropdown />
        </div>
      </header>

      {/* Three-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Knowledge */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-border">
          <KnowledgePanel documentId={documentId} />
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 overflow-y-auto p-4">
          <DocumentEditor
            documentId={documentId}
            initialContent={document.content}
            onEditorReady={handleEditorReady}
          />
        </main>

        {/* Right Sidebar: AI Chat */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto border-l border-border">
          <AIChatPanel
            documentId={documentId}
            onInsertText={handleInsertText}
          />
        </aside>
      </div>
    </div>
  );
}

export default function DocumentPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToAuth />
      </Unauthenticated>
      <Authenticated>
        <SubscriptionGate>
          <DocumentView />
        </SubscriptionGate>
      </Authenticated>
    </>
  );
}
