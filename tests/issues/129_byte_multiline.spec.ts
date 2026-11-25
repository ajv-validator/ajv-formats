import Ajv from "ajv"
import addFormats from "../../dist"

describe("Issue #129, byte format must validate the entire string", () => {
  let ajv: Ajv

  beforeAll(() => {
    ajv = new Ajv({strictTypes: false})
    addFormats(ajv)
  })

  const byte = (value: string) => ajv.validate({type: "string", format: "byte"}, value)

  test("accepts valid base64", () => {
    expect(byte("aGVsbG8=")).toBe(true)
  })

  test("rejects invalid single-line base64", () => {
    expect(byte("not base64!")).toBe(false)
  })

  test("rejects strings with one valid line among invalid lines", () => {
    expect(byte("not base64!\n")).toBe(false)
    expect(byte("\nnot base64!")).toBe(false)
    expect(byte("<script>\naGVsbG8=")).toBe(false)
    expect(byte("!!!!\n\n!!!!")).toBe(false)
  })
})
