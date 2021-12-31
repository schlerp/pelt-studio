<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import InputControl from "../flowCanvas/controls/InputControl.svelte";
  import Theme from "../Theme.svelte";
</script>

<Meta title="InputControl" component={InputControl} />

<Template let:args>
  <Theme />
  <InputControl value="some string" {...args} />
</Template>

<Story name="Text" args={{ type: "text", name: "Some Control" }} />
<Story
  name="Disabled"
  args={{ type: "text", disabled: true, name: "Some Disabled Control" }}
/>
<Story
  name="Input Validation"
  args={{
    type: "text",
    name: "Some Control with Validation",
    pattern: "[A-Za-z_]+[A-Za-z0-9_]*",
    value: "no spaces, cant start with number",
  }}
/>
