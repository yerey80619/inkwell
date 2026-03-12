"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { overlayVariants, modalVariants } from "@/lib/animations";

interface ConfirmDeleteModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onCancel}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-[32px] border border-border bg-surface p-8 shadow-raised"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="font-serif text-lg font-semibold">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border-red-600"
          >
            {confirmLabel}
          </Button>
          <Button onClick={onCancel} variant="secondary" className="flex-1">
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
