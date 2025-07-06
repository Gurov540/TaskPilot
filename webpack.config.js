const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      main: "./src/js/main.js", // Здесь импортируем CSS!
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "js/[name].[contenthash].js" : "js/[name].js",
      clean: true,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
      hot: true,
      open: true,
      watchFiles: ["src/**/*"],
    },
    module: {
      rules: [
        // CSS обработка
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        // Изображения
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name][ext]",
          },
        },
        // Шрифты
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        chunks: ["main"], // Подключаем только основной чанк
      }),
      new MiniCssExtractPlugin({
        filename: isProduction
          ? "css/[name].[contenthash].css"
          : "css/[name].css",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "src/assets",
            to: "assets",
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    devtool: isProduction ? false : "source-map",
  };
};
