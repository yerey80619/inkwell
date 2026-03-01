"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { LogOut, User, ChevronDown } from "lucide-react";

export function AccountDropdown() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || (user?.email as string | undefined) || "Account";
  const initial = (user?.name?.[0] || (user?.email as string | undefined)?.[0] || "A").toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted-bg"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
          {initial}
        </div>
        <span className="hidden text-foreground sm:inline">{displayName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium text-foreground">{user?.name || "No name set"}</p>
            <p className="text-xs text-muted">{user?.email as string}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted-bg"
            >
              <User className="h-4 w-4 text-muted" />
              Profile
            </button>
            <button
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted-bg"
            >
              <LogOut className="h-4 w-4 text-muted" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
