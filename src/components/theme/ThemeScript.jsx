// Server component — injects a tiny blocking script into <head> so the theme
// attribute is set BEFORE hydration (avoids flash of wrong theme).
export default function ThemeScript() {
  const code = `(function(){try{var k='plivix.theme';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var r=(s==='light'||s==='dark')?s:m;document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return (
    <script
      // Must run inline before first paint; no defer/async.
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
