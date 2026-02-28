"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, Loader2 } from "lucide-react";

interface AddKnowledgeModalProps {
  documentId: Id<"documents">;
  onClose: () => void;
}

export function AddKnowledgeModal({
  documentId,
  onClose,
}: AddKnowledgeModalProps) {
  const addKnowledge = useMutation(api.knowledge.add);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await addKnowledge({
        documentId,
        title: title.trim(),
        content: content.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Add Knowledge</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-muted-bg hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-muted">
          Add reference text that the AI will use as context when helping you
          write.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="k-title" className="mb-1.5 block text-sm font-medium">
              Title
            </label>
            <input
              id="k-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Research Notes, Style Guide..."
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="k-content" className="mb-1.5 block text-sm font-medium">
              Content
            </label>
            <textarea
              id="k-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your reference text here..."
              required
              rows={8}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Knowledge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
