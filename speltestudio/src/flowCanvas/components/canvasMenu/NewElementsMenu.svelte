<script lang="ts">
  import ButtonControl from "../../controls/ButtonControl.svelte";
  import { addTable, addTransform } from "../../utils/canvasUtils";
</script>

<h4>New Tables</h4>
<ButtonControl handleClick={addTable}>add Table</ButtonControl>
<ButtonControl handleClick={addTransform}>add Transform</ButtonControl>

<style>
  h4 {
    text-align: center;
    margin-block: calc(2 * var(--spacing));
  }
</style>
