import type { ITableDefinition } from "../types";
import safeid from "./safeid";

export function cleanTableDefinition(
  tableDefinition: ITableDefinition
): ITableDefinition {
  tableDefinition.schema = tableDefinition.schema ?? "";
  tableDefinition.database = tableDefinition.database ?? "";
  tableDefinition.materialised = tableDefinition.materialised ?? false;
  tableDefinition.columns = tableDefinition.columns.map((c) => {
    return {
      ...c,
      id: c.id ?? safeid(),
    };
  });
  return tableDefinition;
}

export default cleanTableDefinition;
