import type { IAPIResource } from "../flowCanvas/types";

export function Resource<T>(apiRoot: string, resName: string): IAPIResource<T> {
  return {
    create: function create(data) {
      return fetch(`${apiRoot}/${resName}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" },
      });
    },
    read: function read(id: string) {
      return fetch(`${apiRoot}/${resName}/${id}`, {
        method: "GET",
      });
    },
    readall: function read() {
      return fetch(`${apiRoot}/${resName}`, {
        method: "GET",
      });
    },
    update: function update(id: string, data: any) {
      return fetch(`${apiRoot}/${resName}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" },
      });
    },
    delete: function del(id: string) {
      return fetch(`${apiRoot}/${resName}/${id}`, {
        method: "DELETE",
      });
    },
    command: function custom(path: string) {
      return fetch(`${apiRoot}/${path}`, {
        method: "GET",
      });
    },
  };
}

export const APIClient = (apiRoot: string) => ({
  table: Resource(apiRoot, "table"),
  column: Resource(apiRoot, "column"),
  database: Resource(apiRoot, "database"),
  transform: Resource(apiRoot, "transform"),
  flows: Resource(apiRoot, "flow"),
});

export default APIClient;
