const jsonSchemaTest = require("json-schema-test")
const Ajv = require("ajv").default
const addFormats = require("../dist")

jsonSchemaTest(getAjv(true), {
  description: `JSON-Schema Test Suite formats`,
  suites: {
    "draft-07 formats": "./JSON-Schema-Test-Suite/tests/draft7/optional/format/*.json",
    "draft-07 regex": "./JSON-Schema-Test-Suite/tests/draft7/optional/ecmascript-regex.json",
    "draft-2019-09 formats": "./JSON-Schema-Test-Suite/tests/draft2019-09/optional/format/*.json",
    "draft-2019-09 regex":
      "./JSON-Schema-Test-Suite/tests/draft2019-09/optional/ecmascript-regex.json",
    "draft-2020-12 formats": "./JSON-Schema-Test-Suite/tests/draft2020-12/optional/format/*.json",
    "draft-2020-12 regex":
      "./JSON-Schema-Test-Suite/tests/draft2020-12/optional/ecmascript-regex.json",
  },
  only: [],
  skip: ["format/idn-email", "format/idn-hostname", "format/iri", "format/iri-reference"],
  afterEach,
  cwd: __dirname,
  hideFolder: "draft7/",
})

jsonSchemaTest(getAjv(), {
  description: `Extra tests`,
  suites: {
    extras: "./extras/{**/,}*.json",
  },
  only: [],
  afterEach,
  cwd: __dirname,
})

function getAjv(strictTime) {
  const ajv = new Ajv({$data: true, strictTypes: false, formats: {allowedUnknown: true}})
  addFormats(ajv, {mode: "full", keywords: true, strictTime})
  return ajv
}

function afterEach({valid, errors}) {
  expect(typeof valid).toBe("boolean")
  if (valid === true) {
    expect(errors).toBe(null)
  } else {
    expect(Array.isArray(errors)).toBe(true)
    errors.every((err) => expect(typeof err).toBe("object"))
  }
}
