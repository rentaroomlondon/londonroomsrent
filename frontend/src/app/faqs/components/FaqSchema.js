const FaqSchema = ({ data }) => {
  if (!data || data.length === 0) return null;

  // ✅ Remove duplicate questions automatically
  const uniqueFaqs = Array.from(
    new Map(data.map((item) => [item.question, item])).values()
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: uniqueFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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

export default FaqSchema;