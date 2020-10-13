module.exports = {
  title: 'Shunya Endoh',
  description: 'just a memorandum',
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
      {
        rel: 'icon',
        href: '/favicon.ico'
      },
    ],
  ],
  themeConfig: {
    domain: 'https://www.shunya.ninja',
    defaultTheme: {
      light: [6, 18],
      dark: [18, 6]
    },
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
    nav: [{
        text: 'Home',
        link: '/'
      },
      {
        text: 'Posts',
        link: '/posts/'
      },
      {
        text: 'Tags',
        link: '/tag/'
      },
      {
        text: 'Categories',
        link: '/category/'
      },
      {
        text: 'About',
        link: '/about/'
      },
    ],
    footer: [{
        text: 'GitHub',
        link: 'https://github.com/shunyaendoh1215'
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/shunya39836817'
      },
    ],
  },
  plugins: {
      "sitemap": {
      hostname: "https://www.shunya.ninja",
      },
      'seo': {
        description: ($page, $site) => $page.frontmatter.description || ($page.excerpt && $page.excerpt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")) || $site.description || "",
        title: ($page, $site) => $page.title || $site.title,
        image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image) || 'https://user-images.githubusercontent.com/55518345/95864721-c2428580-0da0-11eb-89a3-e2d37280310f.png'+encodeURIComponent($page.title||$site.title),
      },
  },
  extendMarkdown: (md) => {
    md.use(require('markdown-it-fontawesome'));
  },
};