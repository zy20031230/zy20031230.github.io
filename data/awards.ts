// ============================================================
//  Honors & Awards — 荣誉与奖项
// ============================================================

export type Award = {
  year: string;
  title: string;
  organization: string;
  description?: string;
};

export const awards: Award[] = [
  {
    year: "2025",
    title: "Honor Teaching Assistant in USTC",
    organization: "University of Science and Technology of China",
  },
];
