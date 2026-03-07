"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatMessage } from "./ChatMessage";
import { Sparkles, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface AIChatPanelProps {
  documentId: Id<"documents">;
  onInsertText: (text: string) => void;
}

export function AIChatPanel({ documentId, onInsertText }: AIChatPanelProps) {
  const messages = useQuery(api.chat.list, { documentId });
  const sendMessage = useMutation(api.chat.send);
  const clearChat = useMutation(api.chat.clearChat);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage({ documentId, content: input.trim() });
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const isWaitingForResponse =
    messages &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">AI Assistant</h2>
        </div>
        {messages && messages.length > 0 && (
          <Button
            onClick={() => clearChat({ documentId })}
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted hover:text-foreground"
            title="Clear chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {!messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="mb-3 h-8 w-8 text-border" />
            <p className="mb-1 text-sm font-medium text-muted">AI Writing Assistant</p>
            <p className="text-xs leading-relaxed text-muted">
              Ask the AI to help you write, edit, or brainstorm. It will use
              your knowledge context.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg._id}
                role={msg.role}
                content={msg.content}
                onInsert={
                  msg.role === "assistant"
                    ? () => onInsertText(msg.content)
                    : undefined
                }
              />
            ))}
            {isWaitingForResponse && (
              <div className="flex items-center gap-2 pl-9 text-xs text-muted">
                <div className="flex gap-1">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                </div>
                AI is thinking
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-border p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Ask AI to write or edit..."
            rows={2}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
          <Button
            type="submit"
            disabled={!input.trim() || sending}
            variant="accent"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
