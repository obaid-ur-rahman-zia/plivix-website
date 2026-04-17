"use client";

import { useEffect, useRef, useState } from "react";
import ImageCropDialog from "./ImageCropDialog";
import SocialLinksField from "./SocialLinksField";

const base =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

/** @param {string} s */
function isLikelyImageUrl(s) {
  const t = String(s || "").trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(lower)) return false;
  if (/^https?:\/\//i.test(t)) return true;
  if (t.startsWith("/")) return true;
  return false;
}

function ImagePreview({ url, label }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [url]);
  if (!url || broken || !isLikelyImageUrl(url)) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)]">
      <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
        {label || "Preview"}
      </p>
      <div className="relative aspect-[16/10] w-full max-h-56 bg-[var(--color-bg-soft)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS preview of arbitrary URL */}
        <img
          src={url}
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center"
          onError={() => setBroken(true)}
        />
      </div>
    </div>
  );
}

function GalleryPreviews({ linesText }) {
  const urls = String(linesText || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(isLikelyImageUrl);
  if (urls.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">Gallery preview</p>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, idx) => (
          <div
            key={`${idx}-${url.slice(0, 48)}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-bg-soft)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FieldInput({ field, value, onChange, onPasteLastUrl, onFieldUpload }) {
  const id = `field-${field.key}`;
  const fileRef = useRef(null);
  const appendFileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(null);
  const [cropModal, setCropModal] = useState(null);

  const runUpload = async (file) => {
    if (!onFieldUpload) return;
    setUploadErr(null);
    setUploading(true);
    try {
      await onFieldUpload(field, file);
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const closeCropModal = () => {
    if (cropModal?.src) URL.revokeObjectURL(cropModal.src);
    setCropModal(null);
  };

  const onCropApplyUpload = async (file) => {
    closeCropModal();
    await runUpload(file);
  };

  if (field.type === "social_links") {
    return (
      <SocialLinksField
        fieldKey={field.key}
        label={field.label}
        hint={field.hint}
        required={field.required}
        value={value ?? ""}
        onChange={onChange}
      />
    );
  }

  if (field.type === "text" || field.type === "lines" || field.type === "json") {
    const rows = field.type === "json" ? 8 : field.type === "lines" ? 6 : 4;
    const showAppend = field.type === "lines" && field.media && field.mediaAppend && onFieldUpload;
    const showGalleryPreview = field.type === "lines" && field.preview === "gallery";
    return (
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={id} className="block text-xs font-medium text-[var(--color-fg-muted)]">
            {field.label}
            {field.required && <span className="text-red-400"> *</span>}
          </label>
          {showAppend && (
            <>
              <input
                ref={appendFileRef}
                type="file"
                accept={field.accept || "image/*,video/*"}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) runUpload(f);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => appendFileRef.current?.click()}
                className="text-[11px] rounded-lg border border-[var(--color-line)] px-2 py-1 text-[var(--color-accent)] hover:border-[var(--color-accent)] disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload & append"}
              </button>
            </>
          )}
        </div>
        {field.hint && <p className="text-[11px] text-[var(--color-fg-subtle)]">{field.hint}</p>}
        <textarea
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
          rows={rows}
          className={`${base} font-mono text-xs md:text-sm resize-y min-h-[80px]`}
          spellCheck={field.type !== "json"}
        />
        {showGalleryPreview && <GalleryPreviews linesText={value} />}
        {uploadErr && <p className="text-[11px] text-red-400">{uploadErr}</p>}
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="h-4 w-4 rounded border-[var(--color-line)] text-[var(--color-accent)]"
        />
        <span className="text-sm text-[var(--color-fg)]">{field.label}</span>
      </label>
    );
  }

  const inputType = field.type === "number" ? "number" : field.type === "url" ? "url" : "text";
  const urlWithMedia = field.type === "url" && field.media && onFieldUpload;
  const showCoverPreview = field.type === "url" && field.preview === "image" && value && isLikelyImageUrl(String(value));
  const cropAspect = typeof field.cropAspect === "number" ? field.cropAspect : null;

  return (
    <div className="space-y-1">
      <ImageCropDialog
        open={Boolean(cropModal)}
        imageSrc={cropModal?.src ?? null}
        aspect={cropModal?.aspect ?? 1}
        fileName={cropModal?.fileName ?? "image"}
        mimeHint={cropModal?.mime ?? "image/jpeg"}
        onCancel={closeCropModal}
        onApply={onCropApplyUpload}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="block text-xs font-medium text-[var(--color-fg-muted)]">
          {field.label}
          {field.required && <span className="text-red-400"> *</span>}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {field.type === "url" && onPasteLastUrl && (
            <button
              type="button"
              onClick={() => onPasteLastUrl(field.key)}
              className="text-[11px] text-[var(--color-accent)] hover:underline"
            >
              Use last upload URL
            </button>
          )}
          {urlWithMedia && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept={field.accept || "image/*,video/*"}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (!f) return;
                  const wantsCrop = cropAspect != null && f.type.startsWith("image/");
                  if (wantsCrop) {
                    setCropModal({
                      src: URL.createObjectURL(f),
                      fileName: f.name,
                      mime: f.type,
                      aspect: cropAspect,
                    });
                    return;
                  }
                  runUpload(f);
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="text-[11px] rounded-lg border border-[var(--color-line)] px-2 py-1 text-[var(--color-accent)] hover:border-[var(--color-accent)] disabled:opacity-50"
              >
                {uploading ? "Uploading…" : cropAspect != null ? "Upload & crop" : "Upload"}
              </button>
            </>
          )}
        </div>
      </div>
      {field.hint && <p className="text-[11px] text-[var(--color-fg-subtle)]">{field.hint}</p>}
      <input
        id={id}
        type={inputType}
        value={value ?? ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={urlWithMedia ? `${base} flex-1 min-w-0` : base}
      />
      {showCoverPreview && (
        <ImagePreview url={String(value).trim()} label="Preview" />
      )}
      {uploadErr && <p className="text-[11px] text-red-400">{uploadErr}</p>}
    </div>
  );
}
