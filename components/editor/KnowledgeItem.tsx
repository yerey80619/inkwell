"use client";

import { useState } from "react";
import { Trash2, BookOpen } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

interface KnowledgeItemProps {
  id: Id<"knowledge">;
  title: string;
  content: string;
}

export function KnowledgeItem({ id, title, content }: KnowledgeItemProps) {
  const removeKnowledge = useMutation(api.knowledge.remove);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    await removeKnowledge({ id });
    setShowDeleteModal(false);
  };

  return (
    <>
      <motion.div
        className="group rounded-xl border border-border bg-surface p-3 transition-shadow hover:shadow-soft"
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
            <h4 className="text-sm font-medium leading-snug line-clamp-1">
              {title}
            </h4>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-shrink-0 rounded p-1 text-muted opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            title="Remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted line-clamp-3">
          {content}
        </p>
      </motion.div>

      <AnimatePresence>
        {showDeleteModal && (
          <ConfirmDeleteModal
            title="Remove knowledge"
            description={`Are you sure you want to remove "${title}"? The AI will no longer use this as context.`}
            confirmLabel="Remove"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
