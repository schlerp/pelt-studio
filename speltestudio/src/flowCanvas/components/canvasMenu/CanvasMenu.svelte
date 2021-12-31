<script lang="ts">
  import ButtonControl from "../../controls/ButtonControl.svelte";
  import InputControl from "../../controls/InputControl.svelte";
  import { compileCurrentFlow } from "../../utils/canvasUtils";
  import ExistingTableMenu from "./ExistingTableMenu.svelte";
  import MenuIcon from "./MenuIcon.svelte";
  import MetadataMenu from "./MetadataMenu.svelte";
  import NewElementsMenu from "./NewElementsMenu.svelte";
  import SaveLoadMenu from "./SaveLoadMenu.svelte";
  import CompileMenu from "./CompileMenu.svelte";

  export let flowName: string = "";

  let menuOpen: boolean = false;

  function handleMouseLeave() {
    menuOpen = false;
  }
</script>

<div class="menuToggleControl">
  <MenuIcon bind:menuOpen />
</div>
<div
  class={`menuBackdrop ${menuOpen ? "visible" : "hidden"}`}
  on:mouseleave={handleMouseLeave}
>
  <div class="menuContent">
    <InputControl type="text" label="Flow Name" bind:value={flowName} />
    <NewElementsMenu />
    <ExistingTableMenu />
    <SaveLoadMenu />
    <MetadataMenu />
    <CompileMenu />
  </div>
</div>

<style>
  .menuBackdrop {
    position: absolute;
    z-index: 1000;
    background: var(--pal-light);
    top: 0;
    height: 100vh;
    transition: 0.5s ease-in-out;
    width: min(250px, 60%);
    padding-top: calc(6 * var(--spacing));
    border-left: 2px solid var(--pal-text-soft);
  }
  .menuContent {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
    margin-left: calc(2 * var(--spacing));
    margin-right: calc(2 * var(--spacing));
  }
  .visible {
    right: 0;
  }
  .hidden {
    right: calc(calc(-1 * min(250px, 60%) - 2px));
    transition-delay: 1s;
  }
  .menuToggleControl {
    position: absolute;
    z-index: 9999;
    top: var(--spacing);
    right: var(--spacing);
  }
</style>
