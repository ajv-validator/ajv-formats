import Ajv from "ajv"
import addFormats from "../../dist"

describe.each(["full", "fast"] as const)("byte format in %s mode", (mode) => {
  const ajv = new Ajv()
  addFormats(ajv, {mode})
  const validate = ajv.compile({type: "string", format: "byte"})

  test("should validate large base64 strings with and without padding", () => {
    for (const size of [5 * 1024 * 1024, 5 * 1024 * 1024 + 1, 5 * 1024 * 1024 + 2]) {
      expect(validate(Buffer.alloc(size).toString("base64"))).toBe(true)
    }
  })

  test("should reject large strings with invalid lengths, padding, or characters", () => {
    const value = "AAAA".repeat(2 * 1024 * 1024)
    for (const suffix of ["A", "=", "===", "!", "AA=A"]) {
      expect(validate(value + suffix)).toBe(false)
    }
  })

  test("should preserve empty, padded, and multiline validation", () => {
    for (const value of ["", "AAAA", "AA==", "AAA=", "+/==", "AAAA\nAAAA", "A\nAA=="]) {
      expect(validate(value)).toBe(true)
      expect(validate(value)).toBe(true)
    }
    for (const value of ["A", "AA", "AAA", "AAAA=", "A===", "AA=A", "AA-_", "AA== "]) {
      expect(validate(value)).toBe(false)
    }
  })
})
