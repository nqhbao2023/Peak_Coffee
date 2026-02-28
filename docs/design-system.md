# Peak Coffee — Design System

> Single source of truth cho màu sắc, spacing, typography, component patterns.
> Cập nhật file này khi thay đổi design tokens.

---

## 🎨 Color Tokens (from tailwind.config.js)

### Coffee (Primary palette)
| Token | Hex | Dùng cho |
|-------|-----|----------|
| `coffee-50` | #F9F5F1 | Background sections |
| `coffee-100` | #F0EBE5 | Card background nhẹ |
| `coffee-200` | #E2D6C8 | Border nhẹ |
| `coffee-300` | #D1BFA8 | Divider |
| `coffee-400` | #BFA080 | Placeholder text |
| `coffee-500` | #A6825D | Secondary text |
| `coffee-600` | #8C6645 | Body text |
| `coffee-700` | #6B4C35 | Heading secondary |
| `coffee-800` | #4E3629 | Dark elements |
| `coffee-900` | #36261F | Footer, dark sections |
| `coffee-950` | #1F1410 | Darkest |
| `coffee-premium` | #4B3621 | Logo text, premium CTA |

### Brand (Accent)
| Token | Hex | Dùng cho |
|-------|-----|----------|
| `brand-red` | #C8102E | Alert, sale badge |
| `brand-dark` | #5B0909 | Gradient endpoints |
| `brand-earth` | #C25E00 | **Primary CTA**, links, icons active |

### Semantic mapping
- **Primary action**: `brand-earth` (#C25E00)
- **Text chính**: `coffee-premium` (#4B3621)
- **Text phụ**: `coffee-600` (#8C6645)
- **Background**: `coffee-50` (#F9F5F1) hoặc `white`
- **Danger/Error**: `brand-red` (#C8102E)

---

## 📐 Spacing & Layout

> Peak Coffee là app mobile-first (max-w-md), không phải landing page.
> Spacing tối ưu cho scroll experience trên điện thoại.

### Container padding (horizontal)
| Context | Class | Ghi chú |
|---------|-------|---------|
| Main container | `px-4` | Consistent across app |
| Header inner | `px-4` | Cùng alignment với content |

### Section spacing (vertical)
| Context | Class | Ghi chú |
|---------|-------|---------|
| Section top | `pt-6` | Hero, section đầu |
| Between sections | `space-y-4` hoặc `mt-6` | Khoảng cách giữa blocks |
| Empty state | `py-12` hoặc `py-16` | Centering nội dung trống |

### Internal padding (card/modal)
| Context | Class | Ghi chú |
|---------|-------|---------|
| Card padding | `p-4` | Compact cho mobile |
| Modal body | `p-6` | Rộng hơn, dễ đọc |
| Modal header/footer | `p-6` | Consistent với body |
| Input fields | `px-4 py-3` | Touch-friendly |
| Button | `px-4 py-3` / `p-2.5` (icon) | Touch target ≥ 44px |

### Gap
| Context | Class |
|---------|-------|
| Item list | `gap-3` hoặc `gap-4` |
| Inline elements | `gap-2` hoặc `gap-3` |

### Max-width
| Context | Class |
|---------|-------|
| App container | `max-w-md` |
| Modal | `max-w-2xl` |

---

## 🔤 Typography

| Element | Classes |
|---------|---------|
| Logo | `font-black text-xl tracking-tight` |
| Page heading | `font-black text-2xl` |
| Section heading | `font-bold text-lg` |
| Card title | `font-bold text-sm` |
| Body text | `font-medium text-sm` |
| Caption/label | `font-bold text-xs uppercase tracking-wider` |
| Price | `font-black text-lg` |

---

## 🧩 Component Patterns

### Border Radius
- Cards: `rounded-2xl` hoặc `rounded-3xl`
- Buttons: `rounded-xl`
- Input fields: `rounded-xl`
- Avatar/Badge: `rounded-full`

### Shadows
- Card: `shadow-lg`
- Button hover: `hover:shadow-xl`
- Brand shadow: `shadow-brand-earth/20` hoặc `shadow-coffee-900/20`

### Transitions
- All interactive: `transition-all duration-200`
- Hover scale: `hover:scale-110` (icon), `active:scale-[0.98]` (button)

### Gradients
- Primary CTA: `bg-gradient-to-r from-orange-500 to-red-500`
- Header brand: `bg-gradient-to-br from-brand-earth to-brand-dark`
- Section bg: `bg-gradient-to-br from-orange-50 to-white`

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| Default (mobile-first) | 375px+ |
| `sm:` | 640px+ |
| `md:` | 768px+ |
| `lg:` | 1024px+ |

Design mobile-first. Desktop là enhancement.

---

## ✅ Checklist khi tạo component mới

- [ ] Dùng đúng color tokens (không hardcode hex)
- [ ] Có hover + active states
- [ ] Mobile-first responsive
- [ ] Dùng `rounded-xl` trở lên
- [ ] Font weight phù hợp hierarchy
- [ ] Có transition animation
