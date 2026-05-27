const PERKS = {
  ALL_SESSIONS: {
    'en-us': 'All sessions',
    'zh-tw': '所有議程',
  },
  KEYNOTE_ACCESS: {
    'en-us': 'Keynote access',
    'zh-tw': '主題演講入場權限',
  },
  LUNCH_INCLUDED: {
    'en-us': 'Lunch included',
    'zh-tw': '包含午餐',
  },
  VIP_LOUNGE: {
    'en-us': 'VIP lounge',
    'zh-tw': 'VIP 專屬休息室',
  },
  SPEAKER_MEET_GREET: {
    'en-us': 'Speaker meet & greet',
    'zh-tw': '講者見面會',
  },
  WORKSHOP_DISCOUNT: {
    'en-us': '10% off workshops',
    'zh-tw': '工作坊 9 折優惠',
  },
}
export const event = {
  id: 'evt-2028-webdev',
  name: {
    'en-us': 'WebDev Summit 2028',
    'zh-tw': '2028 WebDev 峰會',
  },
  description: {
    'en-us': 'A two-day conference for web developers featuring talks on frontend, backend, and DevOps. Join industry leaders for in-depth sessions, hands-on workshops, and networking opportunities.',
    'zh-tw': '為期兩天的 Web 開發者盛會，涵蓋前端、後端及 DevOps 的專業演講。與業界領導者一同參與深入的議程、動手實作工作坊及交流機會。',
  },
  dates: ['2028-11-15', '2028-11-16'],
  venue: {
    name: {
      'en-us': 'Grand Tech Convention Center',
      'zh-tw': '大技術會議中心',
    },
    address: '1234 Innovation Blvd, San Francisco, CA 94105',
  },
  ticketTypes: [
    {
      id: 'general',
      name: {
        'en-us': 'General',
        'zh-tw': '一般票',
      },
      price: 299,
      description: {
        'en-us': 'Access to all sessions and keynotes',
        'zh-tw': '可參加所有議程及主題演講',
      },
      perks: [PERKS.ALL_SESSIONS, PERKS.KEYNOTE_ACCESS, PERKS.LUNCH_INCLUDED],
    },
    {
      id: 'vip',
      name: {
        'en-us': 'VIP',
        'zh-tw': 'VIP 票',
      },
      price: 599,
      description: {
        'en-us': 'Premium experience with exclusive perks',
        'zh-tw': '享有專屬禮遇的頂級體驗',
      },
      perks: [PERKS.ALL_SESSIONS, PERKS.KEYNOTE_ACCESS, PERKS.LUNCH_INCLUDED, PERKS.VIP_LOUNGE, PERKS.SPEAKER_MEET_GREET, PERKS.WORKSHOP_DISCOUNT],
    },
    {
      id: 'student',
      name: {
        'en-us': 'Student',
        'zh-tw': '學生票',
      },
      price: 99,
      description: {
        'en-us': 'Discounted rate for students with valid ID',
        'zh-tw': '持有有效學生證者的優惠費率',
      },
      perks: [PERKS.ALL_SESSIONS, PERKS.KEYNOTE_ACCESS],
    },
  ],
}
