import type { LangdriftLocale } from '@repo/react/locales'

export const docsChrome = {
  en: {
    docsLabel: 'Docs',
    editLink: 'Edit this page on GitHub',
    feedback: 'Suggest a documentation improvement',
    footerLine: 'Product intelligence for understanding how products move.',
    language: 'Documentation language',
    languages: {
      en: 'English',
      'pt-BR': 'Brazilian Portuguese',
      'zh-Hant': 'Traditional Chinese',
      ja: 'Japanese'
    },
    searchLabel: 'Search documentation',
    searchPlaceholder: 'Search docs…',
    website: 'Website'
  },
  'pt-BR': {
    docsLabel: 'Docs',
    editLink: 'Editar esta página no GitHub',
    feedback: 'Sugerir uma melhoria na documentação',
    footerLine: 'Inteligência de produto para entender como produtos se movem.',
    language: 'Idioma da documentação',
    languages: {
      en: 'Inglês',
      'pt-BR': 'Português brasileiro',
      'zh-Hant': 'Chinês tradicional',
      ja: 'Japonês'
    },
    searchLabel: 'Pesquisar documentação',
    searchPlaceholder: 'Pesquisar docs…',
    website: 'Site'
  },
  'zh-Hant': {
    docsLabel: '文件',
    editLink: '在 GitHub 編輯此頁',
    feedback: '建議文件改進',
    footerLine: '產品情報，用來理解產品如何移動。',
    language: '文件語言',
    languages: {
      en: '英語',
      'pt-BR': '巴西葡萄牙語',
      'zh-Hant': '繁體中文',
      ja: '日語'
    },
    searchLabel: '搜尋文件',
    searchPlaceholder: '搜尋文件…',
    website: '網站'
  },
  ja: {
    docsLabel: 'ドキュメント',
    editLink: 'GitHub でこのページを編集',
    feedback: 'ドキュメントの改善を提案',
    footerLine:
      '製品がどのように動くかを理解するためのプロダクトインテリジェンス。',
    language: 'ドキュメントの言語',
    languages: {
      en: '英語',
      'pt-BR': 'ブラジルポルトガル語',
      'zh-Hant': '繁体字中国語',
      ja: '日本語'
    },
    searchLabel: 'ドキュメントを検索',
    searchPlaceholder: 'ドキュメントを検索…',
    website: 'ウェブサイト'
  }
} as const satisfies Record<
  LangdriftLocale,
  {
    docsLabel: string
    editLink: string
    feedback: string
    footerLine: string
    language: string
    languages: Record<LangdriftLocale, string>
    searchLabel: string
    searchPlaceholder: string
    website: string
  }
>
