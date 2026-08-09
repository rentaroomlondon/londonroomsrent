import { notFound } from "next/navigation";
import Client from "./client";
import ListingSchema from "./component/ListingSchema";

// 🔥 Fetch Listing (ISR for SEO + performance)
const getListing = async (slug) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/${slug}`,
      {
        next: { revalidate: 60 }, // ✅ BEST PRACTICE
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.listing;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

// 🔥 SEO METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const listing = await getListing(slug);

  const baseUrl = "https://LONDONROOMSRENT.co.uk";

  // ❌ Not found → noindex
  if (!listing) {
    return {
      title: "Listing Not Found | LONDONROOMSRENT",
      description: "This property is not available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // 🔥 Dynamic Fields
  const city = listing.location?.city || "London";
  const postcode = listing.location?.postcode || "";
  const roomType = listing.roomType || "room";

  const url = `${baseUrl}/listings/${slug}`;

  const image =
    listing.images?.[0] ||
    `${baseUrl}/default-property.jpg`;

  // 🔥 Smart Description
  const description = listing.description
    ? `${listing.description.slice(0, 120)}... ${roomType} in ${city}. £${listing.monthlyPrice}/month. Book now.`
    : `${roomType} for rent in ${city}. £${listing.monthlyPrice}/month. Fully furnished property in London.`;

  // 🔥 SEO Title (HIGH CTR)
  const title = `${listing.title} in ${city} ${postcode} | £${listing.monthlyPrice} PCM`;

  return {
    metadataBase: new URL(baseUrl),

    title,
    description,

    // ✅ Canonical
    alternates: {
      canonical: url,
    },

    // ✅ Robots
    robots: {
      index: true,
      follow: true,
    },

    // ✅ OpenGraph
    openGraph: {
      title,
      description,
      url,
      siteName: "LONDONROOMSRENT",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },

    // ✅ Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    // ⚠️ Optional (low impact but safe)
    keywords: [
      listing.title,
      "rooms for rent London",
      `${roomType} in ${city}`,
      `cheap ${roomType} London`,
    ],
  };
}

// 🔥 PAGE (SSR)
const Page = async ({ params }) => {
  const { slug } = await params;

  const listing = await getListing(slug);

  if (!listing) return notFound();

  return (
    <>
      {/* ✅ Structured Data (clean & separate) */}
      <ListingSchema listing={listing} />

      {/* UI */}
      <Client listing={listing} />
    </>
  );
};

export default Page;