import React, { memo } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const sections = [
    {
      title: "ABOUT US",
      items: [
        { label: "Address:", value: "97 Man Thiện, Hiệp Phú, TP.Thủ Đức, TP.Hồ Chí Minh" },
        { label: "Phone:", value: "(+1234)56789xxx" },
        { label: "Mail:", value: "support@gmail.com" },
      ],
    },
    {
      title: "INFORMATION",
      items: ["Typography", "Gallery", "Store Location", "Today's Deals", "Contact"],
    },
    {
      title: "WHO WE ARE",
      items: ["Help", "Free Shipping", "FAQs", "Return & Exchange", "Testimonials"],
    },
    {
      title: "#OGANIWEBSTORE",
      items: [],
    },
  ];

  return (
    <footer className="w-full bg-slate-600 text-white text-sm pt-10 pb-6">
      <div className="px-4 md:px-0 md:w-main md:mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map(({ title, items }) => (
            <div key={title}>
              <h3 className="text-base font-medium mb-4 border-l-4 border-main pl-3">
                {title}
              </h3>
              {items.length > 0 ? (
                items.map((it, idx) =>
                  typeof it === "string" ? (
                    <div key={idx} className="mb-2 hover:text-main cursor-pointer">
                      {it}
                    </div>
                  ) : (
                    <div key={idx} className="mb-2">
                      <span className="opacity-70">{it.label} </span>
                      <span>{it.value}</span>
                    </div>
                  )
                )
              ) : (
                <p className="opacity-70">Follow us on social networks</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-slate-500 pt-4 text-center text-xs opacity-80">
          © {currentYear} Ogani Webstore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
