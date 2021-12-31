<script lang="ts">
  import type { ITableDefinition } from "../../types";
  import { tableStore } from "../../../store";
  import DragInit from "../DragInit.svelte";

  let tables: ITableDefinition[];

  tableStore.subscribe((value: ITableDefinition[]) => {
    tables = value;
  });
</script>

{#if tables.length > 0}
  <h4>Existing Tables</h4>
  {#each tables as table}
    <DragInit {table} />
  {/each}
{/if}

<style>
  h4 {
    text-align: center;
    margin-block: calc(2 * var(--spacing));
  }
</style>
