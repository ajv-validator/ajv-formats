// TODO move plugin interface either to ajv or a separate package
import {FormatDefinition} from "./formats"

export interface Ajv {
  addFormat: (name: string, f: FormatDefinition) => Ajv
}

export default interface AjvPlugin {
  (ajv: Ajv, options: any): Ajv
  [prop: string]: any
}
