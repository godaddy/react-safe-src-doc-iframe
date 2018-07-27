var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/safe-src-doc-iframe.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'safe-src-doc-iframe.js',
    library: 'SafeSrcDocIframe',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'prop-types': {
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
      root: 'PropTypes',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
};
