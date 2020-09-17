module.exports = {
  globals: {
    expect: false,
    describe: false,
    beforeAll: false,
    test: false,
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: ["./tests/tsconfig.json"],
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
}
