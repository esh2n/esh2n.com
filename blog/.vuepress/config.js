module.exports = {
  title: 'Shunya Endoh',
  description: 'Commandments for me',
  base: '/',
  dest: 'dist/',
  theme: 'ououe',
  themeConfig: {
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#modifyblogpluginoptions
     */
    // modifyBlogPluginOptions(blogPluginOptions) {
    //   return blogPluginOptions;
    // },
    showThemeButton: false,
    cover: '/cover.jpg',
    logo: '/logo.png',
    search: true,
    backgroundImage: false,
    pageGroup: 5,
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#nav
     */
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'Tags', link: '/tag/' },
      { text: 'Categories', link: '/category/' },
      { text: 'About', link: '/about/' },
    ],
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#footer
     */
    footer: {
      contact: [
        { text: 'Github', link: 'https://github.com/shunyaendoh1215' },
        {
          type: 'twitter',
          link: 'https://twitter.com/_ulivz',
        },
      ],
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US',
        },
        {
          text: 'MIT Licensed | Copyright © 2018-present Vue.js',
          link: '',
        },
      ],
    },
  },
};
