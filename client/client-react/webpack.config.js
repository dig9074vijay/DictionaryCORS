import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/main.tsx', // TypeScript entry point
    output: {
      path: path.resolve('dist'),
      filename: 'bundle.js',
      publicPath: isProduction ? './' : '/', // Use relative paths for production
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.webpack.json',
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
    devServer: {
      static: './dist',
      port: 3000,
      host: '0.0.0.0', // Allow external connections
      open: true,
      historyApiFallback: true, // for React Router
    },
    mode: argv.mode || 'development',
  };
};
