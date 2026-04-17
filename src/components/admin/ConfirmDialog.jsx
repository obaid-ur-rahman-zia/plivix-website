"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Modal confirm — replaces window.confirm for CMS actions.
 */
export default function ConfirmDialog({
  open,
  title = "Confirm",
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onClose,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus?.();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/65 backdrop-blur-[2px]"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="font-display text-lg text-[var(--color-fg)] mb-2">
          {title}
        </h2>
        <div className="text-sm text-[var(--color-fg-muted)] mb-6">{children}</div>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await Promise.resolve(onConfirm?.());
                onClose?.();
              } catch {
                /* Parent shows error; leave dialog open to retry */
              }
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-medium ${
              danger
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:opacity-95"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
