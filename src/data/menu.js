// ============================================
// PEAK COFFEE - MENU DATA
// Cấu trúc: Mỗi món có thể có options (nhiệt độ, đường, topping...)
// ============================================

export const MENU_DATA = [
  // ========== CAFE MÁY ==========
  {
    id: 1,
    name: "Cafe Sữa",
    price: 18000,
    category: "Cafe Máy",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop",
    description: "Cafe máy đậm đà kết hợp sữa đặc béo ngậy.",
    hasTemp: true, // Có chọn nóng/lạnh
  },
  {
    id: 2,
    name: "Cafe Đen",
    price: 15000,
    category: "Cafe Máy",
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=500&auto=format&fit=crop",
    description: "Cafe máy nguyên chất, có thể chọn đường hoặc không.",
    hasTemp: true,
    hasSugar: true, // Có chọn đường/không đường
  },
  {
    id: 21,
    name: "Cafe Muối",
    price: 30000,
    category: "Cafe Máy",
    image: "https://vinbarista.com/uploads/news/cach-lam-ca-phe-muoi-ngon-don-gian-tai-nha-va-de-kinh-doanh-202405271558.jpg",
    description: "Cafe muối mát lạnh, thơm ngon.",
    hasAddon: true, // Có option thêm topping kem tươi
    addonName: "Kem tươi",
    addonPrice: 8000,

  },

  // ========== CAFE PHIN ==========
  {
    id: 3,
    name: "Phin Sữa",
    price: 20000,
    category: "Cafe Phin",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=500&auto=format&fit=crop",
    description: "Cafe phin truyền thống, nhỏ giọt, béo ngậy.",
    hasTemp: true,
  },
  {
    id: 4,
    name: "Phin Đen",
    price: 18000,
    category: "Cafe Phin",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500&auto=format&fit=crop",
    description: "Phin đen đậm vị, có thể chọn đường hoặc không.",
    hasTemp: true,
    hasSugar: true,
  },
  {
    id: 5,
    name: "Phin Muối",
    price: 25000,
    category: "Cafe Phin",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=500&auto=format&fit=crop",
    description: "Cafe phin với lớp kem muối béo mặn đặc biệt.",
    hasTemp: true,
  },

  // ========== GIẢI KHÁT ==========
  {
    id: 6,
    name: "Nước Dừa",
    price: 15000,
    category: "Giải Khát",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=500&auto=format&fit=crop",
    description: "Nước dừa tươi mát lạnh, giải nhiệt tức thì.",
  },
  {
    id: 7,
    name: "Nước Cam",
    price: 20000,
    category: "Giải Khát",
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=500&auto=format&fit=crop",
    description: "Cam vắt tươi nguyên chất, giàu vitamin C.",
  },
  {
    id: 8,
    name: "Nước Chanh",
    price: 12000,
    category: "Giải Khát",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=500&auto=format&fit=crop",
    description: "Chanh tươi vắt, chua ngọt thanh mát.",
  },
  {
    id: 9,
    name: "Chanh Muối",
    price: 15000,
    category: "Giải Khát",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&auto=format&fit=crop",
    description: "Chanh muối chua mặn, giải khát cực đã.",
  },
  {
    id: 10,
    name: "Nước Mía",
    price: 12000,
    category: "Giải Khát",
    image: "https://images.unsplash.com/photo-1625865145027-b2283fc4df7e?q=80&w=500&auto=format&fit=crop",
    description: "Mía ép tươi, có thể thêm chanh muối.",
    hasAddon: true, // Có option thêm chanh muối
    addonName: "Chanh muối",
    addonPrice: 3000,
  },

  // ========== NƯỚC NGỌT ==========
  {
    id: 11,
    name: "Coca Cola",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=500&auto=format&fit=crop",
    description: "Coca Cola lon 330ml.",
    isQuickAdd: true, // Thêm nhanh, không cần chọn option
  },
  {
    id: 12,
    name: "Pepsi",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=500&auto=format&fit=crop",
    description: "Pepsi lon 330ml.",
    isQuickAdd: true,
  },
  {
    id: 13,
    name: "7Up",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=500&auto=format&fit=crop",
    description: "7Up lon 330ml, vị chanh the mát.",
    isQuickAdd: true,
  },
  {
    id: 14,
    name: "Fanta Cam",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=500&auto=format&fit=crop",
    description: "Fanta vị cam lon 330ml.",
    isQuickAdd: true,
  },
  {
    id: 15,
    name: "Sting",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop",
    description: "Nước tăng lực Sting dâu 330ml.",
    isQuickAdd: true,
  },
  {
    id: 16,
    name: "Revive",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1603394630850-69b3c3a2e98c?q=80&w=500&auto=format&fit=crop",
    description: "Nước uống bổ sung ion Revive.",
    isQuickAdd: true,
  },
  {
    id: 17,
    name: "Trà Xanh 0°",
    price: 12000,
    category: "Nước Ngọt",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=500&auto=format&fit=crop",
    description: "Trà xanh không độ 500ml.",
    isQuickAdd: true,
  },

  // ========== NƯỚC ÉP ==========
  {
    id: 18,
    name: "Ép Táo",
    price: 25000,
    category: "Nước Ép",
    image: "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?q=80&w=500&auto=format&fit=crop",
    description: "Táo xanh ép tươi nguyên chất.",
  },
  {
    id: 19,
    name: "Ép Dưa Hấu",
    price: 20000,
    category: "Nước Ép",
    image: "https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?q=80&w=500&auto=format&fit=crop",
    description: "Dưa hấu đỏ ép mát lạnh, ngọt tự nhiên.",
  },
  {
    id: 20,
    name: "Ép Ổi",
    price: 22000,
    category: "Nước Ép",
    image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=500&auto=format&fit=crop",
    description: "Ổi đào ép tươi, thơm ngon bổ dưỡng.",
  },
];
