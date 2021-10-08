// const path = require('path');
//
// // const url = process.env.VUE_APP_PROXY || 'http://10.1.236.50:8002/';
// const url = process.env.VUE_APP_PROXY || 'http://10.1.241.52:8002/';
// const port = process.env.VUE_APP_PORT || 8000;
// const title = '运营管控中心';
//
// // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', process.env);
//
// function resolve(dir) {
//   return path.join(__dirname, dir);
// }
module.exports = {
  // productionSourceMap: false,
  // runtimeCompiler: true,
  // css: {
  //   extract: true,
  //   sourceMap: false,
  //   loaderOptions: {
  //     sass: {
  //       prependData: '@import "~@/assets/style/global.scss";',
  //     },
  //   },
  // },
  devServer: {
    port: 8000,
    hot: true,
    proxy: {
      '/cluster': {
        target: 'http://localhost:10080/',
        // target: 'http://47.95.227.127:10080/',
        changeOrigin: true,
      },
    },
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@': resolve('src'),
  //     },
  //   },
  // },
  // chainWebpack: config => {
  //   config.plugin('html').tap(args => {
  //     args[0].title = title;
  //     return args;
  //   });
  //   if (process.env.use_analyzer) {
  //     config
  //       .plugin('webpack-bundle-analyzer')
  //       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  //   }
  // },
};
