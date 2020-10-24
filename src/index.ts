import {
  DefinedFormats,
  FormatMode,
  FormatName,
  formatNames,
  fastFormats,
  fullFormats,
} from "./formats"
import formatLimit from "./limit"
import type Ajv from "ajv"
import type {Plugin, Format} from "ajv"

export {FormatMode, FormatName} from "./formats"
export interface FormatOptions {
  mode?: FormatMode
  formats?: FormatName[]
  keywords?: boolean
}

export type FormatsPluginOptions = FormatName[] | FormatOptions

export interface FormatsPlugin extends Plugin<FormatsPluginOptions> {
  get: (format: FormatName, mode?: FormatMode) => Format
}

const formatsPlugin: FormatsPlugin = (
  ajv: Ajv,
  opts: FormatsPluginOptions = {keywords: true}
): Ajv => {
  if (Array.isArray(opts)) {
    addFormats(ajv, opts, fullFormats)
    return ajv
  }
  const formats = opts.mode === "fast" ? fastFormats : fullFormats
  const list = opts.formats || formatNames
  addFormats(ajv, list, formats)
  if (opts.keywords) formatLimit(ajv)
  return ajv
}

formatsPlugin.get = (name: FormatName, mode: FormatMode = "full"): Format => {
  const formats = mode === "fast" ? fastFormats : fullFormats
  const f = formats[name]
  if (!f) throw new Error(`Unknown format "${name}"`)
  return f
}

function addFormats(ajv: Ajv, list: FormatName[], fs: DefinedFormats): void {
  for (const f of list) ajv.addFormat(f, fs[f])
}

export default formatsPlugin

module.exports = formatsPlugin
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = formatsPlugin
