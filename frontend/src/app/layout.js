import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from "./Shared/Nexttoast";
import LayoutWrapper from "./Shared/LayoutWrapper";
import { AdminAuthProvider } from "./Context/AdminAuthContext";
import "leaflet/dist/leaflet.css";
// import CrispChat from "./Shared/CrispChat";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

// DM Sans - body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Playfair Display - headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://LONDONROOMSRENT.co.uk"),

  title: {
    default: "LONDONROOMSRENT | Rooms for Rent in London, Flatshares & Apartments",
    template: "%s | LONDONROOMSRENT",
  },

  description:
    "Find rooms for rent in London with LONDONROOMSRENT. Browse verified flatshares, affordable rooms, and apartments across all London areas. Fast, secure, and easy to book.",

  keywords: [
    "rooms for rent london",
    "LONDONROOMSRENT",
    "flatshare london",
    "cheap rooms london",
    "apartments london rent",
    "london property rental",
    "shared accommodation london",
  ],

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk",
  },

  // Google Search Console verification
  verification: {
    google: "DlWtlOAaZt4V4lIY8EF1RQsz3zCN3cwgk8uF2b8wnKM",
  },

  openGraph: {
    title: "LONDONROOMSRENT | Rooms for Rent in London",
    description:
      "Browse verified rooms, flatshares, and apartments across London with LONDONROOMSRENT.",
    url: "https://LONDONROOMSRENT.co.uk",
    siteName: "LONDONROOMSRENT",
    locale: "en_GB",
    type: "website",
    // optional fallback image
    // images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },

  twitter: {
    card: "summary",
    title: "LONDONROOMSRENT",
    description:
      "Find affordable rooms and flatshares in London with LONDONROOMSRENT.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      {/* <head>

        <meta name="facebook-domain-verification" content="o7vox7j07wqf5mykjouqbko1qp7pvv" />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ws034ts301");
          `}
        </Script>
      </head> */}
      <body className="antialiased">
        <AuthProvider>
          <AdminAuthProvider>
          <LayoutWrapper>
          {children}

          {/* Google Analytics */}
          <GoogleAnalytics gaId="G-Y7J5NJNX6G" />
          <ToastContainer 
            theme="dark"
            position="top-right"
            autoClose={5000}
            closeOnClick
            pauseOnHover={false} 
          />
          </LayoutWrapper>
          </AdminAuthProvider>
        </AuthProvider>
        {/* <CrispChat /> */}
      </body>
    </html>
  );
}