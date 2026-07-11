"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/locales/en";
import type { SiteContent } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { TextField, TextArea, LocaleColumns } from "./fields";
import { useContentSave } from "./saveContent";

export default function HeroEditor({
  dict,
  content,
}: {
  dict: Dictionary;
  content: SiteContent;
}) {
  const [heroImageUrl, setHeroImageUrl] = useState(content.media?.heroImageUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(content.media?.logoUrl ?? "");
  const [enTitle, setEnTitle] = useState(content.en?.hero?.title ?? "");
  const [enCta, setEnCta] = useState(content.en?.hero?.cta ?? "");
  const [frTitle, setFrTitle] = useState(content.fr?.hero?.title ?? "");
  const [frCta, setFrCta] = useState(content.fr?.hero?.cta ?? "");
  const { save, status } = useContentSave();

  function handleSave() {
    save({
      media: { heroImageUrl, logoUrl },
      en: { hero: { title: enTitle, cta: enCta } },
      fr: { hero: { title: frTitle, cta: frCta } },
    });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <ImageUpload
        dict={dict}
        label={dict.admin.hero.image}
        value={heroImageUrl}
        onChange={setHeroImageUrl}
      />
      <ImageUpload
        dict={dict}
        label={dict.admin.hero.logo}
        value={logoUrl}
        onChange={setLogoUrl}
      />
      <LocaleColumns
        labelEn={dict.admin.labelEn}
        labelFr={dict.admin.labelFr}
        en={
          <>
            <TextArea label={dict.admin.hero.title} value={enTitle} onChange={setEnTitle} />
            <TextField label={dict.admin.hero.cta} value={enCta} onChange={setEnCta} />
          </>
        }
        fr={
          <>
            <TextArea label={dict.admin.hero.title} value={frTitle} onChange={setFrTitle} />
            <TextField label={dict.admin.hero.cta} value={frCta} onChange={setFrCta} />
          </>
        }
      />
      <SaveButton dict={dict} onSave={handleSave} status={status} />
    </div>
  );
}

export function SaveButton({
  dict,
  onSave,
  status,
}: {
  dict: Dictionary;
  onSave: () => void;
  status: "idle" | "saving" | "saved";
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving"}
        className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "saving" ? dict.admin.saving : dict.admin.save}
      </button>
      {status === "saved" && (
        <span className="text-sm text-green-700">{dict.admin.saved}</span>
      )}
    </div>
  );
}
