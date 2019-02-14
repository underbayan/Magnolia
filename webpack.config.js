const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
module.exports = env => {
    const name = 'tx-share' + (env.v ? env.v : '') + '.js'
    return {
        entry: './src/index.js',
        mode: env.dev ? 'development' : 'production',
        watch: !!env.dev,
        devtool: 'source-map',
        output: {
            filename: name,
            publicPath: env.dev ? '/lib/' : '/dist/',
            path: path.resolve(__dirname, env.dev ? 'lib' : 'dist'),
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: 'TX_SHARE'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    loader: 'babel-loader',
                    include: [path.resolve(__dirname, './src')],
                    options: {
                        extends: path.resolve(__dirname, '.babelrc')
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        plugins: [
            // new BundleAnalyzerPlugin({
            //     analyzerPort: 5000 + ~~(Math.random() * 300)
            // })
        ]
    }
}
