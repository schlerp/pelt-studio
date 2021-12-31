<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import TableForm from "../flowCanvas/components/TableForm.svelte";
  import Theme from "../Theme.svelte";

  let args = {
    formContext: {
      name: "derp",
      schema: "",
      database: "",
      columns: [],
      materialised: false,
    },
  };
  Template.bind(args);
</script>

<Meta title="TableForm" component={TableForm} />

<Template bind:args>
  <Theme />
  <TableForm {...args} bind:formContext={args.formContext} />
</Template>

<Story name="Default" />
