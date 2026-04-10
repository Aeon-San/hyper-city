"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero02Page from "@/components/shadcn-space/blocks/hero-02";
import { useAuthStore } from "@/store/use-auth-store";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (hasHydrated && isAuthenticated) {
    return null;
  }

  return <Hero02Page />;
}
