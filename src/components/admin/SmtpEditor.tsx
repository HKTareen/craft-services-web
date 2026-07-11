"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/locales/en";
import { TextField, NumberField, Checkbox } from "./fields";
import { SaveButton } from "./HeroEditor";

interface SmtpState {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  toEmail: string;
}

const empty: SmtpState = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  pass: "",
  fromEmail: "",
  toEmail: "",
};

export default function SmtpEditor({ dict }: { dict: Dictionary }) {
  const [state, setState] = useState<SmtpState>(empty);
  const [hasPassword, setHasPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    fetch("/api/settings/smtp")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.configured) {
          setState({
            host: data.host ?? "",
            port: data.port ?? 587,
            secure: data.secure ?? false,
            user: data.user ?? "",
            pass: "",
            fromEmail: data.fromEmail ?? "",
            toEmail: data.toEmail ?? "",
          });
          setHasPassword(Boolean(data.hasPassword));
        }
      })
      .catch(() => {});
  }, []);

  const set = (patch: Partial<SmtpState>) => setState((p) => ({ ...p, ...patch }));

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/settings/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      setStatus(res.ok ? "saved" : "idle");
      if (res.ok && state.pass) setHasPassword(true);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-stone-500">{dict.admin.smtp.hint}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={dict.admin.smtp.host} value={state.host} onChange={(v) => set({ host: v })} />
        <NumberField label={dict.admin.smtp.port} value={state.port} onChange={(v) => set({ port: v })} />
        <TextField label={dict.admin.smtp.user} value={state.user} onChange={(v) => set({ user: v })} />
        <TextField
          label={
            dict.admin.smtp.pass + (hasPassword ? " (•••••• — leave blank to keep)" : "")
          }
          type="password"
          value={state.pass}
          onChange={(v) => set({ pass: v })}
        />
        <TextField label={dict.admin.smtp.from} value={state.fromEmail} onChange={(v) => set({ fromEmail: v })} />
        <TextField label={dict.admin.smtp.to} value={state.toEmail} onChange={(v) => set({ toEmail: v })} />
      </div>
      <Checkbox
        label={dict.admin.smtp.secure}
        checked={state.secure}
        onChange={(v) => set({ secure: v })}
      />
      <SaveButton dict={dict} onSave={save} status={status} />
    </div>
  );
}
