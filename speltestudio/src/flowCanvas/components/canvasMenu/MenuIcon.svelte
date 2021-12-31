<script lang="ts">
  export let menuOpen: boolean = false;

  function toggleMenuOpen() {
    menuOpen = !menuOpen;
  }
</script>

<div
  on:click={(e) => {
    toggleMenuOpen();
  }}
>
  {#if menuOpen}
    <svg viewBox="0 0 23 23">
      <path d="M 3 16.5 L 17 2.5" />
      <path d="M 3 2.5 L 17 16.346" />
    </svg>
  {:else}
    <svg viewBox="0 0 23 23">
      <path d="M 2 2.5 L 20 2.5" />
      <path d="M 2 9.423 L 20 9.423" />
      <path d="M 2 16.346 L 20 16.346" />
    </svg>
  {/if}
</div>

<style>
  svg {
    stroke: black;
    stroke-width: 3px;
    width: calc(4 * var(--spacing));
    height: calc(4 * var(--spacing));
  }
</style>
