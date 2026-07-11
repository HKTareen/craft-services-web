"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/types";

/**
 * Small hook for saving a partial `SiteContent` to PUT /api/content. The server
 * merges partial updates, so each editor can save just its own slice.
 */
export function useContentSave() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function save(partial: SiteContent) {
    setStatus("saving");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      setStatus(res.ok ? "saved" : "idle");
    } catch {
      setStatus("idle");
    }
  }

  return { save, status };
}
