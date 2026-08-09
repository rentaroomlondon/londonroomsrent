export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: [
          "/login",
          "/register-with-us",
          "/admin",
          "/admin/login",
          "/staff/login",
          "/staff",
          "/staff/dashboard",
          "/admin/dashboard",
          "/forget-password",
          "/dashboard",
          "/make-a-payment",
          "/saved",
          "/raise-a-complain",
          "/report-a-repair",
          "/out-of-office-emergencies",
          "/api",
        ],
      },
    ],
    sitemap: "https://LONDONROOMSRENT.co.uk/sitemap.xml",
    host: "https://LONDONROOMSRENT.co.uk",
  };
}