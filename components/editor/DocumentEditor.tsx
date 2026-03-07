"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EditorToolbar } from "./EditorToolbar";

interface DocumentEditorProps {
  documentId: Id<"documents">;
  initialContent: string;
  onEditorReady?: (editor: Editor | null) => void;
}

export function DocumentEditor({
  documentId,
  initialContent,
  onEditorReady,
}: DocumentEditorProps) {
  const updateDocument = useMutation(api.documents.update);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

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

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-border bg-surface shadow-soft">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
