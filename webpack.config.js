module.exports = {
  mode: "production",
  entry: "./src/service.js",
  output: {
    filename: "service.js",
    path: __dirname + "/build",
  },
};
