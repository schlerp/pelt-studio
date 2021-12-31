<script lang="ts">
  import safeid from "../utils/safeid";
  import InputControl from "../controls/InputControl.svelte";
  import Connectable from "./Connectable.svelte";
  import type { IColumnDefinition, ITableDefinition } from "../types";
  import ColumnControlGroup from "../controls/ColumnControlGroup.svelte";
  import ButtonControl from "../controls/ButtonControl.svelte";
  import cleanTableDefinition from "../utils/cleanTableDefinition";

  export let formContext: ITableDefinition;

  if (formContext !== undefined) {
    formContext = cleanTableDefinition(formContext);
  }

  function handleAddColumn(event: MouseEvent) {
    const id: string = safeid();
    const name: string = `col_${id}`;
    const columnDefinition: IColumnDefinition = {
      id,
      name,
      primaryKey: false,
      nullable: false,
      unique: false,
      datatype: "VARCHAR",
      materialised: false,
    };
    // for svelte auto update
    formContext.columns = [...formContext.columns, columnDefinition];
  }
</script>

<form>
  <InputControl
    name="table"
    type="text"
    label="Name"
    bind:value={formContext.name}
  />
  <InputControl
    name="schema"
    type="text"
    label="Schema"
    bind:value={formContext.schema}
  />
  <InputControl
    name="database"
    type="text"
    label="Database"
    bind:value={formContext.database}
  />
  {#each formContext.columns as column, idx}
    <Connectable id={`col_${column.id}`}>
      <ColumnControlGroup
        bind:columnDefinition={formContext.columns[idx]}
        id={column.id}
      />
    </Connectable>
  {/each}
  <ButtonControl fontSize="large" handleClick={handleAddColumn}
    >Add Column</ButtonControl
  >
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--spacing));
    padding: var(--spacing);
  }
</style>
