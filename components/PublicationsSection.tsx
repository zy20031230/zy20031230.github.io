"use client";

import { useState, useMemo } from "react";
import { publications, type Publication } from "@/data/publications";

// ── 工具函数 ─────────────────────────────────────────────────

function groupByYear(pubs: Publication[]) {
  const map = new Map<number, Publication[]>();
  for (const p of pubs) {
    if (!map.has(p.year)) map.set(p.year, []);
    map.get(p.year)!.push(p);
  }
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

/** 将 *Name* 加粗渲染 */
function renderAuthors(authors: string[]) {
  return authors.map((author, i) => {
    const isBold = author.startsWith("*") && author.endsWith("*");
    const name = isBold ? author.slice(1, -1) : author;
    return (
      <span key={i}>
        {i > 0 && ", "}
        {isBold ? <strong className="text-primary">{name}</strong> : name}
      </span>
    );
  });
}

type LinkKey = keyof NonNullable<Publication["links"]>;
const linkLabels: Record<LinkKey, string> = {
  pdf: "PDF",
  code: "Code",
  project: "Project",
  slides: "Slides",
  poster: "Poster",
  video: "Video",
};

// ── 单篇论文卡片 ──────────────────────────────────────────────

function PubCard({ pub }: { pub: Publication }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-accent transition-colors">
            {pub.title}
          </h3>

          {/* Authors */}
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">
            {renderAuthors(pub.authors)}
          </p>

          {/* Venue + badges */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 italic">{pub.venue}</span>
            <span className="text-sm font-semibold text-accent">{pub.venueShort}</span>
            {pub.award && (
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded px-1.5 py-0.5 font-medium">
                🏆 {pub.award}
              </span>
            )}
            {pub.selected && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 font-medium">
                ★ Selected
              </span>
            )}
          </div>

          {/* Links */}
          <div className="mt-2 flex flex-wrap gap-2">
            {pub.links &&
              (Object.keys(pub.links) as LinkKey[]).map((key) =>
                pub.links![key] ? (
                  <a
                    key={key}
                    href={pub.links![key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline border border-accent/30 rounded px-2 py-0.5 hover:bg-accent/5 transition-colors"
                  >
                    [{linkLabels[key]}]
                  </a>
                ) : null
              )}
            {pub.abstract && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-0.5 hover:bg-gray-50 transition-colors"
              >
                {expanded ? "▲ Abstract" : "▼ Abstract"}
              </button>
            )}
          </div>

          {/* Abstract */}
          {expanded && pub.abstract && (
            <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed border-l-2 border-accent/30">
              {pub.abstract}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────

type FilterMode = "all" | "selected";

export default function PublicationsSection() {
  const [mode, setMode] = useState<FilterMode>("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const allYears = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    []
  );

  const filtered = useMemo(() => {
    let pubs = publications;
    if (mode === "selected") pubs = pubs.filter((p) => p.selected);
    if (yearFilter !== "all") pubs = pubs.filter((p) => p.year === yearFilter);
    return pubs;
  }, [mode, yearFilter]);

  const grouped = groupByYear(filtered);
  const selectedCount = publications.filter((p) => p.selected).length;

  return (
    <section id="publications" className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle>Publications</SectionTitle>

        {/* Filter bar */}
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
          {/* Mode tabs */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            <button
              onClick={() => setMode("all")}
              className={`px-4 py-1.5 font-medium transition-colors ${
                mode === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              All ({publications.length})
            </button>
            <button
              onClick={() => setMode("selected")}
              className={`px-4 py-1.5 font-medium transition-colors border-l border-gray-200 ${
                mode === "selected"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Selected ({selectedCount})
            </button>
          </div>

          {/* Year filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setYearFilter("all")}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                yearFilter === "all"
                  ? "bg-accent text-white border-accent"
                  : "border-gray-200 text-gray-500 hover:border-accent hover:text-accent"
              }`}
            >
              All Years
            </button>
            {allYears.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  yearFilter === y
                    ? "bg-accent text-white border-accent"
                    : "border-gray-200 text-gray-500 hover:border-accent hover:text-accent"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Publication list */}
        {grouped.length === 0 ? (
          <p className="mt-10 text-center text-gray-400 text-sm">No publications found.</p>
        ) : (
          grouped.map(([year, pubs]) => (
            <div key={year} className="mt-8">
              <h3 className="text-lg font-bold text-gray-300 mb-2 flex items-center gap-2">
                {year}
                <span className="text-xs font-normal text-gray-400">({pubs.length})</span>
              </h3>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 divide-y divide-gray-50">
                {pubs.map((pub, i) => (
                  <PubCard key={i} pub={pub} />
                ))}
              </div>
            </div>
          ))
        )}
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
