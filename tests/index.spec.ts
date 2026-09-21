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

  test("should reject duration components out of order", () => {
    addFormats(ajv, ["duration"])
    const validateDuration = ajv.compile({format: "duration"})
    expect(validateDuration("P1Y2D")).toEqual(false)
    expect(validateDuration("PT1H2S")).toEqual(false)
    expect(validateDuration("P1Y0M2D")).toEqual(true)
    expect(validateDuration("PT1H0M2S")).toEqual(true)
    expect(validateDuration("P1Y2M3DT4H5M6S")).toEqual(true)
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
