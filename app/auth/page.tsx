"use client";

import { Authenticated } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

function RedirectToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}

export default function AuthPage() {
  return (
    <>
      <Authenticated>
        <RedirectToDashboard />
      </Authenticated>
      <AuthForm />
    </>
  );
}
