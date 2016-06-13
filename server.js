var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var appConfig = require('./webpack.config');

new WebpackDevServer(webpack(appConfig), {
  	publicPath: appConfig.output.publicPath,
  	hot: true,
  	historyApiFallback: true,
    contentBase: 'src',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}).listen(3000, function (err, result) {
  	if (err) {
    	return console.log(err);
  	}

  	console.log('Listening at http://:3000/');
});
