import { services } from "@/data/services";

export default function ServicesSection() {
  return (
    <section id="services" className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle>Professional Services</SectionTitle>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((category, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <h3 className="text-base font-semibold text-primary mb-3 pb-2 border-b border-gray-100">
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item, j) => (
                  <li key={j} className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm text-gray-400 mr-1.5">{item.role}:</span>
                      <span className="text-sm text-gray-700">{item.venue}</span>
                    </div>
                    {item.year && (
                      <span className="flex-shrink-0 text-xs text-gray-400 font-mono">
                        {item.year}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-bold text-primary whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
