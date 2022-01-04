<script lang="ts">
  import type { SvelteComponent } from "svelte/internal";
  import Draggable from "./components/Draggable.svelte";
  import type { INode } from "./types";

  export let id: string;
  export let top: number;
  export let left: number;
  export let title: string = undefined;
  export let content: string = undefined;
  export let footer: string = undefined;
  export let form: SvelteComponent = undefined;
  export let formContext: INode = undefined;
</script>

<Draggable
  {id}
  {title}
  {content}
  {footer}
  {form}
  bind:top
  bind:left
  bind:formContext
>
  <slot name="footer" slot="footer" />
</Draggable>
