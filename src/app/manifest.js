export default function manifest() {
  return {
    name: "Plivix Technologies",
    short_name: "Plivix",
    description: "ERP, web, mobile and AI software for companies in Bangladesh and worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
