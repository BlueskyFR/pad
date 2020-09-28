// The syntax has to be VUE_APP_* to be replaced during build
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  // ...
};
