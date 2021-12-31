<script lang="ts">
  import safeid from "../utils/safeid";
  import type { IInputType } from "../types";

  export let name: string = safeid();
  export let type: IInputType = "text";
  export let label: string = name;
  export let disabled: boolean = false;
  export let value: string | number | boolean;
  export let pattern: string = undefined;

  const groupId: string = `group_${name}`;
  const labelId: string = `label_${name}`;
  const controlId: string = `control_${name}`;
</script>

<div id={groupId}>
  <label id={labelId} for={controlId}>{label}</label>
  {#if type === "text" && typeof value === "string"}
    <input id={controlId} {name} type="text" bind:value {disabled} {pattern} />
  {:else if type === "password" && typeof value === "string"}
    <input
      id={controlId}
      {name}
      type="password"
      bind:value
      {disabled}
      {pattern}
    />
  {:else if type === "email" && typeof value === "string"}
    <input id={controlId} {name} type="email" bind:value {disabled} {pattern} />
  {:else if type === "number" && typeof value === "number"}
    <input
      id={controlId}
      {name}
      type="number"
      bind:value
      {disabled}
      {pattern}
    />
  {:else if type === "checkbox" && typeof value === "boolean"}
    <input
      id={controlId}
      {name}
      type="checkbox"
      bind:checked={value}
      {disabled}
      {pattern}
    />
  {/if}
</div>

<style>
  div {
    border: 2px solid var(--pal-border);
    border-radius: var(--spacing-small);
    position: relative;
    /* margin-top: var(--spacing); */
  }
  input {
    width: calc(100% - calc(2 * var(--spacing)));
    margin: var(--spacing-small);
    border: none;
    outline: none;
  }
  label {
    color: #444;
    position: absolute;
    transform: translate(calc(2 * var(--spacing)), calc(-1.5 * var(--spacing)));
    padding-left: calc(var(--spacing) / 2);
    padding-right: calc(var(--spacing) / 2);
    background-color: white;
  }
  input:invalid {
    color: var(--pal-error);
    border-bottom: 1px solid var(--pal-error);
  }
</style>
