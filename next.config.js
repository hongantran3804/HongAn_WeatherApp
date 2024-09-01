module.exports = {
  images: {
    domains: ["openweathermap.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        port: "80",
        pathname: "/**",
      },
    ],
  },
};
