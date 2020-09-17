module.exports = {
  title: 'Shunya Endoh',
  description: 'Commandments for me',
  base: '/',
  dest: 'dist/',
  theme: 'ououe',
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=M+PLUS+1p',
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css',
        integrity: 'sha384-xxx',
        crossorigin: 'anonymous',
      },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  ],
  themeConfig: {
    defaultTheme: { light: [6, 18], dark: [18, 6] },
    showThemeButton: false,
    cover: '/cover.jpg',
    logo: '/logo.png',
    search: true,
    backgroundImage: false,
    pageGroup: 5,
    postTime: {
      createTime: '公開日',
      lastUpdated: '更新日',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'Tags', link: '/tag/' },
      { text: 'Categories', link: '/category/' },
      { text: 'About', link: '/about/' },
    ],
    footer: [
      { text: 'GitHub', link: 'https://github.com/shunyaendoh1215' },
      { text: 'Twitter', link: 'https://twitter.com/shunya39836817' },
    ],
  },
  extendMarkdown: (md) => {
    md.use(require('markdown-it-fontawesome'));
  },
};
