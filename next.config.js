/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    REACT_APP_GMAP_API_KEY: "AIzaSyAQQwD07tGYt_zg9ApFDIsmuDI6CSoEliw",
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        "./node_modules/apexcharts-clevision"
      ),
    };

    return config;
  },
};
