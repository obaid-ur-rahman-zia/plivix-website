"use client";

import { useCallback, useEffect, useState } from "react";

const ENTITIES = ["services", "projects", "team", "testimonials", "stats", "internships"];

export default function AdminDashboard() {
  const [entity, setEntity] = useState("services");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editor, setEditor] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [uploadMsg, setUploadMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${entity}`, { credentials: "include" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || res.statusText);
      }
      const { data } = await res.json();
      setRows(data || []);
      setSelectedId(null);
      setEditor("");
    } catch (e) {
      setError(e.message || "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [entity]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!selectedId) return;
    let parsed;
    try {
      parsed = JSON.parse(editor);
    } catch {
      setError("Invalid JSON");
      return;
    }
    const { id: _ignore, ...patch } = parsed;
    setError(null);
    const res = await fetch(`/api/admin/${entity}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, ...patch }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }
    await load();
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setUploadMsg(j.error || "Upload failed");
      return;
    }
    setUploadMsg(`Uploaded: ${j.publicUrl}`);
    e.target.value = "";
  };

  return (
    <div className="min-h-[100svh] bg-[var(--color-bg)] text-[var(--color-fg)] px-4 py-24 md:py-28 max-w-5xl mx-auto">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)] mb-2">
        Plivix CMS
      </p>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-8">Content</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {ENTITIES.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEntity(e)}
            className={`rounded-full px-4 py-2 text-sm border transition-colors ${
              entity === e
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mb-10 rounded-2xl border border-[var(--color-line)] p-6 bg-[var(--color-bg-elev)]">
        <p className="text-sm text-[var(--color-fg-muted)] mb-4">Upload asset (public URL)</p>
        <input type="file" onChange={onUpload} className="text-sm max-w-full" />
        {uploadMsg && <p className="mt-3 text-sm font-mono break-all text-[var(--color-accent)]">{uploadMsg}</p>}
      </div>

      {loading && <p className="text-[var(--color-fg-muted)]">Loading…</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {!loading && rows.length > 0 && (
        <ul className="space-y-2 mb-8">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(row.id);
                  setEditor(JSON.stringify(row, null, 2));
                }}
                className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                  selectedId === row.id
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-line-strong)]"
                }`}
              >
                <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{row.id}</span>
                <span className="block mt-1">
                  {row.title || row.name || row.label || row.slug || "(row)"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedId && (
        <div className="space-y-4">
          <textarea
            value={editor}
            onChange={(e) => setEditor(e.target.value)}
            rows={18}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] p-4 font-mono text-xs md:text-sm text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3 text-sm font-medium hover:opacity-90"
          >
            Save changes
          </button>
          <p className="text-xs text-[var(--color-fg-muted)]">
            Sends PATCH with full row JSON merged into <code className="font-mono">id</code>. Remove{" "}
            <code className="font-mono">id</code> from the JSON before editing if your client strips it — the server uses
            the selected row id.
          </p>
        </div>
      )}
    </div>
  );
}
