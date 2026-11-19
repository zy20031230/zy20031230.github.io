// ============================================================
//  Research Notes & Surveys — 学术综述与深度技术笔记
// ============================================================

export type ResearchNote = {
  title: string;
  subtitle: string;
  date: string;
  href: string;
  badge: string;
  summary: string;
  tags: string[];
};

export const researchNotes: ResearchNote[] = [
  {
    title: "走出终端之后：Visual Coding 与游戏评测的下半场",
    subtitle:
      "Beyond the Terminal: Task Construction, Capability Boundaries, and Verifiers in Visual & Interactive Coding (2018–2026)",
    date: "2026-11",
    href: "/visual-coding-survey/",
    badge: "Survey · 62 Papers & 10 Blogs",
    summary:
      "面向 AI 研究者与 Benchmark 制作者的系统综述：包含实时三维光栅化故障与六类自动验证器交互沙盘，剖析纯文本代码 RLVR 通用配方走出终端后失效的三大支点、前沿模型在三维与游戏引擎上的四堵能力高墙，以及面向开源游戏模组基准 ModBench 的双轨工程推演。",
    tags: ["Visual Coding", "Benchmark Design", "Verifier", "3D & Game Engines", "ModBench"],
  },
];
