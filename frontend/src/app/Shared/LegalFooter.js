import React from "react";

const LegalFooter = ({ items = [] }) => {
  const currentYear = new Date().getFullYear();

  // Fallback defaults if no items are passed
  const defaultItems = [
    { label: `© ${currentYear} LONDONROOMSRENT. All Rights Reserved.` },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ];

  const renderItems = items.length > 0 ? items : defaultItems;

  return (
    <footer className="w-full bg-[#0D131F] border-t border-slate-800/80 py-6 px-4 font-sans text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Navigation / Items List */}
        <nav aria-label="Legal Links" className="w-full">
          <ul className="flex flex-wrap items-center justify-center md:justify-center gap-y-2 gap-x-3 text-slate-400 font-normal">
            {renderItems.map((item, index) => {
              const text =
                typeof item === "string"
                  ? item.replace("{year}", currentYear.toString())
                  : item.label?.replace("{year}", currentYear.toString());

              const href = typeof item === "object" ? item.href : null;

              return (
                <li key={index} className="flex items-center gap-3">
                  {href ? (
                    <a
                      href={href}
                      className="transition-colors duration-200 hover:text-[#FF7A45] hover:underline underline-offset-4"
                    >
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}

                  {/* Bullet Separator */}
                  {index !== renderItems.length - 1 && (
                    <span
                      className="w-1 h-1 rounded-full bg-slate-600/60"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

      </div>
    </footer>
  );
};

export default LegalFooter;