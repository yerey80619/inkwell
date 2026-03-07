"use client";

import { Trash2, BookOpen } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface KnowledgeItemProps {
  id: Id<"knowledge">;
  title: string;
  content: string;
}

export function KnowledgeItem({ id, title, content }: KnowledgeItemProps) {
  const removeKnowledge = useMutation(api.knowledge.remove);

  return (
    <div className="group rounded-xl border border-border bg-surface p-3 transition-shadow hover:shadow-soft">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
          <h4 className="text-sm font-medium leading-snug line-clamp-1">
            {title}
          </h4>
        </div>
        <button
          onClick={() => removeKnowledge({ id })}
          className="flex-shrink-0 rounded p-1 text-muted opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          title="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-xs leading-relaxed text-muted line-clamp-3">
        {content}
      </p>
    </div>
  );
}
