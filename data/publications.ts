// ============================================================
//  Publications 数据 — 按年份倒序排列
//  selected: true  → 在 "Selected Publications" 区域置顶显示
// ============================================================

export type Publication = {
  title: string;
  authors: string[];       // 您的名字用 "*[Your Name]*" 标记，渲染时会加粗
  venue: string;           // 会议 / 期刊全称
  venueShort: string;      // 缩写，如 "NeurIPS 2024"
  year: number;
  selected?: boolean;
  award?: string;          // 如 "Best Paper Award"
  links?: {
    pdf?: string;
    code?: string;
    project?: string;
    slides?: string;
    poster?: string;
    video?: string;
  };
  abstract?: string;
};

export const publications: Publication[] = [
  // ── 2024 ──────────────────────────────────────────────────
  {
    title: "Alphaalign: Incentivizing safety alignment with extremely simplified reinforcement learning",
    authors: ["*Yi Zhang*", "An Zhang", "XiuYu Zhang", "Leheng Sheng", "YuXin Chen", "Zhenkai Liang", "Xiang Wang"],
    venue: "International Conference on Learning Representations",
    venueShort: "ICLR 2026",
    year: 2026,
    selected: true,
    links: {
      pdf: "https://arxiv.org/abs/2507.14987",
      code: "https://github.com/zy20031230",
    },
  },
];
