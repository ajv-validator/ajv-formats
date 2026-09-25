import Ajv, {FormatDefinition} from "ajv"
import addFormats from "../dist"
import type {FormatName} from "../dist"

describe("addFormats options", () => {
  let ajv: Ajv

  beforeEach(() => {
    ajv = new Ajv({strictTypes: false})
  })

  test("should add passed list of formats", () => {
    addFormats(ajv, ["date", "time"])
    const validateDate = ajv.compile({format: "date"})
    expect(validateDate("2020-09-17")).toEqual(true)
    expect(validateDate("2020-09-35")).toEqual(false)

    const validateTime = ajv.compile({format: "time"})
    expect(validateTime("17:27:38Z")).toEqual(true)
    expect(validateDate("25:27:38Z")).toEqual(false)

    expect(() => ajv.compile({format: "date-time"})).toThrow()
    addFormats(ajv, ["date-time"])
    expect(() => ajv.compile({format: "date-time"})).not.toThrow()
  })

  test("should support validation mode", () => {
    addFormats(ajv, {mode: "fast", formats: ["date", "time"]})
    const validateDate = ajv.compile({format: "date"})
    expect(validateDate("2020-09-17")).toEqual(true)
    expect(validateDate("2020-09-35")).toEqual(true)
    expect(validateDate("2020-09")).toEqual(false)

    const validateTime = ajv.compile({format: "time"})
    expect(validateTime("17:27:38Z")).toEqual(true)
    expect(validateTime("25:27:38Z")).toEqual(true)
    expect(validateTime("17:27")).toEqual(false)
  })
})

describe("method get", () => {
  test("should return format definition", () => {
    const timeFormat = addFormats.get("time")
    expect((timeFormat as FormatDefinition<string>).validate).toBeInstanceOf(Object)

    const fastTimeFormat = addFormats.get("time", "fast")
    expect((fastTimeFormat as FormatDefinition<string>).validate).toBeInstanceOf(RegExp)

    expect(() => addFormats.get("unknown" as FormatName)).toThrow()
  })
})

describe("date-time/time numeric offsets (RFC 3339 section 5.6)", () => {
  // time-numoffset = ("+" / "-") time-hour ":" time-minute
  // The colon and the minutes are both mandatory in the normative grammar,
  // see https://www.rfc-editor.org/rfc/rfc3339#section-5.6
  for (const mode of ["full", "fast"] as const) {
    test(`date-time and time should reject colonless/minutes-less offsets (${mode} mode)`, () => {
      const ajv = new Ajv({strictTypes: false})
      addFormats(ajv, {mode, formats: ["time", "date-time"]})

      const validateTime = ajv.compile({format: "time"})
      expect(validateTime("14:30:00+05:30")).toEqual(true)
      expect(validateTime("14:30:00+0530")).toEqual(false)
      expect(validateTime("14:30:00+05")).toEqual(false)

      const validateDateTime = ajv.compile({format: "date-time"})
      expect(validateDateTime("2024-01-15T14:30:00+05:30")).toEqual(true)
      expect(validateDateTime("2024-01-15T14:30:00+0530")).toEqual(false)
      expect(validateDateTime("2023-12-11T23:03:23.568+09")).toEqual(false)
    })

    test(`iso-time and iso-date-time should keep accepting colonless/minutes-less offsets (${mode} mode)`, () => {
      const ajv = new Ajv({strictTypes: false})
      addFormats(ajv, {mode, formats: ["iso-time", "iso-date-time"]})

      const validateIsoTime = ajv.compile({format: "iso-time"})
      expect(validateIsoTime("14:30:00+05:30")).toEqual(true)
      expect(validateIsoTime("14:30:00+0530")).toEqual(true)
      expect(validateIsoTime("14:30:00+05")).toEqual(true)

      const validateIsoDateTime = ajv.compile({format: "iso-date-time"})
      expect(validateIsoDateTime("2024-01-15T14:30:00+05:30")).toEqual(true)
      expect(validateIsoDateTime("2024-01-15T14:30:00+0530")).toEqual(true)
      expect(validateIsoDateTime("2023-12-11T23:03:23.568+09")).toEqual(true)
    })
  }
})
