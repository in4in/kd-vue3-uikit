const path = require("path");

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-controls",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss",
    //"@storybook/preset-typescript",
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            additionalData: `@import "../src/assets/scss/base/index.scss";`,
            includePaths: [__dirname, "../src/assets/scss/**/*"],
          },
        },
      ],
      include: path.resolve(__dirname, "../src/assets/scss"),
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src/assets"),
          "~": path.resolve(__dirname, "../node_modules"),
        },
      },
    });
    config.module.rules.push({
      test: /\.mjs$/,
      resolve: {
        fullySpecified: false,
      },
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
}