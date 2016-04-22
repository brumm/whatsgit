const cssConfig = {
  query: {
    modules: true,
    localIdentName: '[local]-[hash:base64:10]'
  }
}

module.exports = {
  type: 'react-app',

  loaders: {
    'css': cssConfig,
    'sass-css': cssConfig
  },

  babel: {
    stage: 0
  }
}
