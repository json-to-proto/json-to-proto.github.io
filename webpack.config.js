module.exports = {
    context: __dirname,

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },

    entry: {
        app: './src/app'
    },

    output: {
        path: __dirname + '/docs/js',
        filename: '[name].js'
    },
};