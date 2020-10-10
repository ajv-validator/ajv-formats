import Ajv from "ajv"
import addFormats from "../../dist"

describe("PR #617, full date format validation should understand leap years", () => {
  let ajv: Ajv

  beforeAll(() => {
    ajv = new Ajv({strictTypes: false})
    addFormats(ajv)
  })

  test("should handle non leap year affected dates with date-time", () => {
    const schema = {format: "date-time"}
    const validDateTime = "2016-01-31T00:00:00Z"

    expect(ajv.validate(schema, validDateTime)).toBe(true)
  })

  test("should handle non leap year affected dates with date", () => {
    const schema = {format: "date"}
    const validDate = "2016-11-30"

    expect(ajv.validate(schema, validDate)).toBe(true)
  })

  test("should handle year leaps as date-time", () => {
    const schema = {format: "date-time"}
    const validDateTime = "2016-02-29T00:00:00Z"
    const invalidDateTime = "2017-02-29T00:00:00Z"

    expect(ajv.validate(schema, validDateTime)).toBe(true)
    expect(ajv.validate(schema, invalidDateTime)).toBe(false)
  })

  test("should handle year leaps as date", () => {
    const schema = {format: "date"}
    const validDate = "2016-02-29"
    const invalidDate = "2017-02-29"

    expect(ajv.validate(schema, validDate)).toBe(true)
    expect(ajv.validate(schema, invalidDate)).toBe(false)
  })
})
