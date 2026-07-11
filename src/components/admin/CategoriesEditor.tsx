"use client";

import type { Dictionary } from "@/i18n/locales/en";
import type { CategoryItem } from "@/lib/types";
import CollectionEditor from "./CollectionEditor";
import ImageUpload from "./ImageUpload";
import { TextField, TextArea, NumberField, LocaleColumns } from "./fields";

export default function CategoriesEditor({
  dict,
  initialItems,
}: {
  dict: Dictionary;
  initialItems: CategoryItem[];
}) {
  return (
    <CollectionEditor<CategoryItem>
      dict={dict}
      basePath="/api/categories"
      initialItems={initialItems}
      makeEmpty={() => ({
        order: initialItems.length,
        images: [],
        en: { title: "", description: "" },
        fr: { title: "", description: "" },
      })}
      renderRow={(item) => (
        <div>
          <p className="font-semibold text-stone-900">{item.en.title}</p>
          <p className="text-sm text-stone-500">
            {item.images.length} image{item.images.length === 1 ? "" : "s"}
          </p>
        </div>
      )}
      renderForm={(draft, update) => (
        <>
          <NumberField
            label={dict.admin.order}
            value={draft.order}
            onChange={(v) => update({ order: v })}
          />
          <TextArea
            label={dict.admin.category.images}
            value={draft.images.join("\n")}
            onChange={(v) =>
              update({ images: v.split("\n").map((s) => s.trim()).filter(Boolean) })
            }
            rows={3}
          />
          <ImageUpload
            dict={dict}
            label={dict.admin.uploadImage}
            value=""
            onChange={(url) => update({ images: [...draft.images, url] })}
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
                />
              </>
            }
          />
        </>
      )}
    />
  );
}
