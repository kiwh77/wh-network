const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  target: ['web', 'es5'],
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
