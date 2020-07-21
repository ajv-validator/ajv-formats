// TODO move plugin interface either to ajv or a separate package
import {Format, FormatMode} from "./formats"

export interface Ajv {
  addFormat: (name: string, f: Format) => Ajv
  _opts: {
    format: FormatMode | false
  }
}

export default interface AjvPlugin {
  (ajv: Ajv, options: any): Ajv
  [prop: string]: any
}
