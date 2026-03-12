"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AnimatePresence } from "framer-motion";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

interface DocumentCardProps {
  id: Id<"documents">;
  title: string;
  updatedAt: number;
}

export function DocumentCard({ id, title, updatedAt }: DocumentCardProps) {
  const removeDocument = useMutation(api.documents.remove);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await removeDocument({ id });
    setShowDeleteModal(false);
  };

  return (
    <>
      <Link
        href={`/document/${id}`}
        className="group relative flex flex-col rounded-[20px] border border-border bg-surface p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-0.5"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted-bg text-foreground">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="font-serif mb-1 text-base font-semibold leading-snug line-clamp-2">
          {title || "Untitled"}
        </h3>
        <p className="mt-auto pt-3 text-xs text-muted">
          {formatRelativeTime(updatedAt)}
        </p>
        <button
          onClick={handleDeleteClick}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          title="Delete document"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </Link>

      <AnimatePresence>
        {showDeleteModal && (
          <ConfirmDeleteModal
            title="Delete document"
            description={`Are you sure you want to delete "${title || "Untitled"}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
