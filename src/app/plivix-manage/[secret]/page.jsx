"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function PlivixManagePage() {
  const params = useParams();
  const secret = params?.secret;
  const [gate, setGate] = useState("loading");

  useEffect(() => {
    if (!secret || typeof secret !== "string") {
      setGate("deny");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ secret }),
      });
      if (cancelled) return;
      setGate(res.ok ? "ok" : "deny");
    })();
    return () => {
      cancelled = true;
    };
  }, [secret]);

  if (gate === "loading") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg-muted)]">
        Verifying…
      </div>
    );
  }

  if (gate === "deny") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg-muted)] px-6 text-center">
        Not found.
      </div>
    );
  }

  return <AdminDashboard />;
}
