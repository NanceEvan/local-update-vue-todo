// 使用绝对路径
const path = require('path');
// const HTMLPlugin = require('html-webpack-plugin'); 
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //引入插件
const isDev = process.env.NODE_ENV === 'development';
const config = {
    target:"web",
    // webpack负责打包前端资源
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename: 'bundle.js',
        path:path.join(__dirname, 'dist'),
    },
    plugins: [
        // make sure to include the plugin for the magic
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV:isDev?'"development"':'"production"', // 注意单引号内的双引号 
            }
        }),// webpack 环境区分打包，选择不同的源代码进行打包 开发版本中用到错误提示 --加大文件大小，其次，降低代码运行效率
        // new HTMLPlugin(), 
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin()
    ],
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader'],
                // css-loader：读取css文件内容
                // style-loader：使用<style>将css-loader内部样式注入到我们的HTML页面
            },
            {
                test:/\.styl$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test:/\.(png|jpg|jpeg|gif|svg)/,
                use:[
                    {
                        loader:'url-loader',
                        // 将图片转化成base64 代码，直接写在js内容里面，而不用生成新的文件，对于小图片有用，可减少http请求
                        options:{
                            limit:1024,
                            name:'[name]-aaa.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    mode: 'production',
}

if(isDev) {
    config.devtool = '#cheap-module-eval-source-map',
    config.devServer = {
        // 关于webpack devserver的东西都在此配置
        port:8000,
        host:'0.0.0.0',
        // localhost 127.0.0.1 或者本机IP进行访问（可以再他人或者手机访问）
        overlay: {
            errors:true,// webpack编译错误显示在网页中
        },
        hot:true, // 页面不刷新 仅更新组件数据
        // open:true,
        // historyFallback: {
        //     // 设置默认入口地址
        // }
    },
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin() 
    )
}
module.exports = config;