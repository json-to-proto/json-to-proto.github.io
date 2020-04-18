module.exports = {
    context: __dirname,

    entry: {
        app: './src/app'
    },

    output: {
        path: __dirname + '/docs/js',
        filename: '[name].js'
    },
};