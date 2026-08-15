import Ajv from "ajv"
import addFormats from "../../dist"

describe("issue #118, full uri format should accept path-empty URIs (RFC 3986 §3)", () => {
  let ajv: Ajv

  beforeAll(() => {
    ajv = new Ajv({strictTypes: false})
    addFormats(ajv)
  })

  const schema = {type: "string", format: "uri"}

  test("should accept a scheme followed by an empty path", () => {
    // hier-part = ... / path-empty, so "scheme:" is a valid URI
    expect(ajv.validate(schema, "a:")).toBe(true)
    expect(ajv.validate(schema, "mailto:")).toBe(true)
    expect(ajv.validate(schema, "a:?q")).toBe(true)
    expect(ajv.validate(schema, "a:#f")).toBe(true)
  })

  test("should still accept URIs with a non-empty path", () => {
    expect(ajv.validate(schema, "a:b")).toBe(true)
    expect(ajv.validate(schema, "a:b/c")).toBe(true)
    expect(ajv.validate(schema, "http://example.com")).toBe(true)
  })

  test("should still reject strings that are not URIs", () => {
    expect(ajv.validate(schema, "abc")).toBe(false)
    expect(ajv.validate(schema, "")).toBe(false)
    expect(ajv.validate(schema, "a: b")).toBe(false)
    expect(ajv.validate(schema, "//foo.bar")).toBe(false)
  })
})
