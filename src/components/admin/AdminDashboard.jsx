"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  BadgeDollarSign,
  CircleHelp,
  Quote,
  BarChart3,
  Users,
  Briefcase,
  Settings,
  ImageUp,
  Menu as MenuIcon,
  X,
  ExternalLink,
  Plus,
} from "lucide-react";
import EntityPanel from "./EntityPanel";
import SiteSettingsPanel from "./SiteSettingsPanel";

const ENTITY_META = {
  services: { label: "Services", icon: Layers, single: "service", help: "What you sell. Shown on the home page and /services." },
  projects: { label: "Projects", icon: FolderKanban, single: "project", help: "Case studies in the portfolio." },
  pricing_plans: { label: "Pricing", icon: BadgeDollarSign, single: "plan", help: "Plans shown on /pricing. Empty price = custom quote." },
  faqs: { label: "FAQs", icon: CircleHelp, single: "FAQ", help: "Questions answered on the pricing and home pages." },
  testimonials: { label: "Testimonials", icon: Quote, single: "testimonial", help: "Client quotes shown on the home page." },
  stats: { label: "Stats", icon: BarChart3, single: "stat", help: "Numbers in the stats strip." },
  team: { label: "Team", icon: Users, single: "team member", help: "People on the About page." },
  internships: { label: "Careers", icon: Briefcase, single: "role", help: "Open internships and roles." },
};

const CONTENT_ORDER = [
  "services",
  "projects",
  "pricing_plans",
  "faqs",
  "testimonials",
  "stats",
  "team",
  "internships",
];

function NavButton({ active, icon: Icon, children, onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
        active
          ? "bg-[var(--color-accent-soft)] text-[var(--color-fg)]"
          : "text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-fg)]"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="flex-1 truncate">{children}</span>
      {typeof count === "number" && (
        <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{count}</span>
      )}
    </button>
  );
}

function Overview({ counts, onOpen, onNew }) {
  const missing = CONTENT_ORDER.filter((e) => counts[e] && counts[e].error);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)] max-w-xl">
          Manage everything on the public site from here. Changes go live within moments of saving.
        </p>
      </div>

      {missing.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Could not load: {missing.map((e) => ENTITY_META[e].label).join(", ")}. If these are new sections,
          run the database migration (<code className="font-mono">npm run db:ensure</code>) and reload.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CONTENT_ORDER.map((e) => {
          const m = ENTITY_META[e];
          const c = counts[e];
          return (
            <button
              key={e}
              type="button"
              onClick={() => onOpen(e)}
              className="rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-4 text-left hover:border-[var(--color-accent)] transition-colors"
            >
              <m.icon className="h-4 w-4 text-[var(--color-fg-muted)]" aria-hidden />
              <p className="mt-3 font-display text-3xl tabular-nums">
                {c === undefined ? "…" : c.error ? "–" : c.total}
              </p>
              <p className="text-sm text-[var(--color-fg-muted)]">{m.label}</p>
              {c && !c.error && c.draft > 0 && (
                <p className="mt-1 text-[11px] text-[var(--color-fg-subtle)]">{c.draft} draft</p>
              )}
            </button>
          );
        })}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {["projects", "testimonials", "pricing_plans", "faqs", "services"].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onNew(e)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-4 py-2 text-sm hover:border-[var(--color-accent)]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              New {ENTITY_META[e].single}
            </button>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-4 py-2 text-sm font-medium"
          >
            View live site
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-5 text-sm text-[var(--color-fg-muted)] space-y-2">
        <h2 className="text-[var(--color-fg)] font-medium">How it works</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Drag the handle on any list to change the order shown on the site.</li>
          <li>Use the &ldquo;Bengali&rdquo; fields to show text in বাংলা. If left empty, English is shown.</li>
          <li>Set an item to unpublished to hide it without deleting it.</li>
          <li>Contact email, address and social links live under Site settings.</li>
        </ul>
      </section>
    </div>
  );
}

function MediaLibrary({ lastUploadUrl, setLastUploadUrl }) {
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(null);
    setErr(null);
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Upload failed");
      setLastUploadUrl(j.publicUrl || "");
      setMsg(j.publicUrl || "Uploaded");
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(lastUploadUrl);
      setMsg("Copied to clipboard");
    } catch {
      setMsg(lastUploadUrl);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl tracking-tight">Media</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Upload a file to the <code className="font-mono text-[var(--color-accent)]">site-media</code> bucket,
          then paste the URL into any image or video field. Image fields in the editors also have their own
          upload button.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-5 space-y-3">
        <input
          type="file"
          onChange={onUpload}
          disabled={busy}
          className="text-sm max-w-full file:mr-3 file:rounded-lg file:border file:border-[var(--color-line)] file:bg-[var(--color-bg)] file:px-3 file:py-1.5"
        />
        {busy && <p className="text-sm text-[var(--color-fg-muted)]">Uploading…</p>}
        {err && <p className="text-sm text-red-400">{err}</p>}
        {msg && (
          <div className="flex flex-wrap items-start gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] p-3">
            <p className="text-xs font-mono break-all text-[var(--color-accent)] flex-1 min-w-0">{msg}</p>
            {lastUploadUrl && (
              <button
                type="button"
                onClick={copyUrl}
                className="shrink-0 rounded-lg border border-[var(--color-line)] px-2 py-1 text-xs"
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

export default function AdminDashboard() {
  const [view, setView] = useState("overview"); // overview | entity key | site | media
  const [autoNew, setAutoNew] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [lastUploadUrl, setLastUploadUrl] = useState("");
  const [counts, setCounts] = useState({});

  const loadCounts = useCallback(async () => {
    const results = await Promise.all(
      CONTENT_ORDER.map(async (e) => {
        try {
          const res = await fetch(`/api/admin/${e}`, { credentials: "include" });
          const j = await res.json().catch(() => ({}));
          if (!res.ok) return [e, { error: j.error || res.statusText }];
          const rows = j.data || [];
          const draft = rows.filter((r) =>
            ["published", "active", "is_active"].some((k) => k in r && !r[k])
          ).length;
          return [e, { total: rows.length, draft }];
        } catch (ex) {
          return [e, { error: ex.message }];
        }
      })
    );
    setCounts(Object.fromEntries(results));
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const go = (v, createNew = false) => {
    setView(v);
    setAutoNew(createNew);
    setDrawer(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const title =
    view === "overview"
      ? "Overview"
      : view === "site"
        ? "Site settings"
        : view === "media"
          ? "Media"
          : ENTITY_META[view]?.label;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5">
        <p className="font-display text-lg tracking-tight">Plivix</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
          Content manager
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-6">
        <div className="space-y-1">
          <NavButton icon={LayoutDashboard} active={view === "overview"} onClick={() => go("overview")}>
            Overview
          </NavButton>
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
            Content
          </p>
          {CONTENT_ORDER.map((e) => (
            <NavButton
              key={e}
              icon={ENTITY_META[e].icon}
              active={view === e}
              count={counts[e]?.total}
              onClick={() => go(e)}
            >
              {ENTITY_META[e].label}
            </NavButton>
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
            Site
          </p>
          <NavButton icon={Settings} active={view === "site"} onClick={() => go("site")}>
            Site settings
          </NavButton>
          <NavButton icon={ImageUp} active={view === "media"} onClick={() => go("media")}>
            Media upload
          </NavButton>
        </div>
      </nav>
      <div className="border-t border-[var(--color-line)] p-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View live site
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100svh] bg-[var(--color-bg)] text-[var(--color-fg)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--color-line)] bg-[var(--color-bg-elev)] lg:block">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-bg-elev)] px-4 lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawer(true)}
          className="rounded-lg border border-[var(--color-line)] p-2"
        >
          <MenuIcon className="h-4 w-4" aria-hidden />
        </button>
        <p className="font-display truncate">{title}</p>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-xs bg-[var(--color-bg-elev)] border-r border-[var(--color-line)]">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-3 rounded-lg border border-[var(--color-line)] p-2"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <main className="px-4 pb-16 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        {view === "overview" && <Overview counts={counts} onOpen={(e) => go(e)} onNew={(e) => go(e, true)} />}

        {view === "site" && (
          <div className="space-y-6 max-w-3xl">
            <h1 className="font-display text-2xl md:text-3xl tracking-tight">Site settings</h1>
            <SiteSettingsPanel />
          </div>
        )}

        {view === "media" && <MediaLibrary lastUploadUrl={lastUploadUrl} setLastUploadUrl={setLastUploadUrl} />}

        {ENTITY_META[view] && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-tight">{ENTITY_META[view].label}</h1>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{ENTITY_META[view].help}</p>
            </div>
            <EntityPanel
              key={`${view}-${autoNew}`}
              entity={view}
              lastUploadUrl={lastUploadUrl}
              autoNew={autoNew}
              onChanged={loadCounts}
            />
          </div>
        )}
      </main>
    </div>
  );
}
