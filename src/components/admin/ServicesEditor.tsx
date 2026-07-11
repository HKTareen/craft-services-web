"use client";

import type { Dictionary } from "@/i18n/locales/en";
import type { ServiceItem } from "@/lib/types";
import CollectionEditor from "./CollectionEditor";
import ImageUpload from "./ImageUpload";
import { TextField, TextArea, NumberField, Checkbox, LocaleColumns } from "./fields";

export default function ServicesEditor({
  dict,
  initialItems,
}: {
  dict: Dictionary;
  initialItems: ServiceItem[];
}) {
  return (
    <CollectionEditor<ServiceItem>
      dict={dict}
      basePath="/api/services"
      initialItems={initialItems}
      makeEmpty={() => ({
        order: initialItems.length,
        spray: false,
        imageUrl: "",
        overlay: "from-stone-700/60 to-stone-900/55",
        en: { title: "", description: "" },
        fr: { title: "", description: "" },
      })}
      renderRow={(item) => (
        <div>
          <p className="font-semibold text-stone-900">{item.en.title}</p>
          <p className="truncate text-sm text-stone-500">{item.en.description}</p>
        </div>
      )}
      renderForm={(draft, update) => (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label={dict.admin.order}
              value={draft.order}
              onChange={(v) => update({ order: v })}
            />
            <TextField
              label={dict.admin.service.overlay}
              value={draft.overlay}
              onChange={(v) => update({ overlay: v })}
            />
            <div className="flex items-end">
              <Checkbox
                label={dict.admin.service.spray}
                checked={draft.spray}
                onChange={(v) => update({ spray: v })}
              />
            </div>
          </div>
          <ImageUpload
            dict={dict}
            label={dict.admin.imageUrlField}
            value={draft.imageUrl}
            onChange={(url) => update({ imageUrl: url })}
          />
          <LocaleColumns
            labelEn={dict.admin.labelEn}
            labelFr={dict.admin.labelFr}
            en={
              <>
                <TextField
                  label={dict.admin.titleField}
                  value={draft.en.title}
                  onChange={(v) => update({ en: { ...draft.en, title: v } })}
                />
                <TextArea
                  label={dict.admin.descriptionField}
                  value={draft.en.description}
                  onChange={(v) => update({ en: { ...draft.en, description: v } })}
                  rows={5}
                />
              </>
            }
            fr={
              <>
                <TextField
                  label={dict.admin.titleField}
                  value={draft.fr.title}
                  onChange={(v) => update({ fr: { ...draft.fr, title: v } })}
                />
                <TextArea
                  label={dict.admin.descriptionField}
                  value={draft.fr.description}
                  onChange={(v) => update({ fr: { ...draft.fr, description: v } })}
                  rows={5}
                />
              </>
            }
          />
        </>
      )}
    />
  );
}
