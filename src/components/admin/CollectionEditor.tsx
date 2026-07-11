"use client";

import { useState, ReactNode } from "react";
import type { Dictionary } from "@/i18n/locales/en";

interface CollectionEditorProps<T extends { id: string }> {
  dict: Dictionary;
  basePath: string;
  initialItems: T[];
  makeEmpty: () => Omit<T, "id">;
  renderRow: (item: T) => ReactNode;
  renderForm: (draft: Omit<T, "id">, update: (patch: Partial<T>) => void) => ReactNode;
}

/**
 * Generic list CRUD: renders rows with edit/delete, an add button, and an inline
 * form (provided by the caller). Talks to `${basePath}` (POST) and
 * `${basePath}/${id}` (PUT/DELETE).
 */
export default function CollectionEditor<T extends { id: string }>({
  dict,
  basePath,
  initialItems,
  makeEmpty,
  renderRow,
  renderForm,
}: CollectionEditorProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<T, "id">>(makeEmpty());
  const [busy, setBusy] = useState(false);

  function startAdd() {
    setDraft(makeEmpty());
    setEditingId("new");
  }

  function startEdit(item: T) {
    const { ...rest } = item;
    setDraft(rest);
    setEditingId(item.id);
  }

  function update(patch: Partial<T>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function save() {
    setBusy(true);
    try {
      if (editingId === "new") {
        const res = await fetch(basePath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (res.ok) {
          const created = (await res.json()) as T;
          setItems((prev) => [...prev, created]);
        }
      } else if (editingId) {
        const res = await fetch(`${basePath}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (res.ok) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === editingId ? ({ ...it, ...draft } as T) : it
            )
          );
        }
      }
      setEditingId(null);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(dict.admin.confirmDelete)) return;
    const res = await fetch(`${basePath}/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={startAdd}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-400"
        >
          {dict.admin.add}
        </button>
      </div>

      {editingId && (
        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">{renderForm(draft, update)}</div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? dict.admin.saving : dict.admin.save}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm"
            >
              {dict.admin.cancel}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">{renderRow(item)}</div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
              >
                {dict.admin.edit}
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                {dict.admin.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
