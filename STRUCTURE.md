# Project Structure: tailwind-nextjs-starter-blog

## 1. Tổng quan

Đây là template blog hiện đại sử dụng Next.js (App Router), Tailwind CSS, Contentlayer (quản lý content Markdown/MDX), tích hợp nhiều tính năng blog chuyên nghiệp, dễ mở rộng và cá nhân hóa.

## 2. Cấu trúc thư mục chính

Client:

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

### 6. Hướng dẫn sử dụng Tailwind CSS trong dự án

#### 6.1. Cấu hình và plugin

- **Cấu hình chính:** `tailwind.config.js` ở thư mục gốc, đã mở rộng màu sắc, font, responsive breakpoint, v.v. theo nhu cầu dự án.
- **Import style:** Toàn bộ style Tailwind được import qua `css/tailwind.css` trong `app/layout.tsx`.
- **Plugin sử dụng:**
  - `@tailwindcss/forms`: Tối ưu giao diện form.
  - `@tailwindcss/typography`: Style đẹp cho markdown/prose.
  - `@tailwindcss/postcss`: Tích hợp postcss.
- **Dark mode:** Sử dụng class `dark:` và quản lý theme qua `next-themes`.
- **Prettier plugin:** Đã cài `prettier-plugin-tailwindcss` để tự động sắp xếp class Tailwind khi format code.

#### 6.2. Quy tắc viết class Tailwind

- **Viết trực tiếp class Tailwind vào thuộc tính `className` của component hoặc thẻ HTML.**
- **Kết hợp nhiều class bằng dấu cách, có thể dùng các prefix như responsive (`md:`), trạng thái (`hover:`, `focus:`, `dark:`), v.v.**
- **Không cần viết CSS custom cho layout thông thường, chỉ cần dùng class Tailwind.**
- **Có thể dùng template string hoặc thư viện như `clsx`/`cn` để điều kiện hóa class.**

**Ví dụ:**

```jsx
<button className="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
  Submit
</button>
```

#### 6.3. Một số lưu ý và best practice

- **Dark mode:** Luôn thêm class `dark:` cho các màu nền, màu chữ nếu muốn hỗ trợ theme tối.
- **Responsive:** Sử dụng các prefix như `sm:`, `md:`, `lg:`, `xl:` để style theo breakpoint.
- **State:** Sử dụng `hover:`, `focus:`, `active:`, `disabled:` để style theo trạng thái tương tác.
- **Form:** Dùng class như `form-input`, `form-select` sẽ tự động được style đẹp nhờ plugin.
- **Typography:** Dùng class `prose` cho nội dung markdown.
- **Sắp xếp class:** Không cần lo lắng về thứ tự class, Prettier sẽ tự động sắp xếp lại.
- **Mở rộng theme:** Nếu muốn thêm màu, font, spacing... hãy sửa trong `tailwind.config.js`.

**Ví dụ nâng cao:**

```jsx
<div className={`rounded p-4 ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>...</div>
```

#### 6.4. Tài liệu tham khảo

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
- [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [Prettier Plugin Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

---

### 7. Hướng dẫn viết file MDX cho blog

#### 7.1. Tổng quan & Công nghệ hỗ trợ

- **MDX** cho phép kết hợp Markdown và JSX, giúp bạn vừa viết nội dung vừa nhúng component React.
- **Contentlayer**: Quét, validate, và chuyển đổi file `.mdx` thành dữ liệu type-safe cho Next.js.
- **Các plugin đã cấu hình:**
  - remark: `remark-gfm`, `remark-math`, `remark-github-blockquote-alert`, `remark-code-titles`, `remark-img-to-jsx`, ...
  - rehype: `rehype-slug`, `rehype-autolink-headings`, `rehype-katex`, `rehype-citation`, `rehype-prism-plus`, ...

#### 7.2. Cấu trúc file MDX & Frontmatter

- Mỗi file blog đặt trong `data/blog/`, mỗi tác giả trong `data/authors/`.
- Đầu file cần có frontmatter dạng YAML:

```mdx
---
title: 'Tiêu đề bài viết'
date: 'YYYY-MM-DD'
tags: ['tag1', 'tag2']
draft: false
summary: 'Tóm tắt ngắn gọn'
layout: PostLayout # hoặc PostSimple, PostBanner
images: ['/static/images/demo.jpg']
authors: ['default', 'sparrowhawk']
bibliography: references-data.bib # (nếu dùng citation)
---
```

- Các trường phổ biến: `title`, `date`, `tags`, `draft`, `summary`, `layout`, `images`, `authors`, `bibliography`, ...

#### 7.3. Markdown & Feature mở rộng

- **Markdown chuẩn:** Hỗ trợ đầy đủ heading, list, table, image, link, blockquote, code block, ...
- **GFM:** Checklist, table, strikethrough, task list, ...
- **Math:** Viết công thức toán với LaTeX giữa `$...$` hoặc `$$...$$`.
- **Code block:**
  - Hỗ trợ highlight, line number, line highlight, copy button.
  - Ví dụ:
    ```js {1,3-4} showLineNumbers
    const x = 1
    // ...
    ```
- **Citation:**
  - Thêm trường `bibliography` vào frontmatter, dùng cú pháp `[@ref]` để trích dẫn.
- **TOC (Table of Contents):**
  - Thêm `<TOCInline toc={props.toc} />` để tự động sinh mục lục.
- **Newsletter:**
  - Thêm `<BlogNewsletterForm title="Like what you are reading?" />` để nhúng form đăng ký.
- **Comment:**
  - Được cấu hình qua `siteMetadata.js`, hỗ trợ Giscus, Utterances, Disqus.
- **Import component:**
  - Có thể import component React từ `components/` và dùng trực tiếp trong MDX:
    ```jsx
    import PageTitle from '../components/PageTitle'
    ;<PageTitle>Tiêu đề tuỳ biến</PageTitle>
    ```
- **Image:**
  - Dùng cú pháp markdown hoặc component tuỳ chỉnh để tối ưu ảnh với Next.js.

#### 7.4. Quy tắc & Best Practice

- Đặt tên file không dấu, dùng `-`.
- Mỗi bài viết nên có `summary` để tối ưu SEO và preview.
- Sử dụng layout phù hợp qua trường `layout`.
- Đặt ảnh vào `public/static/images/` và tham chiếu bằng đường dẫn tuyệt đối.
- Không nên dùng các component phụ thuộc state toàn cục hoặc lifecycle đặc biệt trong MDX.
- Có thể lồng JSX và markdown tự do.
- Sử dụng các feature nâng cao như math, citation, TOC, ... để tăng giá trị nội dung.

## ⚠️ Lưu ý về định dạng dòng (Line Endings: LF/CRLF)

Khi tạo hoặc chỉnh sửa file Markdown/MDX, hãy đảm bảo toàn bộ file sử dụng một kiểu xuống dòng duy nhất (ưu tiên LF - Line Feed, \n).

- Việc trộn lẫn hoặc sử dụng CRLF (\r\n) không nhất quán, đặc biệt ở các dòng `---` đầu/cuối frontmatter, có thể khiến Contentlayer/MDX parser không nhận diện đúng frontmatter, gây lỗi khi build hoặc render (ví dụ: "Element type is invalid").
- Nên thiết lập editor (VSCode, v.v.) tự động lưu file với LF.
- Nếu gặp lỗi không rõ nguyên nhân, hãy kiểm tra và chuyển toàn bộ file về LF để loại trừ vấn đề này.

> **Tip:** Trong VSCode, nhấn vào chỉ báo CRLF/LF ở góc phải dưới và chọn "LF" để chuyển đổi.

---

#### 7.5. Tài liệu tham khảo

- [MDX Docs](https://mdxjs.com/)
- [Contentlayer Docs](https://www.contentlayer.dev/docs/getting-started)
- [Pliny Docs](https://pliny.dev/docs/mdx-features)
- [Remark Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [Rehype Plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
- [KaTeX](https://katex.org/), [rehype-citation](https://github.com/timlrx/rehype-citation), [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)

---

## 2.2. Cấu trúc & Quy ước import alias cho API Server

Server:
.
├── app/
│ └── api/
│ ├── auth/
│ │ ├── login/route.ts
│ │ ├── register/route.ts
│ │ └── logout/route.ts
│ └── users/
│ ├── [id]/route.ts
│ └── route.ts
├── lib/ ← Hàm tiện ích, config
│ ├── db.ts ← Kết nối MongoDB
│ ├── auth.ts ← Xác thực JWT, cookie, ...
│ └── hash.ts ← Mã hoá mật khẩu
├── models/ ← Mongoose schema/model
│ ├── user.model.ts
│ └── token.model.ts
├── services/ ← Business logic
│ ├── auth.service.ts
│ └── user.service.ts
├── middlewares/ ← Middleware xử lý request
│ ├── withAuth.ts
│ └── rateLimit.ts
├── types/ ← Kiểu dữ liệu dùng chung
│ └── user.ts
├── validators/ ← Zod/Joi validator (nếu dùng)
│ └── auth.schema.ts
└── utils/ ← Các hàm tiện ích nhỏ
└── response.ts

- Các thư mục server sử dụng alias để import code dễ dàng, ví dụ:
  - `@/hooks/*` → `hooks/*`: Custom React hooks (nếu dùng cho SSR hoặc API logic riêng).
  - `@/lib/*` → `lib/*`: Hàm tiện ích, config, kết nối DB, xác thực JWT/cookie, mã hoá mật khẩu.
  - `@/middlewares/*` → `middlewares/*`: Middleware xử lý request (auth, rate limit, ...).
  - `@/requests/*` → `requests/*`: Hàm gọi API từ client hoặc SSR (nếu dùng).
  - `@/models/*` → `models/*`: Mongoose schema/model cho MongoDB.
  - `@/services/*` → `services/*`: Business logic, xử lý nghiệp vụ.
  - `@/types/*` → `types/*`: Kiểu dữ liệu dùng chung (interface, type).
  - `@/utils/*` → `utils/*`: Hàm tiện ích nhỏ, xử lý response, ...
  - `@/validators/*` → `validators/*`: Zod/Joi schema validate dữ liệu đầu vào.

### Quy trình tạo mới một API server (Next.js App Router)

1. **Tạo route API:**

   - Tạo file mới trong `app/api/[resource]/[action]/route.ts`.
   - Đặt tên rõ ràng: `login`, `register`, `users`, ...
   - Sử dụng các method HTTP phù hợp: GET, POST, PUT, DELETE.

2. **Xử lý logic:**

   - Import business logic từ `services/`.
   - Validate dữ liệu đầu vào bằng schema trong `validators/`.
   - Sử dụng model từ `models/` để thao tác DB.
   - Sử dụng middleware từ `middlewares/` để xác thực, kiểm soát truy cập, rate limit.
   - Sử dụng hàm tiện ích từ `lib/` và `utils/` cho các thao tác phụ trợ (kết nối DB, trả response chuẩn, ...).

3. **Quy ước import:**

   - Sử dụng alias để import, ví dụ:
     ```ts
     import { verifyToken } from '@/lib/auth'
     import { UserModel } from '@/models/user.model'
     import { validateLogin } from '@/validators/auth.schema'
     import { withAuth } from '@/middlewares/withAuth'
     import { loginService } from '@/services/auth.service'
     import { response } from '@/utils/response'
     ```

4. **Kiểm thử:**

   - Viết test cho service logic (nếu có).
   - Kiểm thử API bằng Postman, Thunder Client, hoặc test tự động.

5. **Cập nhật docs:**
   - Mô tả rõ endpoint, method, input, output, middleware, business logic liên quan.
   - Cập nhật tài liệu trong README.md hoặc STRUCTURE.md.

### Ví dụ tạo API đăng nhập:

- Tạo file: `app/api/auth/login/route.ts`
- Import các hàm cần thiết từ các thư mục alias.
- Validate input, xử lý logic, trả response chuẩn.

```ts
import { NextRequest, NextResponse } from 'next/server'
import { validateLogin } from '@/validators/auth.schema'
import { loginService } from '@/services/auth.service'
import { response } from '@/utils/response'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = validateLogin.safeParse(body)
  if (!parsed.success) {
    return response(400, { error: 'Invalid input', details: parsed.error })
  }
  const result = await loginService(parsed.data)
  if (!result.success) {
    return response(401, { error: result.error })
  }
  return response(200, { user: result.user, token: result.token })
}
```

---

> Xem thêm chi tiết về các alias và quy trình mở rộng API server trong README.md và tài liệu từng thư mục.

### Cây cấu trúc thực tế & mô tả chi tiết API Server

```
app/
└── api/
    ├── admin/
    │   ├── blog/route.js         # Quản lý blog cho admin
    │   └── login/route.js        # Đăng nhập admin
    ├── auth/
    │   ├── login/route.ts        # Đăng nhập (set cookie, trả user/token)
    │   ├── logout/route.ts       # Đăng xuất (remove cookie)
    │   └── register/route.ts     # Đăng ký (set cookie, trả user/token)
    ├── newsletter/route.ts       # Đăng ký nhận newsletter (Pliny provider)
    ├── users/
    │   ├── me/route.ts           # Lấy/cập nhật thông tin user hiện tại (GET, PUT, require auth)
    │   ├── [id]/route.ts         # Lấy user theo id (GET, require auth)
    │   └── route.ts              # Lấy danh sách user (GET, require auth)
    ...
```

#### Mô tả chi tiết các endpoint/phần:

- **admin/**: Endpoint cho quản trị, ví dụ quản lý blog, đăng nhập admin (có thể dùng riêng quyền).
- **auth/**: Đăng nhập, đăng ký, đăng xuất. Sử dụng cookie để lưu token, trả về user/token. Validate input bằng schema, xử lý logic qua service, trả response chuẩn.
- **newsletter/**: Đăng ký nhận newsletter, tích hợp provider ngoài (Pliny).
- **users/**:
  - `me/route.ts`: Lấy/cập nhật thông tin user hiện tại. Require auth, lấy userId từ middleware.
  - `[id]/route.ts`: Lấy user theo id. Require auth, trả lỗi nếu không tìm thấy.
  - `route.ts`: Lấy danh sách user. Require auth.
- **Middleware**: Sử dụng `withAuth` để xác thực, gắn userId vào request, bảo vệ các endpoint cần đăng nhập.
- **Response**: Sử dụng hàm `successResponse`, `errorResponse` để trả về dữ liệu chuẩn hóa (body, status, error code).
- **Cookie**: Sử dụng hàm set/remove cookie khi login/logout/register.
- **Provider ngoài**: Newsletter dùng Pliny, có thể mở rộng cho các dịch vụ khác.

#### Quy trình xử lý API thực tế:

1. **Nhận request** từ client (Next.js App Router).
2. **Kết nối DB** nếu cần (MongoDB qua connectDB).
3. **Middleware xác thực** (withAuth) kiểm tra token, gắn userId vào request.
4. **Validate input** bằng schema (Zod/Joi).
5. **Gọi service** để xử lý logic (login, register, getUser, ...).
6. **Trả response** chuẩn hóa (success/error, status code, dữ liệu).
7. **Set/remove cookie** nếu cần (login/logout/register).

> Tổ chức này giúp API rõ ràng, bảo mật, dễ mở rộng, dễ test. Khi thêm resource mới, chỉ cần tạo thêm route, service, model, validator, và cập nhật middleware nếu cần.
