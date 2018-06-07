const path = require("path"); // eslint-disable-line

// Minimal Webpack config to supply to Eslint.
module.exports = {
    context: __dirname,

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'upload',
        libraryTarget: 'umd',
    },

    entry: './src/index.js',

    module: {
        rules: [
            {
                test: /\.js/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: ['.js'],
    },

    externals: {
        vue: 'vue',
    },
};
