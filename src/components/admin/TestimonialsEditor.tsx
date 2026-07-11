"use client";

import type { Dictionary } from "@/i18n/locales/en";
import type { Testimonial } from "@/lib/types";
import CollectionEditor from "./CollectionEditor";
import ImageUpload from "./ImageUpload";
import { TextField, TextArea, NumberField, LocaleColumns } from "./fields";

export default function TestimonialsEditor({
  dict,
  initialItems,
}: {
  dict: Dictionary;
  initialItems: Testimonial[];
}) {
  return (
    <CollectionEditor<Testimonial>
      dict={dict}
      basePath="/api/testimonials"
      initialItems={initialItems}
      makeEmpty={() => ({
        order: initialItems.length,
        authorName: "",
        rating: 5,
        relativeTime: "",
        photoUrl: "",
        en: { text: "" },
        fr: { text: "" },
      })}
      renderRow={(item) => (
        <div>
          <p className="font-semibold text-stone-900">
            {item.authorName}{" "}
            <span className="text-amber-500">{"★".repeat(item.rating)}</span>
          </p>
          <p className="truncate text-sm text-stone-500">{item.en.text}</p>
        </div>
      )}
      renderForm={(draft, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label={dict.admin.testimonial.author}
              value={draft.authorName}
              onChange={(v) => update({ authorName: v })}
            />
            <NumberField
              label={dict.admin.testimonial.rating}
              value={draft.rating}
              onChange={(v) => update({ rating: Math.max(1, Math.min(5, v)) })}
            />
            <TextField
              label={dict.admin.testimonial.relativeTime}
              value={draft.relativeTime}
              onChange={(v) => update({ relativeTime: v })}
            />
          </div>
          <NumberField
            label={dict.admin.order}
            value={draft.order}
            onChange={(v) => update({ order: v })}
          />
          <ImageUpload
            dict={dict}
            label={dict.admin.testimonial.photoUrl}
            value={draft.photoUrl ?? ""}
            onChange={(url) => update({ photoUrl: url })}
          />
          <LocaleColumns
            labelEn={dict.admin.labelEn}
            labelFr={dict.admin.labelFr}
            en={
              <TextArea
                label={dict.admin.testimonial.text}
                value={draft.en.text}
                onChange={(v) => update({ en: { text: v } })}
                rows={4}
              />
            }
            fr={
              <TextArea
                label={dict.admin.testimonial.text}
                value={draft.fr.text}
                onChange={(v) => update({ fr: { text: v } })}
                rows={4}
              />
            }
          />
        </>
      )}
    />
  );
}
