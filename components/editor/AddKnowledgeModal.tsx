"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { overlayVariants, modalVariants } from "@/lib/animations";

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
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-lg rounded-[32px] border border-border bg-surface p-8 shadow-raised"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Add Knowledge</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
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
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Add Knowledge
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
