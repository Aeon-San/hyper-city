"use client";

import Hero02Page from "@/components/shadcn-space/blocks/hero-02";
import { useAuthStore } from "@/store/use-auth-store";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  return <Hero02Page />;
}
