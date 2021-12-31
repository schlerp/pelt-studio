<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ColumnControlToggle from "../flowCanvas/controls/ColumnControlToggle.svelte";
  import Theme from "../Theme.svelte";
</script>

<Meta title="ColumnControlToggle" component={ColumnControlToggle} />

<Template let:args>
  <Theme />
  <div style="width: fit-content;">
    <ColumnControlToggle {...args} />
  </div>
</Template>

<Story name="Unchecked" args={{ value: false, name: "Some Control" }} />
<Story name="Checked" args={{ value: true, name: "Some Control" }} />
<Story
  name="Custom Display Character"
  args={{ value: true, name: "Some Control", displayChar: "B" }}
/>
<Story
  name="Custom Tooltip"
  args={{ value: true, name: "Some Control", tooltip: "Hello World!" }}
/>
