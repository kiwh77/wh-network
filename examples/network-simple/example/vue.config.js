module.exports = {
  devServer: {
    port: 9191,
    proxy: {
      '/api': {
        target: 'http://localhost:6666',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  }
}