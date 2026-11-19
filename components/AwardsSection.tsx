import { awards } from "@/data/awards";

export default function AwardsSection() {
  return (
    <section id="awards" className="py-14 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle>Honors &amp; Awards</SectionTitle>

        <div className="mt-8 relative">
          {/* Timeline vertical line */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />

          <ul className="space-y-5">
            {awards.map((award, i) => (
              <li key={i} className="flex items-start gap-6 relative">
                {/* Year badge */}
                <span className="flex-shrink-0 w-14 text-right text-sm font-mono font-semibold text-accent pt-0.5">
                  {award.year}
                </span>

                {/* Dot */}
                <div className="hidden md:flex flex-shrink-0 w-4 h-4 rounded-full bg-accent border-2 border-white shadow-sm mt-0.5 -ml-2 z-10" />

                {/* Content */}
                <div className="flex-1 pb-1">
                  <p className="text-sm font-semibold text-gray-800">{award.title}</p>
                  <p className="text-sm text-gray-500">{award.organization}</p>
                  {award.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{award.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
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
