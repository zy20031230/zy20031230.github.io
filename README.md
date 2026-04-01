# Academic Homepage

个人学术主页，基于 **Next.js 14 + TypeScript + Tailwind CSS** 构建，支持静态导出。

## 快速开始

```bash
npm install
npm run dev        # 开发模式 → http://localhost:3000
```

## 填写个人信息

所有内容数据集中在 `data/` 目录，直接编辑对应文件：

| 文件 | 内容 |
|------|------|
| `data/profile.ts` | 姓名、职位、学校、Lab、Bio、邮箱、社交链接 |
| `data/publications.ts` | 论文列表（标题、作者、会议、链接） |
| `data/news.ts` | News & Highlights |
| `data/services.ts` | 学术服务（PC Member、Reviewer、TA 等） |
| `data/awards.ts` | 荣誉与奖项 |

### 上传头像

将照片命名为 `photo.jpg`（推荐 400×400px）放入 `public/` 目录，
然后修改 `data/profile.ts` 中的：

```ts
photo: "/photo.jpg",
```

### 标记您的名字（论文作者）

在 `publications.ts` 中，将您的名字用 `*星号*` 包裹，会自动加粗显示：

```ts
authors: ["Co-author A", "*Your Name*", "Senior Author"],
```

## 构建与部署

### 静态导出（GitHub Pages / Nginx / OSS）

```bash
npm run build   # 生成 out/ 目录
```

将 `out/` 目录上传到任意静态托管服务。

### 部署到 Vercel

```bash
npm i -g vercel
vercel
```

### 部署到 GitHub Pages

1. 推送到 GitHub 仓库
2. 在 `.github/workflows/` 添加 GitHub Actions 工作流
3. 设置 Pages source 为 `out/` 分支

## 项目结构

```
Homepage/
├── app/
│   ├── globals.css          # 全局样式（含 scroll-behavior: smooth）
│   ├── layout.tsx           # HTML meta / SEO
│   └── page.tsx             # 主页面（组合所有 Section）
├── components/
│   ├── Navbar.tsx            # 顶部固定导航（响应式）
│   ├── BioSection.tsx        # Bio + 头像 + 社交链接
│   ├── NewsSection.tsx       # News & Highlights
│   ├── PublicationsSection.tsx  # 论文列表（All/Selected 切换 + 年份筛选）
│   ├── ServicesSection.tsx   # 学术服务
│   ├── AwardsSection.tsx     # 荣誉奖项（时间线）
│   ├── Footer.tsx
│   └── BackToTop.tsx         # 回到顶部按钮
├── data/                     # ← 在这里填写您的内容
├── public/                   # 静态资源（头像、CV 等）
└── ...
```
