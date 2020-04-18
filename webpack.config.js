module.exports = {
    context: __dirname,

    entry: {
        app: './src/app'
    },

    output: {
        path: __dirname + '/public/js',
        filename: '[name].js'
    },
};