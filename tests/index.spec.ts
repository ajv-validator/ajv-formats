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
    addFormats(ajv, {mode: "fast", formats: ["date", "time", "date-time"]})
    const validateDate = ajv.compile({format: "date"})
    expect(validateDate("2020-09-17")).toEqual(true)
    expect(validateDate("2020-09-35")).toEqual(true)
    expect(validateDate("2020-09")).toEqual(false)

    const validateTime = ajv.compile({format: "time"})
    expect(validateTime("17:27:38Z")).toEqual(true)
    expect(validateTime("25:27:38Z")).toEqual(true)
    expect(validateTime("17:27")).toEqual(false)

    const validateDatetime = ajv.compile({format: "date-time"})
    expect(validateDatetime("2016-12-31T23:59:60Z")).toEqual(true)
    expect(validateDatetime("2015-12-31t23:59:60Z")).toEqual(true)
    expect(validateDatetime("2015-02-11t22:59:22Z")).toEqual(true)
    expect(validateDatetime("2020-01-01T20:00:00.000Z")).toEqual(true)
    expect(validateDatetime("2020-01-01T20:00:00.000Z")).toEqual(true)
    expect(validateDatetime("2023-05-04T01:14:00+21:00")).toEqual(true)
    expect(validateDatetime("2023-05-04T01:14:10+16:20")).toEqual(true)
    expect(validateDatetime("2023-05-04T01:14:21+09:50")).toEqual(true)
    expect(validateDatetime("2023-05-04T01:14:21-04:31")).toEqual(true)
    expect(validateDatetime("2023-05-04T01:14:21-23:59")).toEqual(true)
    expect(validateDatetime("2016-15-31T23:59:60Z")).toEqual(false)
    expect(validateDatetime("2015-00-11t22:59:22+00:00")).toEqual(false)
    expect(validateDatetime("2015-01-00T22:59:22+00:00")).toEqual(false)
    expect(validateDatetime("2016-12-31 23:59:60Z")).toEqual(false)
    expect(validateDatetime("2015-02-11t24:59:22Z")).toEqual(false)
    expect(validateDatetime("2020-01-01 20:00:00.000")).toEqual(false)
    expect(validateDatetime("2020-01-01 20:00:00.000Z")).toEqual(false)
    expect(validateDatetime("2023-05-04\t01:14:00+21:00")).toEqual(false)
    expect(validateDatetime("2023-05-04\r01:14:10+16:20")).toEqual(false)
    expect(validateDatetime("2015-02-11t22:59:22+24:30")).toEqual(false)
    expect(validateDatetime("2023-05-04\n01:14:21+09:50")).toEqual(false)
    expect(validateDatetime("2023-05-04\n01:14:21-04:31")).toEqual(false)
    expect(validateDatetime("2023-05-04t01:14:21-04:31:00")).toEqual(false)
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
