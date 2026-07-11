"use client";

import { useState, FormEvent } from "react";
import type { Dictionary } from "@/i18n/locales/en";

interface ContactFormProps {
  dict: Dictionary;
}

export default function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            {dict.contact.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
            {dict.contact.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          {dict.contact.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700">
          {dict.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div>
        <label htmlFor="photos" className="block text-sm font-medium text-stone-700">
          {dict.contact.upload}
        </label>
        <input
          type="file"
          id="photos"
          name="photos"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="mt-1 block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-950 hover:file:bg-amber-400"
        />
        <p className="mt-1 text-xs text-stone-500">{dict.contact.uploadHint}</p>
      </div>

      {status === "success" && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
          {dict.contact.success}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {dict.contact.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-stone-950 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? dict.contact.sending : dict.contact.submit}
      </button>
    </form>
  );
}
