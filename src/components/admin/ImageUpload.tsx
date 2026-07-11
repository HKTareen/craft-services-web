"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/locales/en";

interface ImageUploadProps {
  dict: Dictionary;
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ dict, label, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("upload");
      const { url } = await res.json();
      onChange(url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <div className="mt-1 flex items-center gap-4">
        {value ? (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-stone-200">
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-300 text-xs text-stone-400">
            —
          </div>
        )}
        <div className="min-w-0 flex-1">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFile}
            disabled={uploading}
            className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-stone-950 hover:file:bg-amber-400"
          />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={dict.admin.imageUrlField}
            className="mt-2 block w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
          />
          {uploading && <p className="mt-1 text-xs text-stone-500">{dict.admin.uploading}</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
