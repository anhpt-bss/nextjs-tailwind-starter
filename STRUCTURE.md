# Project Structure: tailwind-nextjs-starter-blog

## 1. Tổng quan

Đây là template blog hiện đại sử dụng Next.js (App Router), Tailwind CSS, Contentlayer (quản lý content Markdown/MDX), tích hợp nhiều tính năng blog chuyên nghiệp, dễ mở rộng và cá nhân hóa.

## 2. Cấu trúc thư mục chính

- `app/` — Routing chính, chứa các page (blog, about, projects, tags, ...), layout, SEO, sitemap, API routes.
- `components/` — Các React component tái sử dụng: Header, Footer, Card, Comments, ThemeSwitch, ...
- `layouts/` — Các layout cho bài viết/blog list: PostLayout, PostSimple, PostBanner, ListLayout, ...
- `data/` — Dữ liệu tĩnh: bài viết (blog/), tác giả (authors/), metadata site, navigation, projects, ...
- `css/` — File cấu hình và style cho Tailwind, Prism (highlight code).
- `public/` — Ảnh, favicon, static assets.
- `contentlayer.config.ts` — Cấu hình Contentlayer (schema, plugin cho MDX, ...).
- `scripts/` — Script build, tạo RSS, ...
- `.env.example` — Mẫu biến môi trường cho comment/newsletter.
- `next.config.js` — Cấu hình Next.js (CSP, basePath, ...).
- `postcss.config.js`, `prettier.config.js`, `eslint.config.mjs` — Cấu hình tool dev.
- `README.md`, `STRUCTURE.md` — Tài liệu dự án.

## 2.1. Các thư mục ẩn (bắt đầu bằng dấu chấm)

- `.contentlayer/` — Thư mục cache và dữ liệu tạm do Contentlayer sinh ra khi build hoặc chạy dev. Chứa type, index, cache giúp tăng tốc và cung cấp typed data cho code. Không cần commit lên git.
- `.devcontainer/` — Chứa cấu hình cho Dev Containers hoặc GitHub Codespaces. Định nghĩa môi trường phát triển nhất quán (image, extension, port, command, ...).
- `.github/` — Chứa cấu hình liên quan đến GitHub như workflow CI/CD (Actions), template issue, funding, ...
  - `.github/workflows/`: workflow cho GitHub Actions (build, deploy, test, ...)
  - `.github/ISSUE_TEMPLATE/`: template cho issue/bug/feature request
- `.husky/` — Chứa script cho Husky để thiết lập git hooks (pre-commit, pre-push, ...), thường dùng để chạy lint, format, test tự động trước khi commit/push code.
- `.next/` — Thư mục build output của Next.js, chứa code đã build, cache, static export, ... Dùng khi chạy production hoặc dev server. Không commit lên git.
- `.vscode/` — Chứa cấu hình riêng cho VSCode editor (settings, extension, launch config, ...), giúp đồng bộ môi trường phát triển giữa các thành viên.
- `.yarn/` — Thư mục quản lý cache, state của Yarn (Yarn 2+), lưu trữ cache, plugin, state để tăng tốc cài đặt package. Không commit toàn bộ, chỉ commit file cần thiết nếu dùng Yarn Berry.

## 3. Quy trình phát triển & mở rộng

- **Thêm bài viết:**
  - Viết file Markdown/MDX trong `data/blog/`.
  - Sử dụng frontmatter chuẩn (title, date, tags, ...).
- **Thêm tác giả:**
  - Thêm file trong `data/authors/`.
- **Tùy biến giao diện:**
  - Sửa `tailwind.config.js`, `css/tailwind.css`, hoặc component/layout.
- **Tùy biến navigation:**
  - Sửa `data/headerNavLinks.ts`.
- **Tích hợp comment/newsletter:**
  - Đăng ký dịch vụ, điền biến môi trường vào `.env.local`.
- **SEO, RSS, Sitemap:**
  - Tùy chỉnh trong `data/siteMetadata.js`, `scripts/rss.mjs`, `app/seo.tsx`, ...
- **Thêm tính năng:**
  - Tạo component mới trong `components/`, hoặc page mới trong `app/`.
  - Sử dụng Contentlayer để mở rộng schema content nếu cần.

## 4. Hướng phát triển

- Tích hợp thêm dịch vụ analytics, comment, newsletter mới.
- Hỗ trợ đa ngôn ngữ (i18n).
- Thêm custom page (portfolio, showcase, ...).
- Tối ưu SEO, tốc độ tải trang, accessibility.
- Viết thêm tài liệu hướng dẫn chi tiết cho người dùng mới.

## 5. Thư viện sử dụng trong dự án

### 5.1. Core Framework & UI

- **next**: Framework React hỗ trợ SSR/SSG, routing, API routes, tối ưu SEO, image, font, ...
- **react, react-dom**: Thư viện React chính, xây dựng UI component.
- **tailwindcss**: Framework CSS utility-first, giúp style nhanh, responsive, dễ tuỳ biến.
- **@headlessui/react**: Bộ UI component không style sẵn, dễ tuỳ biến với Tailwind.
- **@tailwindcss/forms, @tailwindcss/typography, @tailwindcss/postcss**: Plugin mở rộng cho Tailwind (form, typography, tích hợp postcss).

### 5.2. Content & Markdown/MDX

- **contentlayer2, next-contentlayer2**: Quản lý content Markdown/MDX, sinh type, import dữ liệu bài viết/tác giả vào code.
- **gray-matter**: Parse frontmatter trong file markdown.
- **remark, remark-gfm, remark-math, remark-github-blockquote-alert**: Xử lý markdown, hỗ trợ GFM (table, checklist), math, alert.
- **rehype-\***: Xử lý HTML sau khi parse markdown (slug heading, autolink, highlight code, KaTeX, citation, minify, ...).
- **unist-util-visit**: Duyệt AST markdown để custom plugin.
- **github-slugger**: Tạo slug cho heading, dùng cho anchor link/toc.
- **hast-util-from-html-isomorphic**: Parse HTML sang AST, dùng cho custom icon heading.

### 5.3. UI/UX & Theme

- **next-themes**: Hỗ trợ dark/light mode, theme switcher.
- **body-scroll-lock**: Khoá scroll khi mở modal/menu mobile.

### 5.4. Build & Tooling

- **esbuild**: Bundler siêu nhanh, dùng cho build plugin hoặc script.
- **postcss**: Xử lý CSS, tích hợp với Tailwind.
- **pliny**: Hỗ trợ blog, RSS, SEO, sitemap, analytics, comment, newsletter, search, ...

### 5.5. Lint & Format

- **eslint, @eslint/js, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint-config-next, eslint-config-prettier, eslint-plugin-prettier**: Lint code JS/TS/React, tuân thủ best practice, tích hợp Prettier.
- **prettier, prettier-plugin-tailwindcss**: Format code, sắp xếp class Tailwind tự động.
- **husky, lint-staged**: Thiết lập git hook, tự động lint/format trước khi commit.
- **globals**: Cung cấp global variable cho ESLint.

### 5.6. Khác

- **image-size**: Lấy kích thước ảnh khi build.
- **reading-time**: Ước lượng thời gian đọc bài viết.

### 5.7. Cách dùng trong dự án

- **Tất cả các thư viện trên được khai báo trong package.json và cài đặt qua yarn.**
- **Các thư viện markdown/MDX (remark, rehype, contentlayer) được cấu hình trong contentlayer.config.ts để parse, mở rộng, và sinh type cho bài viết/tác giả.**
- **Các plugin Tailwind, HeadlessUI, NextThemes... được import và sử dụng trực tiếp trong component/layout.**
- **ESLint, Prettier, Husky, Lint-staged được cấu hình để đảm bảo code sạch, format chuẩn, tự động kiểm tra trước khi commit.**
- **Pliny giúp tích hợp nhanh các tính năng blog hiện đại như RSS, sitemap, comment, newsletter, analytics, ...**

---

> Xem thêm chi tiết trong README.md và FAQ của dự án để biết cách mở rộng, cá nhân hóa, và deploy.
