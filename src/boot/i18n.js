import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

export default boot(({ app }) => {
  // Get language from ?hl= query parameter or fallback to browser language or 'en-us'
  const params = new URLSearchParams(window.location.search);
  const hl = params.get('hl');
  
  let locale = 'en-us';
  if (hl === 'zh-tw') {
    locale = 'zh-tw';
  } else if (!hl) {
    // Check if previously saved in localStorage
    const saved = localStorage.getItem('lang');
    if (saved === 'zh-tw' || saved === 'en-us') {
      locale = saved;
    } else {
      // Browser detection
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('zh')) {
        locale = 'zh-tw';
      }
    }
  }

  const i18n = createI18n({
    locale,
    fallbackLocale: 'en-us',
    legacy: false, // Set to false to use Composition API
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
