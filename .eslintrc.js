const jsConfig = require("@ajv-validator/config/.eslintrc_js")
const tsConfig = require("@ajv-validator/config/.eslintrc")

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    jsConfig,
    {
      ...tsConfig,
      files: ["*.ts"],
      rules: {
        ...tsConfig.rules,
        "no-control-regex": "off",
        "@typescript-eslint/prefer-regexp-exec": "warn",
      },
    },
  ],
}
