"use client";

import type { ReactNode } from "react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClass}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-stone-300"
      />
      <span className="text-sm font-medium text-stone-700">{label}</span>
    </label>
  );
}

/** Side-by-side English / French column wrapper. */
export function LocaleColumns({
  labelEn,
  labelFr,
  en,
  fr,
}: {
  labelEn: string;
  labelFr: string;
  en: ReactNode;
  fr: ReactNode;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <fieldset className="space-y-3 rounded-lg border border-stone-200 p-3">
        <legend className="px-1 text-xs font-semibold uppercase text-stone-400">
          {labelEn}
        </legend>
        {en}
      </fieldset>
      <fieldset className="space-y-3 rounded-lg border border-stone-200 p-3">
        <legend className="px-1 text-xs font-semibold uppercase text-stone-400">
          {labelFr}
        </legend>
        {fr}
      </fieldset>
    </div>
  );
}
