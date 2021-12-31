<script lang="ts">
  import { onMount } from "svelte";

  export let variant:
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | "transparent" = "primary";
  export let fontSize: "regular" | "large" = "regular";
  export let handleClick: svelte.JSX.MouseEventHandler<
    HTMLButtonElement
  > = () => {};
</script>

<button
  class={`${variant} ${fontSize === "large" ? "text-large" : "text-regular"}`}
  on:click|preventDefault={handleClick}
>
  <slot />
</button>

<style>
  button {
    color: var(--pal-text-light);
    border-radius: var(--spacing-small);
    padding: var(--spacing);
    text-align: center;
  }
  .text-large {
    font-size: 1.25rem;
  }
  .text-regular {
    font-size: 1rem;
  }
  .primary {
    background-color: var(--pal-primary);
  }
  .secondary {
    background-color: var(--pal-secondary);
  }
  .warning {
    background-color: var(--pal-warning);
  }
  .danger {
    background-color: var(--pal-error);
  }
  .transparent {
    background-color: #ffffffff;
    color: var(--pal-text);
  }
  .transparent:hover {
    background-color: #efefef;
  }
</style>
