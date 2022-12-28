const proxyConfig = {
  //   // a request to `/api`(or `/api/**/*`) will proxy to `http://localhost:3000/api`
  //   '/api': 'http://localhost:3000',

  //   // a request to `/graphql`(or `/graphql/**/*`) will proxy to `http://localhost:3000/my-graphql`
  //   '/graphql': {
  //     target: 'http://localhost:3000',
  //     pathRewrite: {
  //       '^/graphql': '/my-graphql',
  //     },
  //   },

  // proxy and change origin
  '/api': {
    target: 'https://dev.ccdw.imarat.com.pk/',
    changeOrigin: true,
  },
}

module.exports = proxyConfig
