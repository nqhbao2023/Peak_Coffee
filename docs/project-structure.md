# Peak Coffee — Project Structure

> Bản đồ codebase. Cập nhật khi thêm/xóa file quan trọng.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build tool | Vite | latest |
| Styling | TailwindCSS | 3.x |
| Animation | Framer Motion | 12.x |
| Backend/DB | Firebase (Auth + Firestore) | 12.x |
| Icons | Lucide React | latest |
| Notifications | react-hot-toast | 2.x |
| ID generation | uuid | 13.x |

---

## 📁 Cấu trúc thư mục

```
Peak_Coffee/
├── public/                    # Static assets
│   └── firebase-messaging-sw.js
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Root component + routing logic
│   ├── App.css               # Global CSS (hiếm dùng, chủ yếu Tailwind)
│   ├── index.css             # Tailwind directives
│   ├── assets/               # Images, icons
│   ├── components/           # UI Components (xem bên dưới)
│   ├── contexts/             # React Context providers
│   ├── data/                 # Static data (menu seed)
│   ├── firebase/             # Firebase config & helpers
│   └── utils/                # Utility functions
├── docs/                     # 📖 Project documentation
├── tasks/                    # 📋 Todo & lessons learned
├── scripts/                  # Admin scripts (resetFirestore)
├── .github/                  # Copilot instructions
├── tailwind.config.js        # Design tokens source of truth
├── vite.config.js            # Build config
├── firebase.json             # Firebase hosting config
├── firestore.rules           # Security rules
└── storage.rules             # Storage security rules
```

---

## 🧩 Components (src/components/)

| File | Chức năng | Loại |
|------|----------|------|
| Header.jsx | Logo + navigation + cart icon | Layout |
| Hero.jsx | Banner section | Layout |
| BottomNav.jsx | Mobile bottom navigation | Layout |
| CategoryFilter.jsx | Lọc menu theo danh mục | Feature |
| MenuItem.jsx | Card hiển thị 1 món | Feature |
| ProductModal.jsx | Chi tiết món + tùy chọn | Modal |
| EditProductModal.jsx | Admin: thêm/sửa món | Modal |
| CartModal.jsx | Giỏ hàng | Modal |
| PaymentModal.jsx | Thanh toán | Modal |
| LoginModal.jsx | Đăng nhập | Modal |
| FeedbackModal.jsx | Gửi feedback | Modal |
| OrderHistory.jsx | Lịch sử đơn hàng | Feature |
| AdminDashboard.jsx | Bảng điều khiển admin | Page |
| MenuManager.jsx | Admin: quản lý menu | Feature |
| StatsOverview.jsx | Thống kê doanh thu | Feature |
| DebtManagement.jsx | Quản lý công nợ | Feature |
| CustomerDebtDetail.jsx | Chi tiết nợ khách | Feature |
| DebtHistory.jsx | Lịch sử công nợ | Feature |
| LoyaltyCard.jsx | Thẻ tích điểm | Feature |
| StreakBadge.jsx | Huy hiệu streak | Feature |
| StreakModal.jsx | Chi tiết streak | Modal |
| FeedbackList.jsx | Danh sách feedback | Feature |

---

## 🔄 Contexts (src/contexts/)

| Context | Chức năng |
|---------|----------|
| AuthContext | Đăng nhập/đăng xuất, phân quyền admin |
| MenuContext | CRUD menu items (Firestore) |
| OrderContext | Đặt hàng, lịch sử đơn |
| LoyaltyContext | Tích điểm, đổi thưởng |
| StreakContext | Streak mua hàng liên tục |
| DebtContext | Công nợ khách hàng |

---

## 🔥 Firebase Services

| Service | Dùng cho |
|---------|---------|
| Auth | Đăng nhập (phone/email) |
| Firestore | Database chính |
| Hosting | Deploy static site |
| Cloud Messaging | Push notifications |
| Storage | Lưu ảnh (nếu cần) |

---

## 📏 Conventions

- **Component pattern**: Arrow function + export default
- **State management**: React Context (không Redux)
- **Styling**: TailwindCSS utility classes (không CSS modules)
- **Naming**: PascalCase components, camelCase functions/variables
- **File naming**: PascalCase cho components, camelCase cho utils
