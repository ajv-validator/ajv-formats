module.exports = {
  ...require("@ajv-validator/config/.eslintrc"),
  rules: {
    "no-control-regex": 1,
    "@typescript-eslint/prefer-regexp-exec": 1,
  },
}
