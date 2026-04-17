"use client";

import { useCallback, useMemo } from "react";
import { socialsObjectToFormString } from "@/lib/admin/socialLinksForm";

const PRESETS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X (Twitter)" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website" },
  { value: "custom", label: "Other" },
];

const base =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

/**
 * @param {object} props
 * @param {string} props.fieldKey
 * @param {string} props.label
 * @param {string} [props.hint]
 * @param {boolean} [props.required]
 * @param {string} props.value — JSON string from `socialsObjectToFormString`
 * @param {(key: string, val: string) => void} props.onChange
 */
export default function SocialLinksField({ fieldKey, label, hint, required, value, onChange }) {
  const rows = useMemo(() => {
    try {
      const parsed = JSON.parse(String(value || "[]"));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      /* fall through */
    }
    return JSON.parse(socialsObjectToFormString({}));
  }, [value]);

  const commit = useCallback(
    (nextRows) => {
      onChange(fieldKey, JSON.stringify(nextRows));
    },
    [fieldKey, onChange]
  );

  const updateRow = (index, patch) => {
    const next = rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
    commit(next);
  };

  const removeRow = (index) => {
    const next = rows.filter((_, i) => i !== index);
    commit(next.length ? next : JSON.parse(socialsObjectToFormString({})));
  };

  const addRow = () => {
    commit([
      ...rows,
      {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `r-${Date.now()}`,
        key: "linkedin",
        url: "",
        customKey: "",
      },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="block text-xs font-medium text-[var(--color-fg-muted)]">
          {label}
          {required && <span className="text-red-400"> *</span>}
        </span>
        <button
          type="button"
          onClick={addRow}
          className="text-[11px] rounded-lg border border-[var(--color-line)] px-2 py-1 text-[var(--color-accent)] hover:border-[var(--color-accent)]"
        >
          + Add link
        </button>
      </div>
      {hint && <p className="text-[11px] text-[var(--color-fg-subtle)]">{hint}</p>}

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.id || index}
            className="flex flex-col gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] p-3 sm:flex-row sm:items-end sm:gap-3"
          >
            <div className="min-w-0 flex-1 sm:max-w-[200px]">
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                Platform
              </label>
              <select
                value={row.key || "linkedin"}
                onChange={(e) => {
                  const key = e.target.value;
                  updateRow(index, { key, customKey: key === "custom" ? row.customKey || "" : "" });
                }}
                className={base}
              >
                {PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {row.key === "custom" && (
              <div className="min-w-0 flex-1 sm:max-w-[160px]">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                  Key
                </label>
                <input
                  type="text"
                  value={row.customKey || ""}
                  onChange={(e) => updateRow(index, { customKey: e.target.value })}
                  placeholder="e.g. dribbble"
                  className={base}
                  autoComplete="off"
                />
              </div>
            )}
            <div className="min-w-0 flex-[2]">
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                URL
              </label>
              <input
                type="url"
                value={row.url || ""}
                onChange={(e) => updateRow(index, { url: e.target.value })}
                placeholder="https://"
                className={base}
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="shrink-0 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 sm:mb-0.5"
              aria-label="Remove row"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
