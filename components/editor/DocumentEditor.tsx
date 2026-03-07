"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EditorToolbar } from "./EditorToolbar";
import { Plus } from "lucide-react";

interface DocumentEditorProps {
  documentId: Id<"documents">;
  initialContent: string;
  onEditorReady?: (editor: Editor | null) => void;
  onAddContext?: (text: string) => void;
}

export function DocumentEditor({
  documentId,
  initialContent,
  onEditorReady,
  onAddContext,
}: DocumentEditorProps) {
  const updateDocument = useMutation(api.documents.update);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [floatingBtn, setFloatingBtn] = useState<{
    top: number;
    left: number;
    text: string;
  } | null>(null);

  const debouncedSave = useCallback(
    (content: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        updateDocument({ id: documentId, content });
      }, 1000);
    },
    [documentId, updateDocument]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: initialContent ? JSON.parse(initialContent) : undefined,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      debouncedSave(json);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ");
      if (!selectedText.trim()) {
        setFloatingBtn(null);
        return;
      }

      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0 || !editorWrapperRef.current) {
        setFloatingBtn(null);
        return;
      }

      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const wrapperRect = editorWrapperRef.current.getBoundingClientRect();

      setFloatingBtn({
        top: rect.top - wrapperRect.top - 36,
        left: rect.left - wrapperRect.left + rect.width / 2 - 14,
        text: selectedText,
      });
    },
  });

  useEffect(() => {
    if (editor && !hasInitialized.current) {
      hasInitialized.current = true;
      if (onEditorReady) onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleAddContext = useCallback(() => {
    if (floatingBtn?.text && onAddContext) {
      onAddContext(floatingBtn.text);
      setFloatingBtn(null);
      editor?.commands.setTextSelection(editor.state.selection.to);
    }
  }, [floatingBtn, onAddContext, editor]);

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-border bg-surface shadow-soft">
      <EditorToolbar editor={editor} />
      <div ref={editorWrapperRef} className="relative flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} />
        {floatingBtn && onAddContext && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddContext();
            }}
            className="absolute z-50 flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white shadow-md transition-transform hover:scale-110 hover:bg-accent-light"
            style={{ top: floatingBtn.top, left: floatingBtn.left }}
            title="Add to AI chat context"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
