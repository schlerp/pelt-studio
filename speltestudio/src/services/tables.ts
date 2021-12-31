import { tableStore } from "../store";
import type { ITableDefinition } from "../flowCanvas/types";
import { isEqual, differenceWith } from "lodash";

export const tableSyncService = (tableApi) => ({
  updateServerTables: async function updateServerTables(
    clientTables: ITableDefinition[]
  ) {
    const apiTables: ITableDefinition[] = await tableApi
      .readall()
      .then((data) => data.json());

    differenceWith(clientTables, apiTables, isEqual).forEach((ct) => {
      if (
        apiTables.find((t) => {
          return t.id === ct.id;
        }) === undefined
      ) {
        tableApi.create(ct);
      } else {
        tableApi.update(ct.name, ct);
      }
    });
  },

  updateClientTables: async function updateClientTables(): Promise<void> {
    const apiTables: ITableDefinition[] = await tableApi
      .readall()
      .then((data) => data.json());

    tableStore.update((clientTables) => {
      return [
        ...clientTables,
        ...differenceWith(apiTables, clientTables, isEqual),
      ];
    });
  },
});
