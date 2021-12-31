<script lang="ts">
  import Appbar from "./appbar/Appbar.svelte";
  import Canvas from "./flowCanvas/Canvas.svelte";
  import Theme from "./Theme.svelte";
  import Sidebar from "./sidebar/Sidebar.svelte";
  import { refreshStore, currentFlowStore } from "./flowCanvas/canvasStore";
  import { flowStore } from "./store";

  let refreshKey: string;
  refreshStore.subscribe((value) => {
    refreshKey = value;
  });

  $: {
    if ($currentFlowStore) {
      flowStore.update((flows) => {
        if (flows.find((f) => $currentFlowStore.id === f.id) !== undefined) {
          const flowsNoCurrent = flows.filter(
            (f) => $currentFlowStore.id !== f.id
          );
          return [...flowsNoCurrent, $currentFlowStore];
        }
        return flows;
      });
    }
  }
</script>

<Theme />
<main>
  <Appbar />
  <div class="appContent">
    <Sidebar />
    {#key refreshKey}
      <Canvas bind:currentFlow={$currentFlowStore} />
    {/key}
  </div>
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .appContent {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
  }
</style>
