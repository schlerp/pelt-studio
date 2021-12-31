<script lang="ts">
  import type { IColumnDefinition } from "../types";
  import ColumnControlToggle from "./ColumnControlToggle.svelte";

  export let columnDefinition: IColumnDefinition;
  export let disabled: boolean = false;
  export let id: string;

  let toggleDatatype: boolean = false;
</script>

<div class="wrapper">
  <div class="grow">
    {#if toggleDatatype === false}
      <label for={`name_${id}`} class="textLabel">Column: Name</label>
      <input
        id={`name_${id}`}
        type="text"
        name="name"
        bind:value={columnDefinition["name"]}
        pattern="[A-Za-z_]+[A-Za-z0-9_]*"
        {disabled}
      />
    {:else}
      <label for={`datatype_${id}`} class="textLabel">Column: Datatype</label>
      <input
        id={`datatype_${id}`}
        type="text"
        name="datatype"
        bind:value={columnDefinition["datatype"]}
        {disabled}
      />
    {/if}
  </div>
  <ColumnControlToggle
    bind:value={toggleDatatype}
    name="set datatype"
    tooltip="set datatype..."
    displayChar="D"
    {id}
  />
  <ColumnControlToggle
    bind:value={columnDefinition["primaryKey"]}
    name="primary key"
    {id}
  />
  <ColumnControlToggle
    bind:value={columnDefinition["nullable"]}
    name="nullable"
    {id}
  />
  <ColumnControlToggle
    bind:value={columnDefinition["unique"]}
    name="unique"
    {id}
  />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    border: 2px solid var(--pal-border);
    border-radius: var(--spacing-small);
    position: relative;
    padding-right: var(--spacing);
  }
  .grow {
    flex-grow: 1;
  }
  input {
    width: 100%;
    margin: var(--spacing-small);
    border: none;
    outline: none;
  }
  input[type="text"] {
    padding: var(--spacing);
  }
  label.textLabel {
    color: var(--pal-text);
    position: absolute;
    transform: translate(1em, -0.6em);
    padding-left: calc(var(--spacing) / 2);
    padding-right: calc(var(--spacing) / 2);
    background-color: #ffffff;
    overflow: hidden;
    max-width: 20ch;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  input:invalid {
    color: var(--pal-error);
  }
</style>
