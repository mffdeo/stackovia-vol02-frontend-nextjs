import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vol. 02 — Frontend Profissional com React e Next.js',
  description: 'Stackovia Learning Series — Volume 2. Do site estático ao app React/Next.js com portfólio profissional.',
  lang: 'pt-BR',

  base: '/stackovia-vol02-frontend-nextjs/',

  head: [
    ['meta', { name: 'author', content: 'Stackovia Learning Series' }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    siteTitle: 'Stackovia · Vol. 02',

    nav: [
      { text: 'Início', link: '/' },
      { text: 'Guia do Volume', link: '/guia-do-volume' },
      { text: 'Capítulos', link: '/capitulos/cap01' },
    ],

    sidebar: [
      {
        text: 'Volume 02',
        items: [
          { text: 'Início', link: '/' },
          { text: 'Guia do Volume', link: '/guia-do-volume' },
        ],
      },
      {
        text: 'Capítulos',
        items: [
          {
            text: 'Cap. 01 — Da intranet estática ao app',
            link: '/capitulos/cap01',
          },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Conteúdo licenciado sob <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>. Código sob <a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a>.',
      copyright: 'Stackovia Learning Series',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mffdeo/stackovia-vol02-frontend-nextjs' },
    ],

    editLink: undefined,
    lastUpdated: false,
  },
})
