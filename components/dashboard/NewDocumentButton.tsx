"use client";

import { Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function NewDocumentButton() {
  const createDocument = useMutation(api.documents.create);
  const router = useRouter();

  const handleCreate = async () => {
    const docId = await createDocument();
    router.push(`/document/${docId}`);
  };

  return (
    <motion.button
      onClick={handleCreate}
      className="flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-border bg-surface/50 p-6 text-muted transition-colors hover:border-accent hover:text-accent hover:shadow-soft"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-current">
        <Plus className="h-5 w-5" />
      </div>
      <span className="text-sm font-medium">New Document</span>
    </motion.button>
  );
}
