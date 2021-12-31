<script lang="ts">
  import { onMount } from "svelte";
  import { EVENT_DRAG_MOVE } from "@jsplumb/browser-ui";
  import type { SvelteComponent } from "svelte/internal";
  import { jsPlumbInstanceStore } from "../canvasStore";

  export let id: string;
  export let top: number;
  export let left: number;
  export let title: string = undefined;
  export let content: string = undefined;
  export let footer: string = undefined;
  export let form: SvelteComponent = undefined;
  export let formContext: Object = undefined;

  let element: HTMLDivElement;

  onMount(() => {
    $jsPlumbInstanceStore.manage(element);
    $jsPlumbInstanceStore.setDraggable(element, true);
    $jsPlumbInstanceStore.bind(EVENT_DRAG_MOVE, updateCoords);
    element.style.setProperty("top", `${top || 0}px`);
    element.style.setProperty("left", `${left || 0}px`);
  });

  function updateCoords(event: DragEvent) {
    if (element !== undefined) {
      left = parseInt(element.style.getPropertyValue("left"));
      top = parseInt(element.style.getPropertyValue("top"));
    }
  }
</script>

<div {id} class="draggableWrapper" bind:this={element}>
  {#if title !== undefined}
    <header>
      {title}
      <slot name="header" />
    </header>
  {/if}
  <section>
    <slot name="content" />
    {#if content !== undefined}
      {content}
    {/if}
    {#if form !== undefined}
      <svelte:component this={form} bind:formContext />
    {/if}
  </section>
  {#if footer !== undefined || $$slots.footer}
    <footer>
      <slot name="footer" />
      {#if footer !== undefined}
        {footer}
      {/if}
    </footer>
  {/if}
</div>

<style>
  .draggableWrapper {
    position: absolute;
    background-color: white;
    box-shadow: var(--spacing-small) var(--spacing-small) var(--spacing-small)
      var(--pal-shadow);
    width: 350px;
    user-select: none;
    margin: var(--spacing);
    border-radius: var(--spacing);
    border: 2px solid var(--pal-border-hard);
  }
  header {
    padding: var(--spacing);
    text-align: center;
    border-bottom: 2px solid var(--pal-border-soft);
    font-size: 1.5rem;
  }
  section {
    padding: var(--spacing);
  }
  footer {
    color: var(--pal-text-soft);
    border-top: 2px solid var(--pal-border-soft);
    text-align: right;
    padding: var(--spacing);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--spacing);
  }
</style>
