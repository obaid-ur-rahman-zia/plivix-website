"use client";

import Footer from "@/components/Footer/Footer";
import Loader from "@/components/Loader/Loader";
import NavHeader from "@/components/NavHeader";
import Cursor from "@/components/Cursor/Cursor";
import PageBackground from "@/components/PageBackground";

/**
 * We intentionally do NOT gate the page's opacity on `isComplete` anymore.
 * Previously this wrapper did `opacity: isComplete ? 1 : 0`, which had two
 * problems:
 *   1. If the Loader's exit timeline was interrupted (fast-refresh, a
 *      re-render of the provider, etc.) `isComplete` could read as false for
 *      a frame and the *entire* page would go blank — the bug the user kept
 *      reporting as "fade-in ki waja se kuch show hi ni hota".
 *   2. It was redundant: the Loader is a fixed overlay at z-[9999] with an
 *      opaque background. It already hides the content beneath it during
 *      loading, and clip-paths itself away on complete.
 *
 * Page content is now always rendered at full opacity. The Loader covers it
 * until it finishes.
 */
export default function RootSectionLayout({ children }) {
  return (
    <>
      <Loader />
      <Cursor />
      <PageBackground />
      <div className="relative">
        <NavHeader />
        <main id="main">{children}</main>
        <Footer />
      </div>
    </>
  );
}
