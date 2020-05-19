/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {pathPrefix: "/heart-rate-alert",
  /* Your site config here */
  plugins: ['gatsby-plugin-sass', {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Heart Rate Alert`,
      short_name: `HRA`,
      start_url: `/`,
      background_color: `#f7f0eb`,
      icon: `src/heart.svg`,
      theme_color: `#a2466c`,
      display: `standalone`,
    },
  }, 'gatsby-plugin-offline', 'gatsby-plugin-react-helmet'],
}
