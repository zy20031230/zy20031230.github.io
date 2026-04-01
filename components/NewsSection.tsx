import { newsItems, type NewsItem } from "@/data/news";

const tagColors: Record<NonNullable<NewsItem["tag"]>, string> = {
  Paper:   "bg-blue-100 text-blue-700",
  Award:   "bg-yellow-100 text-yellow-700",
  Talk:    "bg-green-100 text-green-700",
  Service: "bg-purple-100 text-purple-700",
  Intern:  "bg-orange-100 text-orange-700",
  Misc:    "bg-gray-100 text-gray-600",
};

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export default function NewsSection() {
  return (
    <section id="news" className="py-14 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle>News &amp; Highlights</SectionTitle>

        <ul className="mt-8 space-y-3">
          {newsItems.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              {/* Date */}
              <span className="flex-shrink-0 w-20 text-sm text-gray-400 font-mono pt-0.5">
                {formatDate(item.date)}
              </span>

              {/* Tag */}
              {item.tag && (
                <span
                  className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${tagColors[item.tag]}`}
                >
                  {item.tag}
                </span>
              )}

              {/* Content */}
              <p
                className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </li>
          ))}
        </ul>
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
