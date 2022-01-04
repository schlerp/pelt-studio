<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import type { ConnectionEstablishedParams } from "@jsplumb/core";
  import type { ITableDefinition, INode, IFlowDefinition } from "./types";
  import { isITableDefinition, isITransformDefinition } from "./types";
  import type { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
  import { EVENT_CONNECTION } from "@jsplumb/core";
  import { safeid } from "./utils/safeid";
  import Node from "./Node.svelte";
  import TableForm from "./components/TableForm.svelte";
  import TransformForm from "./components/TransformForm.svelte";
  import {
    handlePanning,
    handleScroll,
    addNode,
    handleEndPan,
  } from "./utils/canvasUtils";
  import CanvasMenu from "./components/canvasMenu/CanvasMenu.svelte";
  import { tableStore } from "../store";
  import {
    canvasStore,
    createJsPlumbInstance,
    jsPlumbInstanceStore,
  } from "./canvasStore";

  let canvasElement: HTMLDivElement;
  let tables: Array<ITableDefinition>;
  let jsPlumbInstance: BrowserJsPlumbInstance;
  export let currentFlow: IFlowDefinition;

  tableStore.subscribe((value) => {
    tables = value;
  });

  jsPlumbInstanceStore.subscribe((value) => {
    jsPlumbInstance = value;
  });

  const thisHandlePanning = (e: MouseEvent) => handlePanning(e);

  onMount(() => {
    canvasStore.set(canvasElement);
    createJsPlumbInstance();
    $jsPlumbInstanceStore.bind(EVENT_CONNECTION, handleConnection);
  });

  onDestroy(() => {
    jsPlumbInstance.removeAllEndpoints(canvasElement);
    jsPlumbInstance.deleteEveryConnection();
  });

  function handleConnection(params: ConnectionEstablishedParams) {
    currentFlow.edges = [
      ...currentFlow.edges,
      { source: params.sourceId, target: params.targetId },
    ];
  }

  function handleMouseDown(event: MouseEvent) {
    if (event.target === canvasElement && event.button === 0) {
      event.target.addEventListener("mousemove", thisHandlePanning);
    }
  }

  function handleMouseUp(event: MouseEvent) {
    if (event.target === canvasElement && event.button === 0) {
      event.target.removeEventListener("mousemove", thisHandlePanning);
      handleEndPan();
    }
  }

  async function handleDragEnd(event) {
    console.debug(event);
    const tableId = event.dataTransfer.getData("text/plain");
    const table = tables.find((t) => t.id === tableId);
    if (table !== undefined) {
      addNode({ ...table, left: event.x, top: event.y } as INode);
      await tick();
      jsPlumbInstance.repaintEverything();
    }
  }
</script>

<div class="wrapper">
  <CanvasMenu bind:flowName={currentFlow.name} />
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    bind:this={canvasElement}
    class="canvas"
    on:wheel|preventDefault={(e) => {
      handleScroll(e);
    }}
    on:mousedown={handleMouseDown}
    on:mouseup={handleMouseUp}
    on:mouseout={handleMouseUp}
    on:drop|preventDefault={handleDragEnd}
    on:dragenter|preventDefault={() => {}}
    on:dragover|preventDefault={() => {}}
  >
    {#each currentFlow.nodes as node, idx}
      {#if isITableDefinition(node) && node.name !== undefined}
        <svelte:component
          this={Node}
          form={TableForm}
          bind:formContext={currentFlow.nodes[idx]}
          id={node.id || safeid()}
          title="Table"
          bind:top={node.top}
          bind:left={node.left}
        >
          <svelte:fragment slot="footer">
            <span>{node.materialised ? "Materialised" : "Unmaterialised"}</span>
            <span
              >{node.schema !== ""
                ? `[${node.schema}].[${node.name}]`
                : `[${node.name}]`}</span
            >
          </svelte:fragment>
        </svelte:component>
      {:else if isITransformDefinition(node) && node.transform !== undefined}
        <svelte:component
          this={Node}
          form={TransformForm}
          bind:formContext={currentFlow.nodes[idx]}
          title="Transform"
          id={node.id}
          bind:top={node.top}
          bind:left={node.left}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .canvas {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--pal-border-light);
  }
</style>
