// ============================================================
//  News & Highlights — 最新动态，倒序排列（最新在最前）
// ============================================================

export type NewsItem = {
  date: string;       // 格式 "YYYY-MM" 或 "YYYY-MM-DD"
  content: string;    // 支持简单 HTML，如 <a href="...">链接</a>
  tag?: "Paper" | "Award" | "Talk" | "Service" | "Misc" | "Intern";
};

export const newsItems: NewsItem[] = [
  {
    date: "2026-11",
    tag: "Misc",
    content:
      'Published an interactive research survey: <a href="/visual-coding-survey/" class="text-accent hover:underline font-medium">走出终端之后：Visual Coding 与游戏评测的下半场 (62 Papers &amp; 10 Blogs)</a>.',
  },
  {
    date: "2026-02",
    tag: "Paper",
    content:
      'One paper accepted to ICLR 2026',
  },
  {
    date: "2024-08",
    tag: "Intern",
    content:
      'I start my visiting at NUS NExT++ Lab',
  },
];
