<script lang="ts">
  import type { ITableDefinition } from "../types";

  export let table: ITableDefinition;

  function dragStart(event: DragEvent, table: ITableDefinition) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", table.id);
  }
</script>

<div
  draggable={true}
  on:dragstart={(event) => {
    dragStart(event, table);
  }}
>
  {table.name}
</div>

<style>
  div {
    background-color: var(--pal-secondary);
    padding: var(--spacing);
    border-radius: var(--spacing-small);
    text-align: center;
    color: var(--pal-text-light);
    cursor: move;
    border: 2px solid var(--pal-border-hard);
  }
</style>
