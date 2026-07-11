"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { Dictionary } from "@/i18n/locales/en";

interface LoginFormProps {
  dict: Dictionary;
}

export default function LoginForm({ dict }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setNotice(null);

    try {
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("session");

      router.refresh();
    } catch {
      setStatus("idle");
      setError(dict.admin.unauthorized);
    }
  }

  async function handleReset() {
    setError(null);
    setNotice(null);
    if (!email) {
      setError(dict.admin.resetNeedEmail);
      return;
    }
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setNotice(dict.admin.resetSent);
    } catch {
      setError(dict.admin.resetError);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900">{dict.admin.login}</h1>
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            {dict.admin.email}
          </label>
          <input
            type="email"
            id="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            {dict.admin.password}
          </label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-3"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && <p className="text-sm text-green-700">{notice}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-stone-900 px-4 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {status === "loading" ? dict.contact.sending : dict.admin.loginBtn}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full text-center text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          {dict.admin.forgotPassword}
        </button>
      </form>
    </div>
  );
}
