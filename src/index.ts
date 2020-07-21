import {
  Format,
  DefinedFormats,
  FormatMode,
  FormatName,
  formats,
} from "./formats"
import AjvPlugin, {Ajv} from "./plugin"

export interface FormatOptions {
  mode: FormatMode
  formats: Array<FormatName>
}

export type PluginOptions = FormatMode | Array<FormatName> | FormatOptions

const formatsPlugin: AjvPlugin = function (
  ajv: Ajv,
  opts: PluginOptions = "fast"
): Ajv {
  if (typeof opts === "string") {
    const fs: DefinedFormats = formats[opts]
    let f: FormatName
    for (f in fs) {
      ajv.addFormat(f, fs[f])
    }
  } else if (Array.isArray(opts)) {
    const fs: DefinedFormats = formats.fast
    for (const f of opts) {
      ajv.addFormat(f, fs[f])
    }
  } else {
    const fs: DefinedFormats = formats[opts.mode]
    for (const f of opts.formats) {
      ajv.addFormat(f, fs[f])
    }
  }
  return ajv
}

export default formatsPlugin

formatsPlugin.get = get

function get(mode: FormatMode, format: FormatName): Format {
  const f = formats[mode][format]
  if (!f) throw new Error("Unknown format " + format)
  return f
}
