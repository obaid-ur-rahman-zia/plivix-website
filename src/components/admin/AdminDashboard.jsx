"use client";

import { useState } from "react";
import { ENTITIES } from "@/lib/admin/entityFieldConfig";
import EntityPanel from "./EntityPanel";
import SiteSettingsPanel from "./SiteSettingsPanel";

export default function AdminDashboard() {
  const [section, setSection] = useState("content");
  const [entity, setEntity] = useState("services");
  const [lastUploadUrl, setLastUploadUrl] = useState("");
  const [uploadMsg, setUploadMsg] = useState(null);
  const [uploadErr, setUploadErr] = useState(null);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg(null);
    setUploadErr(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setUploadErr(j.error || "Upload failed");
      return;
    }
    setLastUploadUrl(j.publicUrl || "");
    setUploadMsg(j.publicUrl || "Uploaded");
    e.target.value = "";
  };

  const copyUrl = async () => {
    if (!lastUploadUrl) return;
    try {
      await navigator.clipboard.writeText(lastUploadUrl);
      setUploadMsg("Copied to clipboard");
    } catch {
      setUploadMsg(lastUploadUrl);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[var(--color-bg)] text-[var(--color-fg)] px-4 py-24 md:py-28 max-w-4xl mx-auto">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)] mb-2">
        Plivix CMS
      </p>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-2">Content</h1>
      <p className="text-sm text-[var(--color-fg-muted)] mb-10 max-w-xl">
        Edit site copy, images, videos, and ordering. Each media field has an Upload button, or use the global
        uploader below and &quot;Use last upload URL&quot; on any URL field.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setSection("content")}
          className={`rounded-full px-4 py-2 text-sm border transition-colors ${
            section === "content"
              ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
              : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setSection("site")}
          className={`rounded-full px-4 py-2 text-sm border transition-colors ${
            section === "site"
              ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
              : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
          }`}
        >
          Site (contact &amp; links)
        </button>
      </div>

      {section === "site" ? (
        <SiteSettingsPanel />
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-8">
            {ENTITIES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEntity(e)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors capitalize ${
                  entity === e
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
                    : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <EntityPanel entity={entity} lastUploadUrl={lastUploadUrl} />
        </>
      )}



<div className="mt-10 rounded-2xl border border-[var(--color-line)] p-5 md:p-6 bg-[var(--color-bg-elev)] space-y-3">
        <p className="text-sm font-medium text-[var(--color-fg)]">Media upload</p>
        <p className="text-xs text-[var(--color-fg-muted)]">
          Files go to the <code className="font-mono text-[var(--color-accent)]">site-media</code> bucket. After
          upload, use the URL in cover, avatar, or gallery fields.
        </p>
        <input type="file" onChange={onUpload} className="text-sm max-w-full file:mr-3 file:rounded-lg file:border file:border-[var(--color-line)] file:bg-[var(--color-bg)] file:px-3 file:py-1.5" />
        {uploadErr && <p className="text-sm text-red-400">{uploadErr}</p>}
        {uploadMsg && (
          <div className="flex flex-wrap items-start gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] p-3">
            <p className="text-xs font-mono break-all text-[var(--color-accent)] flex-1 min-w-0">{uploadMsg}</p>
            {lastUploadUrl && (
              <button
                type="button"
                onClick={copyUrl}
                className="shrink-0 rounded-lg border border-[var(--color-line)] px-2 py-1 text-xs text-[var(--color-fg)]"
              >
                Copy URL
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
