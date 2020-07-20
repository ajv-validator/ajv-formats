import { FormatMode, FormatName, FormatValidator, FormatDefinition, standardFormats } from "./formats"
import AjvPlugin, { Ajv } from "./plugin"

interface FormatOptions {
  mode: FormatMode
  formats: Array<FormatName>
}

type PluginOptions = FormatMode | Array<FormatName> | FormatOptions

const formatsPlugin: AjvPlugin = function (ajv: Ajv, opts: PluginOptions = "fast"): Ajv {
  if (typeof opts === "string") {
    const fs = standardFormats[opts]
    let f: FormatName
    for (f in fs) {
      ajv.addFormat(f, fs[f])
    }
  } else if (Array.isArray(opts)) {
    const fs = standardFormats.fast
    for (const f of opts) {
      ajv.addFormat(f, fs[f])
    }
  } else {
    const fs = standardFormats[opts.mode]
    for (const f of opts.formats) {
      ajv.addFormat(f, fs[f])
    }
  }
  return ajv
}

export default formatsPlugin

formatsPlugin.get = get

function get(mode: FormatMode, format: FormatName): FormatValidator | FormatDefinition {
  var f = standardFormats[mode][format]
  if (!f) throw new Error('Unknown format ' + format)
  return f
}
