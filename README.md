# SNSTeam Portal - 日不落汉化组门户网站

这是一个基于 [Astro](https://astro.build) 框架开发的现代化门户网站。

## 技术栈

- **框架**: [Astro 5.x](https://astro.build) - 极速的静态网站生成器。
- **样式**: [Tailwind CSS v4](https://tailwindcss.com) - 采用最新的 CSS-first 配置方式。
- **UI 组件库**: [FlyonUI](https://flyonui.com) - 基于 Tailwind CSS 的组件库。
- **动画**: [Motion](https://motion.dev) (原 Framer Motion) - 提供高性能的浏览器端动画。
- **粒子效果**: [tsParticles](https://particles.js.org) - 用于首页背景的定制粒子系统。
- **轮播组件**: [Swiper](https://swiperjs.com) - 用于实现轮播界面效果。
- **包管理器**: [Bun](https://bun.sh) - 兼顾速度与兼容性。

## 项目结构

```text
/
├── public/                    # 静态资源（不经过 Vite 处理）
├── src/
│   ├── assets/                # 源码引用的资源（图片、图标等）
│   ├── components/            # 按页面组织的 Astro 组件
│   ├── layouts/               # 页面布局模板
│   ├── pages/                 # 路由页面
│   ├── scripts/               # 客户端 TypeScript 交互脚本
│   └── styles/                # 全局样式（Tailwind v4 配置文件）
├── astro.config.ts            # Astro 配置文件
├── tsconfig.json              # TypeScript 配置（含路径别名）
├── eslint.config.ts           # ESLint 配置
└── package.json               # 依赖与脚本定义
```

## 常用命令

所有命令均在项目根目录下通过终端执行：

| 命令 | 描述 |
| :--- | :--- |
| `bun install` | 安装项目依赖 |
| `bun dev` | 启动本地开发服务器 (`localhost:4321`) |
| `bun build` | 构建用于生产环境的静态文件 (`./dist/`) |
| `bun preview` | 在本地预览构建后的静态网站 |
| `bun astro ...` | 执行 Astro CLI 命令 |

## 内容维护指南

本项目的大部分文档内容（如帮助、下载页面）均使用 MDX 编写。

### Frontmatter 配置
每个 MDX 文件顶部需要包含 Frontmatter 配置（系统会自动应用 `PageLayout`）：
```yaml
---
title: "页面标题"
description: "页面描述（用于 SEO）"
image: "特色图片 URL（用于 SEO）" # 可选
toc: "on" # 可选，"on" 开启侧边目录，"off" 关闭（默认为 "on"）
---
```

### 如何添加新页面
1. 在 `src/pages/` 目录下创建新的 `.mdx` 文件。
2. 添加上述 Frontmatter 配置。
3. 编写 Markdown 内容，支持标准的 Markdown 语法、HTML 和 Tailwind CSS 类名。
4. 可以导入并使用 Astro 组件（如 `import Icon from "@components/Icon.astro"`）。

### 侧边目录 (Table of Contents)
- 侧边目录根据页面内的标题（`##`, `###` 等）自动生成。
- 只有 H2（`##`）及其子标题会被收纳进目录。
- 可以通过设置 `toc: "off"` 来禁用侧边目录。

## 许可证

本项目的代码部分遵循 MIT 许可证。网站所涉及的游戏素材版权归原权利人（07th Expansion / Entergram）所有。
