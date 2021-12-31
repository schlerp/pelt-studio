<script lang="ts">
  import { capitalize } from "lodash";
  import { nanoid } from "nanoid/non-secure";

  console.debug("toggle");
  export let id: string = nanoid();
  export let value: boolean;
  export let name: string;
  export let tooltip: string = `${capitalize(name)}?`;
  export let displayChar: string = name[0].toUpperCase();

  $: console.log(value);
</script>

<div class="noGrow">
  <input
    id={`is${capitalize(name)}_${id}`}
    type="checkbox"
    name={name.replace(" ", "_")}
    bind:checked={value}
  />
  <label for={`is${capitalize(name)}_${id}`}>{displayChar}</label>
  <span class="tooltip">{tooltip}</span>
</div>

<style>
  .tooltip {
    position: absolute;
    display: none;
    left: calc(100% + var(--spacing));
    white-space: nowrap;
    background-color: var(--pal-text);
    color: var(--pal-light);
    z-index: 10;
    text-align: center;
    border-radius: var(--spacing);
    padding: var(--spacing);
    width: fit-content;
  }
  label {
    width: 1rem;
    text-align: center;
  }
  div {
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: calc(var(--spacing) / 2);
    position: relative;
  }
  div.noGrow:hover .tooltip {
    display: inline;
  }
  input {
    width: 100%;
    margin: calc(var(--spacing) / 2);
    border: none;
    outline: none;
  }
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"] + label {
    color: var(--pal-border-soft);
    border: 2px solid var(--pal-border-soft);
    border-radius: calc(var(--spacing) / 2);
    padding: calc(var(--spacing) / 2);
    font-weight: bold;
  }
  input:checked + label {
    color: var(--pal-primary);
    border: 2px solid var(--pal-border);
  }
  input:invalid {
    color: var(--pal-error);
  }
</style>
