/**
 * Add-ons are returned as a mixed flat array.
 * The frontend should group them by `category` for display.
 *
 * Categories: workshop, meal, merchandise
 * Workshops have time slots — candidates must check for conflicts with selected sessions.
 * VIP ticket holders get 10% off workshop prices.
 */
export const addons = [
  // ── Workshops ──
  {
    id: 'ws1',
    category: 'workshop',
    name: {
      'en-us': 'Hands-on Vue.js Testing',
      'zh-tw': 'Vue.js 測試動手做',
    },
    description: {
      'en-us': 'Write unit and component tests with Vitest and Vue Test Utils. Bring your laptop.',
      'zh-tw': '使用 Vitest 和 Vue Test Utils 編寫單元及組件測試。請自備筆記型電腦。',
    },
    price: 149,
    date: '2028-11-16T14:00:00Z',
    endDate: '2028-11-16T17:00:00Z',
    capacity: 30,
    registered: 22,
  },
  {
    id: 'ws2',
    category: 'workshop',
    name: {
      'en-us': 'Docker & Kubernetes for Frontend Devs',
      'zh-tw': '前端工程師的 Docker & Kubernetes',
    },
    description: {
      'en-us': 'Containerize your apps and deploy to Kubernetes from scratch.',
      'zh-tw': '將您的應用程式容器化，並從零開始部署到 Kubernetes。',
    },
    price: 179,
    date: '2028-11-15T15:30:00Z',
    endDate: '2028-11-15T18:30:00Z',
    capacity: 25,
    registered: 25,
  },

  // ── Meal Packages ──
  {
    id: 'meal1',
    category: 'meal',
    name: {
      'en-us': 'Standard Lunch (Both Days)',
      'zh-tw': '標準午餐（兩日）',
    },
    description: {
      'en-us': 'Buffet lunch with vegetarian and vegan options.',
      'zh-tw': '自助午餐，提供素食及全素選擇。',
    },
    price: 45,
  },
  {
    id: 'meal2',
    category: 'meal',
    name: {
      'en-us': 'Premium Dinner — Day 1 Networking Event',
      'zh-tw': '尊榮晚宴 — 第一日交流活動',
    },
    description: {
      'en-us': 'Three-course dinner at rooftop venue with open bar and live music.',
      'zh-tw': '頂樓場地的三道菜晚宴，設有開放式酒吧和現場音樂。',
    },
    price: 89,
  },

  // ── Merchandise ──
  {
    id: 'merch1',
    category: 'merchandise',
    name: {
      'en-us': 'Conference T-Shirt',
      'zh-tw': '年會紀念 T-Shirt',
    },
    description: {
      'en-us': '100% organic cotton, WebDev Summit 2028 edition.',
      'zh-tw': '100% 有機棉，2028 WebDev 峰會版。',
    },
    price: 35,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    maxQuantity: 3,
  },
  {
    id: 'merch2',
    category: 'merchandise',
    name: {
      'en-us': 'Developer Sticker Pack',
      'zh-tw': '開發者貼紙包',
    },
    description: {
      'en-us': 'Set of 12 holographic developer stickers.',
      'zh-tw': '一組 12 張雷射開發者貼紙。',
    },
    price: 12,
    maxQuantity: 5,
  },
  {
    id: 'merch3',
    category: 'merchandise',
    name: {
      'en-us': 'Insulated Water Bottle',
      'zh-tw': '保溫水瓶',
    },
    description: {
      'en-us': 'Stainless steel, 500ml, laser-engraved logo.',
      'zh-tw': '不鏽鋼材質，500ml，雷射雕刻標誌。',
    },
    price: 28,
    maxQuantity: 2,
  },
  {
    id: 'merch4',
    category: 'merchandise',
    name: {
      'en-us': 'Laptop Sleeve (15")',
      'zh-tw': '電腦包 (15")',
    },
    description: {
      'en-us': 'Neoprene sleeve with conference branding.',
      'zh-tw': '潛水料材質電腦包，印有年會標誌。',
    },
    price: 42,
    sizes: ['13"', '15"', '16"'],
    maxQuantity: 1,
  },
]
