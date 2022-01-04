<script lang="ts">
  import { flowSyncService } from "../services/flows";
  import { Resource } from "../services/client";
  import { onMount } from "svelte";
  import { flowStore } from "../store";
  import { currentFlowStore } from "../flowCanvas/canvasStore";
  import type { IFlowDefinition } from "../flowCanvas/types";
  import ButtonControl from "../flowCanvas/controls/ButtonControl.svelte";
  import { loadFlow } from "../flowCanvas/utils/canvasUtils";
  import FlowIcon from "../FlowIcon.svelte";
  import { createEmptyFlow } from "../flowCanvas/canvasStore";

  export let apiUrl: string = "http://localhost:8321";
  const tableApi = Resource(apiUrl, "flow");
  const serviceFs = flowSyncService(tableApi);

  let flows: IFlowDefinition[];

  flowStore.subscribe((serverFlows) => {
    flows = serverFlows.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  });

  onMount(() => {
    serviceFs.updateClientFlows();
  });
</script>

<div class="sidebar">
  <ButtonControl
    variant="transparent"
    handleClick={(e) => {
      loadFlow(createEmptyFlow());
    }}
  >
    <span><FlowIcon />New Flow</span>
  </ButtonControl>
  <h3>Existing Flows</h3>
  {#each flows as flow (flow.id)}
    {#if flow.id === $currentFlowStore.id}
      <ButtonControl
        variant="primary"
        handleClick={(e) => {
          loadFlow(flow);
          // console.log("setting flow", flow);
        }}
      >
        <span><FlowIcon />{flow.name}</span>
      </ButtonControl>
    {:else}
      <ButtonControl
        variant="transparent"
        handleClick={(e) => {
          loadFlow(flow);
          // console.log("setting flow", flow);
        }}
      >
        <span><FlowIcon />{flow.name}</span>
      </ButtonControl>
    {/if}
  {/each}
</div>

<style>
  .sidebar {
    height: calc(100% - calc(4 * var(--spacing)));
    width: clamp(16em, 15%, 25em);
    padding: calc(2 * var(--spacing));
    color: var(--pal-text);
    border-right: 4px solid var(--pal-border-hard);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }
  span {
    display: flex;
    align-items: center;
    gap: var(--spacing);
  }
</style>
