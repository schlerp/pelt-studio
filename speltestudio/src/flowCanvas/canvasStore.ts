import { BrowserJsPlumbInstance, newInstance } from "@jsplumb/browser-ui";
import { writable } from "svelte/store";
import type { IFlowDefinition } from "./types";
import safeid from "./utils/safeid";

export let refreshStore = writable<string>();

export let canvasStore = writable<HTMLElement>();

let canvas: HTMLElement;
canvasStore.subscribe((value) => {
  canvas = value;
});

export function createEmptyFlow(): IFlowDefinition {
  const id = safeid();
  return {
    id,
    name: `flow ${id}`,
    zoom: 1.0,
    pan: { x: 0.0, y: 0.0 },
    nodes: [],
    edges: [],
  };
}

export let currentFlowStore = writable<IFlowDefinition>(createEmptyFlow());

export let jsPlumbInstanceStore = writable<BrowserJsPlumbInstance>();

export function createJsPlumbInstance() {
  const spacing = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--spacing")
  );
  const jsPlumbInstance = newInstance({
    container: canvas,
    dragOptions: {
      grid: { w: spacing, h: spacing },
      cursor: "grabbing",
    },
  });
  jsPlumbInstanceStore.set(jsPlumbInstance);
}
