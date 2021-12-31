<script lang="ts">
  import ButtonControl from "../../controls/ButtonControl.svelte";
  import { compileCurrentFlow } from "../../utils/canvasUtils";
</script>

<h4>Current Flow Options</h4>
<ButtonControl handleClick={(e) => compileCurrentFlow()}>
  Compile Flow
</ButtonControl>

<style>
  h4 {
    text-align: center;
    margin-block: calc(2 * var(--spacing));
  }
</style>
