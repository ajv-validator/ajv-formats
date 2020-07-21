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
  formats: FormatName[]
}

export type PluginOptions = FormatMode | FormatName[] | FormatOptions

const formatsPlugin: AjvPlugin = function (
  ajv: Ajv,
  opts: PluginOptions = "full"
): Ajv {
  if (typeof opts === "string") {
    const fs = formats[opts]
    const names = Object.keys(fs) as FormatName[]
    addFormats(names, fs, opts)
  } else if (Array.isArray(opts)) {
    addFormats(opts, formats.full, "full")
  } else {
    addFormats(opts.formats, formats[opts.mode], opts.mode)
  }
  return ajv

  function addFormats(
    list: FormatName[],
    fs: DefinedFormats,
    mode: FormatMode
  ) {
    for (const f of list) {
      ajv.addFormat(f, fs[f])
    }
    ajv._opts.format = mode
  }
}

module.exports = formatsPlugin

formatsPlugin.get = get

function get(mode: FormatMode, format: FormatName): Format {
  const f = formats[mode][format]
  if (!f) throw new Error("Unknown format " + format)
  return f
}
