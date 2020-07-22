// TODO move plugin interface either to ajv or a separate package
import {Format} from "./formats"

export interface Ajv {
  addFormat: (name: string, f: Format) => Ajv
}

export default interface AjvPlugin {
  (ajv: Ajv, options: any): Ajv
  [prop: string]: any
}
