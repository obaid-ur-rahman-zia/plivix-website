import Link from "next/link";

export const metadata = { title: "Page not found — Plivix Technologies", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">404</p>
      <h1 className="font-display text-4xl md:text-6xl mt-4">Page not found</h1>
      <p className="mt-4 max-w-md text-[var(--color-fg-muted)]">
        The page you are looking for does not exist or has moved. / আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরানো হয়েছে।
      </p>
      <Link href="/" className="mt-8 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3 text-sm font-medium">
        Home / হোম
      </Link>
    </div>
  );
}
