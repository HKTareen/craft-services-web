"use client";

import type { Dictionary } from "@/i18n/locales/en";
import type { PortfolioProject, ProjectCategory } from "@/lib/types";
import CollectionEditor from "./CollectionEditor";
import ImageUpload from "./ImageUpload";
import { TextField, TextArea, LocaleColumns } from "./fields";

const CATEGORIES: ProjectCategory[] = ["interior", "exterior", "commercial"];

export default function PortfolioEditor({
  dict,
  initialItems,
}: {
  dict: Dictionary;
  initialItems: PortfolioProject[];
}) {
  return (
    <CollectionEditor<PortfolioProject>
      dict={dict}
      basePath="/api/portfolio"
      initialItems={initialItems}
      makeEmpty={() => ({
        title: "",
        titleFr: "",
        description: "",
        descriptionFr: "",
        category: "interior",
        imageUrl: "",
        createdAt: "",
      })}
      renderRow={(item) => (
        <div>
          <p className="font-semibold text-stone-900">{item.title}</p>
          <p className="truncate text-sm text-stone-500">
            {dict.admin.categories[item.category]} — {item.description}
          </p>
        </div>
      )}
      renderForm={(draft, update) => (
        <>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              {dict.admin.categoryField}
            </span>
            <select
              value={draft.category}
              onChange={(e) => update({ category: e.target.value as ProjectCategory })}
              className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {dict.admin.categories[c]}
                </option>
              ))}
            </select>
          </label>
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
                  value={draft.title}
                  onChange={(v) => update({ title: v })}
                />
                <TextArea
                  label={dict.admin.descriptionField}
                  value={draft.description}
                  onChange={(v) => update({ description: v })}
                />
              </>
            }
            fr={
              <>
                <TextField
                  label={dict.admin.titleField}
                  value={draft.titleFr ?? ""}
                  onChange={(v) => update({ titleFr: v })}
                />
                <TextArea
                  label={dict.admin.descriptionField}
                  value={draft.descriptionFr ?? ""}
                  onChange={(v) => update({ descriptionFr: v })}
                />
              </>
            }
          />
        </>
      )}
    />
  );
}
