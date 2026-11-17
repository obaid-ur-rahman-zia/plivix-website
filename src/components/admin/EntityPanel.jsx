"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  ENTITY_FIELDS,
  emptyDefaults,
  formValuesToPayload,
  rowToFormValues,
} from "@/lib/admin/entityFieldConfig";
import FieldInput from "./FieldInput";
import ConfirmDialog from "./ConfirmDialog";

function sortRowsByOrder(rows) {
  return [...(rows || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
}

function rowThumb(row) {
  return row.thumbnail_url || row.cover_url || row.image_url || row.avatar_url || null;
}

function isPublishedField(row) {
  for (const k of ["published", "active", "is_active"]) {
    if (k in row) return Boolean(row[k]);
  }
  return null;
}

function SortableEntityRow({ row, rowLabel, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-3 py-3 md:px-4 ${
        isDragging ? "opacity-90 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-[var(--color-accent)]/40" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded-lg border border-transparent p-1.5 text-[var(--color-fg-muted)] hover:border-[var(--color-line)] hover:text-[var(--color-fg)] active:cursor-grabbing shrink-0"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" aria-hidden />
      </button>
      {rowThumb(row) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={rowThumb(row)}
          alt=""
          className="h-10 w-14 shrink-0 rounded-md border border-[var(--color-line)] object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-[var(--color-fg)] truncate">{rowLabel(row)}</p>
        <p className="text-[11px] text-[var(--color-fg-subtle)] truncate">
          {[row.category, row.client, row.company, row.role].filter(Boolean)[0] || ""}
        </p>
      </div>
      {isPublishedField(row) !== null && (
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
            isPublishedField(row)
              ? "border-emerald-500/40 text-emerald-400"
              : "border-[var(--color-line-strong)] text-[var(--color-fg-subtle)]"
          }`}
        >
          {isPublishedField(row) ? "Live" : "Draft"}
        </span>
      )}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onEdit(row)}
          className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs text-[var(--color-fg)] hover:border-[var(--color-accent)]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(row)}
          className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default function EntityPanel({ entity, lastUploadUrl, autoNew = false, onChanged }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("list"); // list | edit | new
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const fields = ENTITY_FIELDS[entity] || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${entity}`, { credentials: "include" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || res.statusText);
      setRows(sortRowsByOrder(j.data || []));
    } catch (e) {
      setError(e.message || "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => {
    setMode("list");
    setEditingId(null);
    setFormValues({});
    setQuery("");
    load().then(() => {
      if (autoNew) {
        setFormValues(rowToFormValues(entity, emptyDefaults(entity)));
        setMode("new");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, load]);

  const flash = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const setField = (key, val) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
  };

  const startNew = () => {
    const defaults = emptyDefaults(entity);
    setFormValues(rowToFormValues(entity, defaults));
    setEditingId(null);
    setMode("new");
    setError(null);
  };

  const startEdit = (row) => {
    setFormValues(rowToFormValues(entity, row));
    setEditingId(row.id);
    setMode("edit");
    setError(null);
  };

  const cancelForm = () => {
    setMode("list");
    setEditingId(null);
    setFormValues({});
    setError(null);
  };

  const validateRequired = () => {
    for (const f of fields) {
      if (!f.required) continue;
      const v = formValues[f.key];
      if (f.type === "boolean") continue;
      if (f.type === "number") {
        if (String(v ?? "").trim() === "") throw new Error(`${f.label} is required`);
      } else if (String(v ?? "").trim() === "") {
        throw new Error(`${f.label} is required`);
      }
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      validateRequired();
      let payload;
      try {
        payload = formValuesToPayload(entity, formValues);
      } catch (e) {
        throw e;
      }

      if (mode === "new") {
        const res = await fetch(`/api/admin/${entity}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.error || "Create failed");
      } else if (mode === "edit" && editingId) {
        const res = await fetch(`/api/admin/${entity}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.error || "Save failed");
      }
      await load();
      cancelForm();
      flash(mode === "new" ? "Created" : "Saved");
      onChanged?.();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const performDelete = async (id) => {
    setError(null);
    const res = await fetch(`/api/admin/${entity}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || "Delete failed");
    if (editingId === id) cancelForm();
    await load();
    flash("Deleted");
    onChanged?.();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(rows, oldIndex, newIndex);
    const previous = rows;
    setRows(next);
    setReordering(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${entity}/reorder`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next.map((r) => r.id) }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Reorder failed");
    } catch (e) {
      setError(e.message || "Reorder failed");
      setRows(previous);
    } finally {
      setReordering(false);
    }
  };

  const pasteLast = (key) => {
    if (!lastUploadUrl) return;
    setField(key, lastUploadUrl);
  };

  const uploadForField = async (field, file) => {
    const safeName = file.name.replace(/[^\w.\-()+]/g, "_");
    const storagePath =
      entity === "projects"
        ? (() => {
            const raw = String(formValues.slug ?? "").trim();
            const slug =
              raw.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || `draft-${Date.now()}`;
            return `projects/${slug}/${Date.now()}-${safeName}`;
          })()
        : entity === "team"
          ? (() => {
              const raw = String(formValues.name ?? "").trim();
              const slug =
                raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
                `draft-${Date.now()}`;
              return `team/${slug}/${Date.now()}-${safeName}`;
            })()
          : `uploads/${Date.now()}-${safeName}`;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", storagePath);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || "Upload failed");
    const publicUrl = j.publicUrl;
    if (!publicUrl) throw new Error("No public URL returned");

    if (field.type === "lines" && field.mediaAppend) {
      setFormValues((prev) => {
        const cur = String(prev[field.key] ?? "").trim();
        return { ...prev, [field.key]: cur ? `${cur}\n${publicUrl}` : publicUrl };
      });
    } else {
      setField(field.key, publicUrl);
    }
  };

  const rowLabel = (row) =>
    row.title ||
    row.name ||
    row.label ||
    row.question ||
    row.slug ||
    row.author ||
    row.id?.slice(0, 8) ||
    "Row";

  const q = query.trim().toLowerCase();
  const filteredRows = q
    ? rows.filter((r) => `${rowLabel(r)} ${r.slug ?? ""} ${r.category ?? ""}`.toLowerCase().includes(q))
    : rows;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {mode === "list" ? (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${entity.replace("_", " ")}…`}
            className="w-full sm:w-72 rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)]"
          />
        ) : (
          <span />
        )}
        {mode === "list" && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-4 py-2 text-sm text-[var(--color-fg)] hover:opacity-90"
          >
            + Add new
          </button>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-[90] rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)] px-4 py-2.5 text-sm text-[var(--color-fg)] shadow-lg">
          {toast}
        </div>
      )}
      {loading && <p className="text-[var(--color-fg-muted)]">Loading…</p>}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {/does not exist|schema cache|relation/i.test(error)
            ? `${error} — this table or column is missing. Run the latest migration (npm run db:ensure), then reload.`
            : error}
        </div>
      )}

      {mode === "list" && !loading && (
        <>
          {reordering && (
            <p className="text-xs text-[var(--color-fg-muted)]">Saving order…</p>
          )}
          {rows.length === 0 && (
            <p className="text-sm text-[var(--color-fg-muted)]">No rows yet. Add one.</p>
          )}
          {rows.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {filteredRows.map((row) => (
                    <SortableEntityRow
                      key={row.id}
                      row={row}
                      rowLabel={rowLabel}
                      onEdit={startEdit}
                      onDelete={(r) => setDeleteTarget({ id: r.id, label: rowLabel(r) })}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this entry?"
        danger
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget?.id) return;
          await performDelete(deleteTarget.id);
        }}
      >
        <p className="text-[var(--color-fg)] break-words">{deleteTarget?.label}</p>
        <p className="mt-2 text-xs">This cannot be undone.</p>
      </ConfirmDialog>

      {(mode === "edit" || mode === "new") && (
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-5 md:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg text-[var(--color-fg)]">
              {mode === "new" ? "New entry" : "Edit entry"}
            </h2>
            {mode === "edit" && editingId && (
              <p className="font-mono text-[10px] text-[var(--color-fg-subtle)] break-all">{editingId}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.key}
                className={
                  f.type === "text" || f.type === "lines" || f.type === "json" || f.type === "social_links"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <FieldInput
                  field={f}
                  value={formValues[f.key]}
                  onChange={setField}
                  onPasteLastUrl={pasteLast}
                  onFieldUpload={uploadForField}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : mode === "new" ? "Create" : "Save changes"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={cancelForm}
              className="rounded-full border border-[var(--color-line)] px-6 py-2.5 text-sm text-[var(--color-fg-muted)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
