import {DefinedFormats, FormatMode, FormatName, formats} from "./formats"
import type Ajv from "ajv"
import type {Plugin, Format} from "ajv"

export {FormatMode, FormatName} from "./formats"
export interface FormatOptions {
  mode: FormatMode
  formats: FormatName[]
}

export type FormatsPluginOptions = FormatMode | FormatName[] | FormatOptions

export interface FormatsPlugin extends Plugin<FormatsPluginOptions> {
  get: (mode: FormatMode, format: FormatName) => Format
}

const formatsPlugin: FormatsPlugin = (ajv: Ajv, opts: FormatsPluginOptions = "full"): Ajv => {
  if (typeof opts === "string") {
    const fs = formats[opts]
    const names = Object.keys(fs) as FormatName[]
    addFormats(ajv, names, fs)
  } else if (Array.isArray(opts)) {
    addFormats(ajv, opts, formats.full)
  } else {
    addFormats(ajv, opts.formats, formats[opts.mode])
  }
  return ajv
}

formatsPlugin.get = (mode: FormatMode, format: FormatName): Format => {
  const f = formats[mode][format]
  if (!f) throw new Error(`Unknown format "${format}"`)
  return f
}

function addFormats(ajv: Ajv, list: FormatName[], fs: DefinedFormats): void {
  for (const f of list) {
    ajv.addFormat(f, fs[f])
  }
}

export default formatsPlugin

module.exports = formatsPlugin
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = formatsPlugin
