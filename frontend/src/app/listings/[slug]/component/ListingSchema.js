const ListingSchema = ({ listing }) => {
  if (!listing) return null;

  const url = `https://LONDONROOMSRENT.co.uk/listings/${listing.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",

    name: listing.title,
    description: listing.description,
    image: listing.images || [],

    url,

    // 📍 LOCATION
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.location?.city || "London",
      postalCode: listing.location?.postcode || "",
      addressCountry: "UK",
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.location?.coordinates?.[1],
      longitude: listing.location?.coordinates?.[0],
    },

    // 🏠 PROPERTY DETAILS
    occupancy: listing.occupancy || "single",

    // 💰 PRICE
    offers: {
      "@type": "Offer",
      price: listing.monthlyPrice || 0,
      priceCurrency: "GBP",
      availability:
        listing.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    },

    // 🛏️ AMENITIES
    amenityFeature: [
      ...(listing.roomAmenities || []).map((item) => ({
        "@type": "LocationFeatureSpecification",
        name: item,
        value: true,
      })),
      ...(listing.propertyAmenities || []).map((item) => ({
        "@type": "LocationFeatureSpecification",
        name: item,
        value: true,
      })),
    ],

    // 🏷️ EXTRA DETAILS
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Room Type",
        value: listing.roomType,
      },
      {
        "@type": "PropertyValue",
        name: "Property Type",
        value: listing.propertyType,
      },
      {
        "@type": "PropertyValue",
        name: "Furnished",
        value: listing.furnished ? "Yes" : "No",
      },
      {
        "@type": "PropertyValue",
        name: "Available From",
        value: listing.availableFrom,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default ListingSchema;