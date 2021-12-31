<script lang="ts">
  import { Resource } from "../../../services/client";
  import { flowSyncService } from "../../../services/flows";
  import ButtonControl from "../../controls/ButtonControl.svelte";
  import type { IFlowDefinition } from "../../types";

  export let apiUrl: string = "http://localhost:8321";
  const api = Resource(apiUrl, "flow");
  const flowService = flowSyncService(api);

  let currentFlow: IFlowDefinition;
</script>

<h4>Save Flow</h4>
<ButtonControl
  handleClick={() => {
    flowService.saveFlow();
  }}>Save</ButtonControl
>

<style>
  h4 {
    text-align: center;
    margin-block: calc(2 * var(--spacing));
  }
</style>
