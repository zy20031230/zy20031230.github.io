import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zy20031230.github.io"),
  title: "DynBench｜AutoResearch 驱动的动态异常数据基准",
  description:
    "全中文交互式项目演示：异常分类体系、高质量种子数据库、AutoResearch 双循环动态评测机制、Leaderboard 与迭代案例。",
  openGraph: {
    title: "DynBench｜以 AutoResearch 构建动态异常数据基准",
    description:
      "Inner Loop 生成高区分度数据，Outer Loop 持续改进 Tools 与 Skills。",
    type: "website",
    locale: "zh_CN",
    url: "https://zy20031230.github.io/autoresearch-demo/",
    images: [
      {
        url: "https://zy20031230.github.io/autoresearch-demo/og.png",
        width: 1200,
        height: 630,
        alt: "DynBench 动态异常数据 Benchmark 项目演示",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DynBench｜AutoResearch 动态异常数据 Benchmark",
    description: "数据越出越难，策略越用越强。",
    images: ["https://zy20031230.github.io/autoresearch-demo/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
