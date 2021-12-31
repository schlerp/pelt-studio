import { writable } from "svelte/store";
import type { ITableDefinition, IFlowDefinition } from "./flowCanvas/types";

// initialise the flow, this acts as a local cache of flows
export let flowStore = writable<IFlowDefinition[]>([]);

// initialise the tableStore, this acts as a local cache of defined tables
export let tableStore = writable<ITableDefinition[]>([]);
