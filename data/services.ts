// ============================================================
//  Professional Services — 学术服务
// ============================================================

export type ServiceCategory = {
  category: string;
  items: {
    role: string;
    venue: string;
    year?: string;
  }[];
};

export const services: ServiceCategory[] = [
  {
    category: "Reviewer",
    items: [
      { role: "Reviewer", venue: "NeurIPS", year: "2025" },
      { role: "Reviewer", venue: "ICML", year: "2026" },
      { role: "Reviewer", venue: "ICLR", year: "2025,2026" },
    ],
  },
  {
    category: "TA",
    items: [
      {
        role: "Teaching Assistant",
        venue: "Introduction to Computer Science",
        year: "Fall 2023",
      },
      {
        role: "Teaching Assistant",
        venue: "Mathematical Principles and Algorithms of Artificial Intelligence",
        year: "Fall 2025",
      },
    ],
  },
];
