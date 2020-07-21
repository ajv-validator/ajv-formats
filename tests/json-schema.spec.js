"use strict"

const jsonSchemaTest = require("json-schema-test")
const Ajv = require("ajv")
const ajv = new Ajv({$data: true})
const addFormats = require("..")

addFormats(ajv, "full")

const instances = [ajv]

jsonSchemaTest(instances, {
  description: `JSON-Schema Test Suite draft-07: ${instances.length} ajv instances with different options`,
  suites: {
    draft7:
      "./JSON-Schema-Test-Suite/tests/draft7/optional/{format/*,ecmascript-regex}.json",
    extras: "./extras/{**/,}*.json",
  },
  only: [],
  skip: [
    "format/idn-email",
    "format/idn-hostname",
    "format/iri",
    "format/iri-reference",
  ],
  afterEach(res) {
    expect(typeof res.valid).toBe("boolean")
    if (res.valid === true) {
      expect(res.errors).toBe(null)
    } else {
      expect(Array.isArray(res.errors)).toBe(true)
      res.errors.every((err) => expect(typeof err).toBe("object"))
    }
  },
  cwd: __dirname,
  hideFolder: "draft7/",
})
