import type Ajv from "ajv"
import type {Plugin, CodeKeywordDefinition, KeywordErrorDefinition, Code, Name} from "ajv"
import type {AddedFormat, FormatValidator} from "ajv/dist/types"
import type {Rule} from "ajv/dist/compile/rules"
import KeywordCxt from "ajv/dist/compile/context"
import {_, str, or, getProperty, operators} from "ajv/dist/compile/codegen"

type Kwd = "formatMaximum" | "formatMinimum" | "formatExclusiveMaximum" | "formatExclusiveMinimum"

type Comparison = "<=" | ">=" | "<" | ">"

const ops = operators

const KWDs: {[K in Kwd]: {okStr: Comparison; ok: Code; fail: Code}} = {
  formatMaximum: {okStr: "<=", ok: ops.LTE, fail: ops.GT},
  formatMinimum: {okStr: ">=", ok: ops.GTE, fail: ops.LT},
  formatExclusiveMaximum: {okStr: "<", ok: ops.LT, fail: ops.GTE},
  formatExclusiveMinimum: {okStr: ">", ok: ops.GT, fail: ops.LTE},
}

const TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i
const DATE_TIME_SEPARATOR = /t|\s/i

export const COMPARE_FORMATS = {
  date: compareDate,
  time: compareTime,
  "date-time": compareDateTime,
}

const error: KeywordErrorDefinition = {
  message: ({keyword, schemaCode}) => str`should be ${KWDs[keyword as Kwd].okStr} ${schemaCode}`,
  params: ({keyword, schemaCode}) =>
    _`{comparison: ${KWDs[keyword as Kwd].okStr}, limit: ${schemaCode}}`,
}

export const formatLimitDefinition: CodeKeywordDefinition = {
  keyword: Object.keys(KWDs),
  type: "string",
  schemaType: "string",
  $data: true,
  error,
  code(cxt) {
    const {gen, data, schemaCode, keyword, it} = cxt
    const {opts, self} = it
    if (!opts.validateFormats) return

    const fCxt = new KeywordCxt(it, (self.RULES.all.format as Rule).definition, "format")
    if (fCxt.$data) validate$DataFormat()
    else validateFormat()

    function validate$DataFormat(): void {
      const fmts = gen.scopeValue("formats", {
        ref: self.formats,
        code: opts.code.formats,
      })
      const fmt = gen.const("fmt", _`${fmts}[${fCxt.schemaCode}]`)
      cxt.fail$data(
        or(
          _`typeof ${fmt} != "object"`,
          _`${fmt} instanceof RegExp`,
          _`typeof ${fmt}.compare != "function"`,
          compareCode(fmt)
        )
      )
    }

    function validateFormat(): void {
      const format = fCxt.schema as string
      const fmtDef: AddedFormat | undefined = self.formats[format]
      if (!fmtDef || fmtDef === true) return
      if (
        typeof fmtDef != "object" ||
        fmtDef instanceof RegExp ||
        typeof fmtDef.compare != "function"
      ) {
        throw new Error(`"${keyword}": format "${format}" does not define "compare" function`)
      }
      const fmt = gen.scopeValue("formats", {
        key: format,
        ref: fmtDef,
        code: opts.code.formats ? _`${opts.code.formats}${getProperty(format)}` : undefined,
      })

      cxt.fail$data(compareCode(fmt))
    }

    function compareCode(fmt: Name): Code {
      return _`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword as Kwd].fail} 0`
    }
  },
  dependencies: ["format"],
}

const formatLimitPlugin: Plugin<undefined> = (ajv: Ajv): Ajv => {
  ajv.addKeyword(formatLimitDefinition)
  extendFormats(ajv)
  return ajv
}

export default formatLimitPlugin

export function extendFormats(ajv: Ajv): void {
  const {formats} = ajv
  let name: keyof typeof COMPARE_FORMATS
  for (name in COMPARE_FORMATS) {
    let format = formats[name]
    // the last condition is needed if it's RegExp from another window
    if (typeof format != "object" || format instanceof RegExp || !format.validate) {
      format = formats[name] = {validate: format as RegExp | FormatValidator<string>}
    }
    if (!format.compare) format.compare = COMPARE_FORMATS[name]
  }
}

function compareDate(d1: string, d2: string): number | undefined {
  if (!(d1 && d2)) return undefined
  if (d1 > d2) return 1
  if (d1 < d2) return -1
  return 0
}

function compareTime(t1: string, t2: string): number | undefined {
  if (!(t1 && t2)) return undefined
  const a1 = TIME.exec(t1)
  const a2 = TIME.exec(t2)
  if (!(a1 && a2)) return undefined
  t1 = a1[1] + a1[2] + a1[3] + (a1[4] || "")
  t2 = a2[1] + a2[2] + a2[3] + (a2[4] || "")
  if (t1 > t2) return 1
  if (t1 < t2) return -1
  return 0
}

function compareDateTime(dt1: string, dt2: string): number | undefined {
  if (!(dt1 && dt2)) return undefined
  const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR)
  const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR)
  const res = compareDate(d1, d2)
  if (res === undefined) return undefined
  return res || compareTime(t1, t2)
}
