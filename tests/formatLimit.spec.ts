import Ajv from "ajv"
import {fullFormats, fastFormats} from "../dist/formats"
import formatLimit from "../dist/limit"
import ajvFormats from "../dist"

describe('keywords "formatMinimum" and "formatMaximum"', () => {
  const ajvs = getAjvs(true)
  const ajvsFF = getAjvs(false)

  ajvs.forEach((ajv, i) => {
    it(`should not validate formatMaximum/Minimum if option format == false #${i}`, () => {
      const ajvFF = ajvsFF[i]

      const schema = {
        type: "string",
        format: "date",
        formatMaximum: "2015-08-01",
      }

      const date = "2015-09-01"
      expect(ajv.validate(schema, date)).toEqual(false)
      expect(ajvFF.validate(schema, date)).toEqual(true)
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should throw when "format" is absent #${i}`, () => {
      expect(() => ajv.compile({type: "string", formatMaximum: "2015-08-01"})).toThrow()
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`formatExclusiveMaximum should throw if not boolean #${i}`, () => {
      expect(() =>
        ajv.compile({
          type: "string",
          formatMaximum: "2015-08-01",
          formatExclusiveMaximum: 1,
        })
      ).toThrow()
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`formatExclusiveMaximum should throw when "formatMaximum" is absent #${i}`, () => {
      expect(() => ajv.compile({type: "string", formatExclusiveMaximum: true})).toThrow()
    })
  })

  function getAjvs(validateFormats: boolean): Ajv[] {
    return [
      formatLimit(new Ajv({allErrors: true, validateFormats, formats: fullFormats})),
      formatLimit(new Ajv({allErrors: true, validateFormats, formats: fastFormats})),
      ajvFormats(new Ajv({allErrors: true, validateFormats})),
      ajvFormats(new Ajv({validateFormats}), {keywords: true}),
    ]
  }
})
