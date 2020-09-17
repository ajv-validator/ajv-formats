import {
  DefinedFormats,
  FormatMode,
  FormatName,
  formatNames,
  fastFormats,
  fullFormats,
} from "./formats"
import type Ajv from "ajv"
import type {Plugin, Format} from "ajv"

export {FormatMode, FormatName} from "./formats"
export interface FormatOptions {
  mode?: FormatMode
  formats?: FormatName[]
}

export type FormatsPluginOptions = FormatName[] | FormatOptions

export interface FormatsPlugin extends Plugin<FormatsPluginOptions> {
  get: (format: FormatName, mode?: FormatMode) => Format
}

const formatsPlugin: FormatsPlugin = (ajv: Ajv, opts: FormatsPluginOptions = {}): Ajv => {
  if (Array.isArray(opts)) return addFormats(ajv, opts, fullFormats)
  const formats = opts.mode === "fast" ? fastFormats : fullFormats
  const list = opts.formats || formatNames
  return addFormats(ajv, list, formats)
}

formatsPlugin.get = (name: FormatName, mode: FormatMode = "full"): Format => {
  const formats = mode === "fast" ? fastFormats : fullFormats
  const f = formats[name]
  if (!f) throw new Error(`Unknown format "${name}"`)
  return f
}

function addFormats(ajv: Ajv, list: FormatName[], fs: DefinedFormats): Ajv {
  for (const f of list) ajv.addFormat(f, fs[f])
  return ajv
}

export default formatsPlugin

module.exports = formatsPlugin
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = formatsPlugin
