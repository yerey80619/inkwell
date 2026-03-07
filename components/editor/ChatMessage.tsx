"use client";

import { Sparkles, User, ClipboardCopy } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  onInsert?: () => void;
}

export function ChatMessage({ role, content, onInsert }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={`flex gap-2.5 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
          isAssistant ? "bg-accent/10" : "bg-muted-bg"
        }`}
      >
        {isAssistant ? (
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        ) : (
          <User className="h-3.5 w-3.5 text-muted" />
        )}
      </div>
      <div
        className={`flex max-w-[85%] flex-col gap-1 ${isAssistant ? "" : "items-end"}`}
      >
        <div
          className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
            isAssistant
              ? "rounded-tl-sm border border-border bg-surface"
              : "rounded-tr-sm bg-accent text-white"
          }`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        {isAssistant && onInsert && (
          <Button
            onClick={onInsert}
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-0.5 text-xs text-muted hover:text-foreground"
          >
            <ClipboardCopy className="h-3 w-3 mr-1" />
            Insert into document
          </Button>
        )}
      </div>
    </div>
  );
}
