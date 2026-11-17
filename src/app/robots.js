export default function robots() {
  return {
    rules: [
      // Search and AI assistants are welcome on the public site.
      { userAgent: "*", allow: "/", disallow: ["/plivix-manage/", "/api/", "/auth"] },
    ],
    sitemap: "https://www.plivix-tech.com/sitemap.xml",
    host: "https://www.plivix-tech.com",
  };
}
