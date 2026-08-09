export const dynamic = "force-dynamic";
export const revalidate = 86400; // 🔥 VERY IMPORTANT

export default async function sitemap() {
  const baseUrl = "https://LONDONROOMSRENT.co.uk";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings`,
      {
        cache: "no-store", // already good
      }
    );

    const data = await res.json();

    // ✅ YOUR API STRUCTURE
    const properties = data.listings || [];

    // 🔥 DEBUG (remove later)
    console.log("PROPERTIES COUNT:", properties.length);

    const propertyUrls = properties
      .filter((property) => property.slug)
      .map((property) => ({
        url: `${baseUrl}/listings/${property.slug}`,
        lastModified: new Date(property.updatedAt || Date.now()),
        changeFrequency: "daily",
        priority: 0.9,

        images:
          property.images
            ?.map((img) => {
              if (!img) return null;

              if (typeof img === "string") {
                return img.startsWith("http")
                  ? img
                  : `${baseUrl}${img}`;
              }

              if (typeof img === "object") {
                return img.url || img.src || null;
              }

              return null;
            })
            .filter(Boolean) || [],
      }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
        images: [
          `${baseUrl}/LONDONROOMSRENT.png`,
          `${baseUrl}/Hero.avif`,
          `${baseUrl}/trophy.avif`,
        ],
      },

      {
        url: `${baseUrl}/find-a-room`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/how-it-works`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/why-choose-us`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        images: [
          `${baseUrl}/woman-sitting.avif`,
          `${baseUrl}/cleaner-window.avif`,
        ],
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        images: [`${baseUrl}/About.avif`],
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        priority: 0.7,
      },
      {
        url: `${baseUrl}/faqs`,
        lastModified: new Date(),
        priority: 0.7,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        priority: 0.5,
      },

      // 🔥 DYNAMIC PROPERTY URLs
      ...propertyUrls,
    ];
  } catch (error) {
    console.error("❌ Sitemap Error:", error);

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}