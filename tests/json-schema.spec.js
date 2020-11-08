const jsonSchemaTest = require("json-schema-test")
const Ajv = require("ajv")
const addFormats = require("../dist")

const ajv = new Ajv({$data: true, strictTypes: false, formats: {allowedUnknown: true}})
addFormats(ajv)

jsonSchemaTest(ajv, {
  description: `JSON-Schema Test Suite draft-07 formats + extras`,
  suites: {
    "draft-07 formats": "./JSON-Schema-Test-Suite/tests/draft7/optional/format/*.json",
    "draft-07 regex": "./JSON-Schema-Test-Suite/tests/draft7/optional/ecmascript-regex.json",
    "draft-2019-09 formats": "./JSON-Schema-Test-Suite/tests/draft2019-09/optional/format/*.json",
    "draft-2019-09 regex":
      "./JSON-Schema-Test-Suite/tests/draft2019-09/optional/ecmascript-regex.json",
    extras: "./extras/{**/,}*.json",
  },
  only: [],
  skip: ["format/idn-email", "format/idn-hostname", "format/iri", "format/iri-reference"],
  afterEach({valid, errors}) {
    expect(typeof valid).toBe("boolean")
    if (valid === true) {
      expect(errors).toBe(null)
    } else {
      expect(Array.isArray(errors)).toBe(true)
      errors.every((err) => expect(typeof err).toBe("object"))
    }
  },
  cwd: __dirname,
  hideFolder: "draft7/",
})
