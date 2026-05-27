/**
 * Sessions are returned as a flat array with ISO timestamps.
 * The frontend should group them by date and handle time-conflict detection.
 *
 * Intentional time overlaps:
 *   Day 1: S2 & S3 overlap (10:00–11:30 vs 10:30–12:00)
 *          S4 & S5 overlap (13:00–14:30 vs 13:30–15:00)
 *   Day 2: S8 & S9 overlap (10:00–11:30 vs 10:30–12:00)
 *          S11 & S12 overlap (14:00–15:30 vs 14:30–16:00)
 */
export const sessions = [
  // ── Day 1: November 15, 2028 ──
  {
    id: 's1',
    title: {
      'en-us': 'Opening Keynote: The Future of the Web Platform',
      'zh-tw': '開幕主題演講：網路平台的未來',
    },
    speaker: 'Sarah Chen',
    speakerTitle: {
      'en-us': 'VP of Engineering, WebCorp',
      'zh-tw': 'WebCorp 工程副總裁',
    },
    track: 'main',
    date: '2028-11-15T09:00:00Z',
    endDate: '2028-11-15T10:00:00Z',
    capacity: 500,
    registered: 487,
    description: {
      'en-us': 'Explore the latest web platform APIs and what they mean for developers in 2028 and beyond.',
      'zh-tw': '探索最新的網路平台 API，以及它們對 2028 年及以後開發者的意義。',
    },
  },
  {
    id: 's2',
    title: {
      'en-us': 'Advanced Vue.js Patterns',
      'zh-tw': '進階 Vue.js 模式',
    },
    speaker: 'Marco Rossi',
    speakerTitle: {
      'en-us': 'Core Team, Vue.js',
      'zh-tw': 'Vue.js 核心團隊成員',
    },
    track: 'frontend',
    date: '2028-11-15T10:00:00Z',
    endDate: '2028-11-15T11:30:00Z',
    capacity: 120,
    registered: 120,
    description: {
      'en-us': 'Deep dive into composables, render functions, and performance optimization techniques.',
      'zh-tw': '深入探討 composables、render 函數及效能優化技術。',
    },
  },
  {
    id: 's3',
    title: {
      'en-us': 'Building Scalable APIs with Node.js',
      'zh-tw': '使用 Node.js 構建可擴展的 API',
    },
    speaker: 'Aisha Patel',
    speakerTitle: {
      'en-us': 'Senior Engineer, CloudScale',
      'zh-tw': 'CloudScale 資深工程師',
    },
    track: 'backend',
    date: '2028-11-15T10:30:00Z',
    endDate: '2028-11-15T12:00:00Z',
    capacity: 100,
    registered: 78,
    description: {
      'en-us': 'Patterns and best practices for building production-ready REST and GraphQL APIs.',
      'zh-tw': '構建生產級 REST 和 GraphQL API 的模式與最佳實踐。',
    },
  },
  {
    id: 's4',
    title: {
      'en-us': 'Modern CSS: Beyond Tailwind',
      'zh-tw': '現代 CSS：超越 Tailwind',
    },
    speaker: 'Yuki Tanaka',
    speakerTitle: {
      'en-us': 'Design Systems Lead, DesignLab',
      'zh-tw': 'DesignLab 設計系統負責人',
    },
    track: 'frontend',
    date: '2028-11-15T13:00:00Z',
    endDate: '2028-11-15T14:30:00Z',
    capacity: 80,
    registered: 65,
    description: {
      'en-us': 'CSS container queries, cascade layers, and the future of styling on the web.',
      'zh-tw': 'CSS 容器查詢、階層 (cascade layers) 及 Web 樣式的未來。',
    },
  },
  {
    id: 's5',
    title: {
      'en-us': 'Database Performance Tuning',
      'zh-tw': '資料庫效能調優',
    },
    speaker: 'David Kim',
    speakerTitle: {
      'en-us': 'DBA, DataForge',
      'zh-tw': 'DataForge 資料庫管理員',
    },
    track: 'backend',
    date: '2028-11-15T13:30:00Z',
    endDate: '2028-11-15T15:00:00Z',
    capacity: 90,
    registered: 52,
    description: {
      'en-us': 'Query optimization, indexing strategies, and monitoring for PostgreSQL and MySQL.',
      'zh-tw': '針對 PostgreSQL 和 MySQL 的查詢優化、索引策略及監控。',
    },
  },
  {
    id: 's6',
    title: {
      'en-us': 'CI/CD Pipelines That Actually Work',
      'zh-tw': '真正有效的 CI/CD 流水線',
    },
    speaker: 'Elena Volkov',
    speakerTitle: {
      'en-us': 'DevOps Architect, ShipFast',
      'zh-tw': 'ShipFast DevOps 架構師',
    },
    track: 'devops',
    date: '2028-11-15T15:30:00Z',
    endDate: '2028-11-15T17:00:00Z',
    capacity: 100,
    registered: 41,
    description: {
      'en-us': 'Build reliable, fast CI/CD pipelines using GitHub Actions, Docker, and Kubernetes.',
      'zh-tw': '使用 GitHub Actions、Docker 和 Kubernetes 構建可靠、快速的 CI/CD 流水線。',
    },
  },

  // ── Day 2: November 16, 2028 ──
  {
    id: 's7',
    title: {
      'en-us': 'Day 2 Keynote: AI-Assisted Development',
      'zh-tw': '第二日主題演講：AI 輔助開發',
    },
    speaker: 'James Liu',
    speakerTitle: {
      'en-us': 'CTO, CodeAssist AI',
      'zh-tw': 'CodeAssist AI 技術長',
    },
    track: 'main',
    date: '2028-11-16T09:00:00Z',
    endDate: '2028-11-16T10:00:00Z',
    capacity: 500,
    registered: 312,
    description: {
      'en-us': 'How AI tools are reshaping developer workflows and what comes next.',
      'zh-tw': 'AI 工具如何重塑開發者工作流程，以及接下來的發展。',
    },
  },
  {
    id: 's8',
    title: {
      'en-us': 'State Management in 2028',
      'zh-tw': '2028 年的狀態管理',
    },
    speaker: 'Ana Morales',
    speakerTitle: {
      'en-us': 'Staff Engineer, FrontEnd Co',
      'zh-tw': 'FrontEnd Co 主任工程師',
    },
    track: 'frontend',
    date: '2028-11-16T10:00:00Z',
    endDate: '2028-11-16T11:30:00Z',
    capacity: 110,
    registered: 98,
    description: {
      'en-us': 'Comparing Pinia, Zustand, Jotai, and signals-based approaches for modern apps.',
      'zh-tw': '比較現代應用程式中的 Pinia、Zustand、Jotai 及基於 signals 的方法。',
    },
  },
  {
    id: 's9',
    title: {
      'en-us': 'Microservices Communication Patterns',
      'zh-tw': '微服務通訊模式',
    },
    speaker: 'Robert Chang',
    speakerTitle: {
      'en-us': 'Architect, ScaleUp Inc',
      'zh-tw': 'ScaleUp Inc 架構師',
    },
    track: 'backend',
    date: '2028-11-16T10:30:00Z',
    endDate: '2028-11-16T12:00:00Z',
    capacity: 90,
    registered: 90,
    description: {
      'en-us': 'Event-driven architectures, message queues, and gRPC for service-to-service communication.',
      'zh-tw': '事件驅動架構、訊息隊列及用於服務間通訊的 gRPC。',
    },
  },
  {
    id: 's10',
    title: {
      'en-us': 'Observability for Frontend Apps',
      'zh-tw': '前端應用的可觀測性',
    },
    speaker: 'Fatima Al-Rashid',
    speakerTitle: {
      'en-us': 'Monitoring Lead, ObserveAll',
      'zh-tw': 'ObserveAll 監控負責人',
    },
    track: 'devops',
    date: '2028-11-16T13:00:00Z',
    endDate: '2028-11-16T14:00:00Z',
    capacity: 70,
    registered: 33,
    description: {
      'en-us': 'Implementing real user monitoring, error tracking, and performance budgets.',
      'zh-tw': '實施真實用戶監控、錯誤追蹤及效能預算。',
    },
  },
  {
    id: 's11',
    title: {
      'en-us': 'Accessibility Deep Dive',
      'zh-tw': '無障礙設計深入解析',
    },
    speaker: 'Chris Anderson',
    speakerTitle: {
      'en-us': 'A11y Specialist, InclusiveWeb',
      'zh-tw': 'InclusiveWeb 無障礙專家',
    },
    track: 'frontend',
    date: '2028-11-16T14:00:00Z',
    endDate: '2028-11-16T15:30:00Z',
    capacity: 80,
    registered: 29,
    description: {
      'en-us': 'ARIA patterns, screen reader testing, and building truly inclusive interfaces.',
      'zh-tw': 'ARIA 模式、螢幕閱讀器測試，以及構建真正包容的介面。',
    },
  },
  {
    id: 's12',
    title: {
      'en-us': 'Edge Computing with Cloudflare Workers',
      'zh-tw': '使用 Cloudflare Workers 的邊緣運算',
    },
    speaker: 'Nina Petrov',
    speakerTitle: {
      'en-us': 'Developer Advocate, Cloudflare',
      'zh-tw': 'Cloudflare 開發者推廣工程師',
    },
    track: 'devops',
    date: '2028-11-16T14:30:00Z',
    endDate: '2028-11-16T16:00:00Z',
    capacity: 100,
    registered: 67,
    description: {
      'en-us': 'Deploy serverless functions at the edge for ultra-low latency applications.',
      'zh-tw': '在邊緣部署無伺服器函數，以實現極低延遲的應用程式。',
    },
  },
]
