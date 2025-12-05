import Link from "next/link";
import './LandingPageStyles.css'

export default function Footer() {
  const columns = [
    {
      title: "Product",
      items: ["Policy engine", "Onboard", "Decide", "Lifecycle", "Data platform"],
    },
    {
      title: "Industries",
      items: ["Financial technology", "Banking", "Platforms"],
    },
    {
      title: "Customers",
      items: ["Compliance", "Revenue", "Technology"],
    },
    {
      title: "Company",
      items: ["About", "News", "Careers"],
    },
    {
      title: "Resources",
      items: ["Trust", "Status"],
    },
  ];

  return (
    <footer className="relative -mt-[4rem] w-full min-h-[87vh] font-[LandingFont]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: "url('/FooterImage.avif')",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-20 pb-10 text-white">
        {/* Column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-10">
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-lg font-semibold">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white">
                {col.items.map((it) => (
                  <li key={it}>
                    <Link href="#" className="hover:underline text-[1rem]">
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="absolute bottom-8 border-t border-white/10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white/80">
          <div className="text-gray-300">
            <span>© Intervyu 2025</span>
            <span className="mx-4">•</span>
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <span className="mx-4">•</span>
            <Link href="#" className="hover:underline">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}