const cssConfig = {
  query: {
    modules: true,
    localIdentName: '[path]-[local]-[hash:base64:10]'
  }
}

module.exports = {
  // Let nwb know this is a React app when generic build commands are used
  type: 'react-app',

  loaders: {
    'css': cssConfig,
    'sass-css': cssConfig
  },

  babel: {
    stage: 0
  }
}
