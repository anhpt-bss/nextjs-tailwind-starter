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

---

> Xem thêm chi tiết trong README.md và FAQ của dự án để biết cách mở rộng, cá nhân hóa, và deploy.
