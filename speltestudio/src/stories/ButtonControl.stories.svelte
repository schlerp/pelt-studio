<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ButtonControl from "../flowCanvas/controls/ButtonControl.svelte";
  import Theme from "../Theme.svelte";
</script>

<Meta title="ButtonControl" component={ButtonControl} />

<Template let:args>
  <Theme />
  <ButtonControl {...args}>Click Me!</ButtonControl>
</Template>

<Story name="Primary" args={{ variant: "primary" }} />
<Story name="Secondary" args={{ variant: "secondary" }} />
<Story name="Warning" args={{ variant: "warning" }} />
<Story name="Danger" args={{ variant: "danger" }} />
<Story name="Transparent" args={{ variant: "transparent" }} />

<Story name="Primary Large" args={{ variant: "primary", fontSize: "large" }} />
<Story
  name="Secondary Large"
  args={{ variant: "secondary", fontSize: "large" }}
/>
<Story name="Warning Large" args={{ variant: "warning", fontSize: "large" }} />
<Story name="Danger Large" args={{ variant: "danger", fontSize: "large" }} />
<Story
  name="Transparent Large"
  args={{ variant: "transparent", fontSize: "large" }}
/>
