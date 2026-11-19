import { researchNotes } from "@/data/notes";

export default function NotesSection() {
  return (
    <section id="notes" className="py-14 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle>Research Notes &amp; Surveys</SectionTitle>

        <div className="mt-8 space-y-4">
          {researchNotes.map((note, i) => (
            <a
              key={i}
              href={note.href}
              className="group block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-accent/40 hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">
                    {note.badge}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{note.date}</span>
                </div>
                <span className="text-xs font-medium text-accent group-hover:translate-x-0.5 transition-transform">
                  Read Full Survey →
                </span>
              </div>

              <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors leading-snug">
                {note.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{note.subtitle}</p>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{note.summary}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
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
