"use client";

import { Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export function NewDocumentButton() {
  const createDocument = useMutation(api.documents.create);
  const router = useRouter();

  const handleCreate = async () => {
    const docId = await createDocument();
    router.push(`/document/${docId}`);
  };

  return (
    <button
      onClick={handleCreate}
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/50 p-6 text-muted transition-all hover:border-accent hover:text-accent hover:shadow-sm"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-current">
        <Plus className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium">New Document</span>
    </button>
  );
}
