const path = require('path');
const webpack = require('webpack');

const webpackConfig = {
  mode: 'production',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../app/public'),
    filename: 'terra.js',
    library: {
      name: 'terrajs',
      type: 'var',
    },
  },
  //experiments: {
  //  outputModule: true,
  //},
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
}

const compiler = webpack(webpackConfig);

compiler.run((error, stats) => {
  if (error) {
    console.error(error);
    return;
  }
  
  console.log(stats.toString());
})

