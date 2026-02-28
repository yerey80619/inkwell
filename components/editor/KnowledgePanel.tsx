"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { KnowledgeItem } from "./KnowledgeItem";
import { AddKnowledgeModal } from "./AddKnowledgeModal";
import { Plus, BookOpen } from "lucide-react";

interface KnowledgePanelProps {
  documentId: Id<"documents">;
}

export function KnowledgePanel({ documentId }: KnowledgePanelProps) {
  const knowledge = useQuery(api.knowledge.list, { documentId });
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">Knowledge</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/10"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {knowledge === undefined ? (
          <div className="py-8 text-center text-xs text-muted">Loading...</div>
        ) : knowledge.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-3 h-8 w-8 text-border" />
            <p className="mb-1 text-sm font-medium text-muted">No knowledge yet</p>
            <p className="mb-4 text-xs text-muted">
              Add reference materials for the AI to use.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Knowledge
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {knowledge.map((item) => (
              <KnowledgeItem
                key={item._id}
                id={item._id}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddKnowledgeModal
          documentId={documentId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
