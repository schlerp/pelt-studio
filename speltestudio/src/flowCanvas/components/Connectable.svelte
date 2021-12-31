<script lang="ts">
  import { onMount } from "svelte";
  import { jsPlumbInstanceStore } from "../canvasStore";

  export let isSource: Boolean = true;
  export let isTarget: Boolean = true;
  export let id: string;

  let element: HTMLDivElement;

  onMount(() => {
    if (isSource) {
      $jsPlumbInstanceStore.addEndpoint(element, {
        endpoint: "Dot",
        anchor: "Right",
        maxConnections: -1,
        source: true,
        target: false,
        cssClass: "endpointRound",
        hoverClass: "endpointRoundHover",
      });
    }
    if (isTarget) {
      $jsPlumbInstanceStore.addEndpoint(element, {
        endpoint: "Rectangle",
        anchor: "Left",
        maxConnections: -1,
        source: false,
        target: true,
        cssClass: "endpointSquare",
        hoverClass: "endpointSquareHover",
      });
    }
    console.debug("created endpoints for", id);
  });
</script>

<div {id} bind:this={element}>
  <slot />
</div>

<style>
  /* endpoint styles */
  :global(.endpointSquare) {
    border: 1px solid var(--pal-border);
  }
  :global(.endpointRound) {
    border: 1px solid var(--pal-border);
    border-radius: 50%;
  }
  :global(.endpointSquareHover) {
    border: 1px solid var(--pal-info);
  }
  :global(.endpointRoundHover) {
    border: 1px solid var(--pal-success);
    border-radius: 50%;
  }
</style>
