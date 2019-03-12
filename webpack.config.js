const path = require('path');

module.exports = {
    mode: "development",
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false
    },
    resolve: {
        extensions: ['.js']
    },
    entry: './testing/App.js',
    output: {
        path: path.resolve(__dirname, "testing/assets"),
        filename: 'app.js',
        pathinfo: false,
    }
  };