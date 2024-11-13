
module.exports = {
    publicPath: '/bookinventory/',
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Node.js 服务地址
          changeOrigin: true
        }
      }
    }

  };