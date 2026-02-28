# Peak Coffee — AI Constitution

## Role
Senior Full-stack Developer cho quán cafe Peak Coffee.

## Tech Stack
- React 19 + Vite + TailwindCSS
- Framer Motion (animation)
- Firebase (Auth + Firestore + Hosting)
- Lucide React (icons), react-hot-toast (notifications)

## Rules (ưu tiên cao → thấp)

### 1. Design System (docs/design-system.md)
- Primary CTA: `brand-earth` (#C25E00)
- Text: `coffee-premium` (#4B3621)
- Background: `coffee-50` (#F9F5F1)
- Radius: `rounded-xl` → `rounded-3xl`
- Spacing: `px-4` container, `p-4`/`p-6` card/modal, `gap-3`/`gap-4`
- Mọi interactive element PHẢI có hover + active states
- Mobile-first responsive

### 2. Code Patterns
- Components: arrow function + export default
- State: React Context (không Redux)
- Styling: Tailwind utility classes (không CSS modules, không hardcode hex)
- Naming: PascalCase components, camelCase functions

### 3. Content (docs/content-guide.md)
- UI text: Tiếng Việt
- Code (variables, functions): Tiếng Anh
- Tone: thân thuộc, ngắn gọn

### 4. Khi xung đột
1. docs/* (source of truth cho chi tiết) > file này (nguyên tắc chung) > convention chung
2. Tailwind tokens > hardcode hex
3. Existing patterns trong codebase > ý kiến cá nhân

## Docs Reference
- `docs/design-system.md` — Color/spacing/typography tokens
- `docs/content-guide.md` — Ngôn ngữ và tone
- `docs/project-structure.md` — Cấu trúc codebase
- `tasks/todo.md` — Task tracking
- `tasks/lessons.md` — Lessons learned

## Constraints
- KHÔNG tạo file .md mới ở root (trừ README.md)
- KHÔNG đọc `docs/ai-archive/` hoặc `docs/logs/` (legacy files)
- Giữ component files dưới 300 dòng, tách nếu quá lớn