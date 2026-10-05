export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.hikmatyar.site/#person",
        "name": "Hikmatyar",
        "url": "https://www.hikmatyar.site",
        "image": "https://www.hikmatyar.site/placeholder-media/about/portrait.png",
        "jobTitle": "Brand Identity Designer & Growth Strategist",
        "description":
          "Independent brand identity designer and campaign strategist working with founders, studios, and creators. Brand systems built with intent, not templates.",
        "sameAs": ["https://cal.com/hikmatyar"],
        "knowsAbout": [
          "Brand Strategy",
          "Visual Identity",
          "Logo Design",
          "Campaign Direction",
          "Motion Graphics",
          "Growth Automation",
          "Design Systems"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://www.hikmatyar.site/#service",
        "name": "Hikmatyar Studio",
        "url": "https://www.hikmatyar.site",
        "logo": "https://www.hikmatyar.site/brand/hikmatyar-wordmark.png",
        "image": "https://www.hikmatyar.site/og-image.png",
        "description":
          "Independent brand identity design, campaign direction, and growth automation for founders, studios, and creators.",
        "founder": {
          "@id": "https://www.hikmatyar.site/#person"
        },
        "priceRange": "$$$$",
        "email": "hikmodesiner03@gmail.com",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Creative Disciplines",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Brand & Identity",
                "description":
                  "Brand strategy, logo systems, identity design, and usage guidelines built for long-term equity."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Campaign & Content",
                "description":
                  "High-impact campaign design, art direction, motion graphics, and strategic social launch content."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Growth & Automation",
                "description":
                  "AI automation workflows, B2B lead generation architecture, and high-converting outreach systems."
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.hikmatyar.site/#website",
        "url": "https://www.hikmatyar.site",
        "name": "Hikmatyar — Brand Identity & Campaign Designer",
        "publisher": {
          "@id": "https://www.hikmatyar.site/#person"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
