<script lang="ts">
  import { currentFlowStore } from "../flowCanvas/canvasStore";

  import LogoIcon from "../LogoIcon.svelte";

  export let title: string = "PELT Studio";
</script>

<div class="appbar">
  <div class="logo">
    <LogoIcon />
    <h1>{title}</h1>
  </div>
  {#if $currentFlowStore.name !== undefined}
    <p>{$currentFlowStore.name}</p>
  {/if}
</div>

<style>
  .appbar {
    padding: calc(2 * var(--spacing));
    z-index: 9999;
    border-bottom: 4px solid var(--pal-border-hard);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: calc(2 * var(--spacing));
  }
  h1 {
    margin: 0;
    color: var(--pal-text);
    font-size: 2rem;
    text-transform: uppercase;
    display: inline;
    text-align: center;
  }
  p {
    color: var(--pal-text-soft);
  }
</style>
