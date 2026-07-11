"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/locales/en";
import type { SiteContent, SiteContentOverride } from "@/lib/types";
import { TextField, TextArea } from "./fields";
import { useContentSave } from "./saveContent";
import { SaveButton } from "./HeroEditor";

type Flat = {
  hook: string;
  hookSubtitle: string;
  phone: string;
  phoneValue: string;
  email: string;
  emailValue: string;
  hours: string;
  hoursValue: string;
  footerTagline: string;
  footerCopyright: string;
  footerRights: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
};

function flatten(o: SiteContentOverride | undefined): Flat {
  return {
    hook: o?.contact?.hook ?? "",
    hookSubtitle: o?.contact?.hookSubtitle ?? "",
    phone: o?.contact?.details?.phone ?? "",
    phoneValue: o?.contact?.details?.phoneValue ?? "",
    email: o?.contact?.details?.email ?? "",
    emailValue: o?.contact?.details?.emailValue ?? "",
    hours: o?.contact?.details?.hours ?? "",
    hoursValue: o?.contact?.details?.hoursValue ?? "",
    footerTagline: o?.footer?.tagline ?? "",
    footerCopyright: o?.footer?.copyrightName ?? "",
    footerRights: o?.footer?.rights ?? "",
    reviewsTitle: o?.reviews?.title ?? "",
    reviewsSubtitle: o?.reviews?.subtitle ?? "",
  };
}

function toOverride(f: Flat): SiteContentOverride {
  return {
    contact: {
      hook: f.hook,
      hookSubtitle: f.hookSubtitle,
      details: {
        phone: f.phone,
        phoneValue: f.phoneValue,
        email: f.email,
        emailValue: f.emailValue,
        hours: f.hours,
        hoursValue: f.hoursValue,
      },
    },
    footer: {
      tagline: f.footerTagline,
      copyrightName: f.footerCopyright,
      rights: f.footerRights,
    },
    reviews: { title: f.reviewsTitle, subtitle: f.reviewsSubtitle },
  };
}

function LocalePanel({
  legend,
  dict,
  value,
  set,
}: {
  legend: string;
  dict: Dictionary;
  value: Flat;
  set: (patch: Partial<Flat>) => void;
}) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-stone-200 p-4">
      <legend className="px-1 text-xs font-semibold uppercase text-stone-400">
        {legend}
      </legend>
      <TextField label={dict.admin.contact.hook} value={value.hook} onChange={(v) => set({ hook: v })} />
      <TextArea label={dict.admin.contact.hookSubtitle} value={value.hookSubtitle} onChange={(v) => set({ hookSubtitle: v })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label={dict.admin.contact.phone} value={value.phoneValue} onChange={(v) => set({ phoneValue: v })} />
        <TextField label={dict.admin.contact.email} value={value.emailValue} onChange={(v) => set({ emailValue: v })} />
      </div>
      <TextField label={dict.admin.contact.hours} value={value.hoursValue} onChange={(v) => set({ hoursValue: v })} />
      <TextField label={dict.admin.tabs.testimonials} value={value.reviewsTitle} onChange={(v) => set({ reviewsTitle: v })} />
      <TextField label={dict.admin.tabs.contact} value={value.footerTagline} onChange={(v) => set({ footerTagline: v })} />
    </fieldset>
  );
}

export default function ContactEditor({
  dict,
  content,
}: {
  dict: Dictionary;
  content: SiteContent;
}) {
  const [en, setEnState] = useState<Flat>(flatten(content.en));
  const [fr, setFrState] = useState<Flat>(flatten(content.fr));
  const { save, status } = useContentSave();

  const setEn = (patch: Partial<Flat>) => setEnState((p) => ({ ...p, ...patch }));
  const setFr = (patch: Partial<Flat>) => setFrState((p) => ({ ...p, ...patch }));

  function handleSave() {
    save({ en: toOverride(en), fr: toOverride(fr) });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <LocalePanel legend={dict.admin.labelEn} dict={dict} value={en} set={setEn} />
        <LocalePanel legend={dict.admin.labelFr} dict={dict} value={fr} set={setFr} />
      </div>
      <SaveButton dict={dict} onSave={handleSave} status={status} />
    </div>
  );
}
