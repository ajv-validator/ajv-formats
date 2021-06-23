import Ajv from "ajv"
import addFormats from "../dist"

const ajv = new Ajv({$data: true, strictTypes: false, formats: {allowedUnknown: true}})
addFormats(ajv, {strictDate: true})

describe("strictDate option", () => {
  it("a valid date-time string with time offset", () => {
    expect(
      ajv.validate(
        {
          type: "string",
          format: "date-time",
        },
        "2020-06-19T12:13:14+05:00"
      )
    ).toBe(true)
  })

  it("an invalid date-time string (no time offset)", () => {
    expect(
      ajv.validate(
        {
          type: "string",
          format: "date-time",
        },
        "2020-06-19T12:13:14"
      )
    ).toBe(false)
  })

  it("an invalid date-time string (invalid time offset)", () => {
    expect(
      ajv.validate(
        {
          type: "string",
          format: "date-time",
        },
        "2020-06-19T12:13:14+26:00"
      )
    ).toBe(false)
  })
})
