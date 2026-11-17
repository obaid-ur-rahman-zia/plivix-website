/** Plain mono index numeral (01, 02 …). Replaces the earlier coloured icon boxes. */
export default function IconChip({ index, className = "" }) {
  return (
    <span className={`font-mono text-xs w-7 shrink-0 tabular-nums text-[var(--color-accent)] ${className}`} aria-hidden>
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}
