require('dotenv/config');
const path = require('path');
const webpack = require('webpack');
const clientPath = path.join(__dirname, 'client');
const serverPublicPath = path.join(__dirname, 'server/public');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: clientPath,
  output: {
    path: serverPublicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: clientPath,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-react-jsx'
            ]
          }
        }
      },
      {
        test: /\bmapbox-gl-csp-worker.js\b/i,
        use: { loader: 'worker-loader' }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png$/i,
        use: { loader: 'file-loader' }
      },
      {
        test: /\.ico$/i,
        use: { loader: 'file-loader' }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['MAPBOX_API_KEY']),
    new webpack.EnvironmentPlugin(['FS_CLIENT_ID']),
    new webpack.EnvironmentPlugin(['FS_CLIENT_SECRET'])
  ],
  devtool: false,
  devServer: {
    host: '0.0.0.0',
    port: process.env.DEV_SERVER_PORT,
    static: {
      publicPath: '/',
      directory: serverPublicPath
    },
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`
    }
  },
  performance: {
    hints: false
  }
};
