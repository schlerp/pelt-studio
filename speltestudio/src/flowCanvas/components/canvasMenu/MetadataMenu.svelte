<script lang="ts">
  import { Resource } from "../../../services/client";
  import { tableSyncService } from "../../../services/tables";
  import ButtonControl from "../../controls/ButtonControl.svelte";

  export let apiUrl: string = "http://localhost:8321";
  const tableApi = Resource(apiUrl, "table");
  const serviceTs = tableSyncService(tableApi);
</script>

<h4>Metadata</h4>
<ButtonControl handleClick={serviceTs.updateClientTables}>
  Update Metadata...
</ButtonControl>

<style>
  h4 {
    text-align: center;
    margin-block: calc(2 * var(--spacing));
  }
</style>
