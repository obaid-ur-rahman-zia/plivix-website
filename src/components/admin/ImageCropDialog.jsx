"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImageBlob } from "@/lib/admin/cropImage";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {string | null} props.imageSrc — object URL or remote URL
 * @param {number} props.aspect — width / height (1 = square)
 * @param {string} props.fileName — base name for export
 * @param {string} props.mimeHint — original file type
 * @param {() => void} props.onCancel
 * @param {(file: File) => void} props.onApply
 */
export default function ImageCropDialog({ open, imageSrc, aspect, fileName, mimeHint, onCancel, onApply }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const onCropComplete = useCallback((_area, croppedAreaPixels) => {
    setPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    if (!open || !imageSrc) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPixels(null);
    setErr(null);
  }, [open, imageSrc]);

  const handleApply = async () => {
    if (!imageSrc || !pixels) return;
    setErr(null);
    setBusy(true);
    try {
      const usePng = mimeHint === "image/png" || mimeHint === "image/webp";
      const mime = usePng ? "image/png" : "image/jpeg";
      const blob = await getCroppedImageBlob(
        imageSrc,
        pixels,
        mime,
        usePng ? undefined : 0.92
      );
      const ext = usePng ? "png" : "jpg";
      const base = (fileName || "image").replace(/\.[^.]+$/, "");
      const file = new File([blob], `${base}-cropped.${ext}`, { type: mime });
      onApply(file);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Crop failed");
    } finally {
      setBusy(false);
    }
  };

  if (!open || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-dialog-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-4 shadow-2xl">
        <h2 id="crop-dialog-title" className="font-display text-lg text-[var(--color-fg)] mb-3">
          Crop image
        </h2>
        <p className="text-[11px] text-[var(--color-fg-muted)] mb-3">
          Drag to reposition, use the slider to zoom. Then apply to upload.
        </p>
        <div className="relative h-[min(320px,50vh)] w-full overflow-hidden rounded-xl bg-[var(--color-bg-soft)]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-[11px] text-[var(--color-fg-muted)] shrink-0">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[var(--color-accent)]"
          />
        </div>
        {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={busy || !pixels}
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-on-accent)] disabled:opacity-50"
          >
            {busy ? "Processing…" : "Apply & upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
