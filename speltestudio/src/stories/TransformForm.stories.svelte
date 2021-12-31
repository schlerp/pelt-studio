<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import TransformForm from "../flowCanvas/components/TransformForm.svelte";
  import Theme from "../Theme.svelte";

  let args = {
    formContext: {
      transform: "{col}",
      filter: "1=1",
    },
  };
  Template.bind(args);
</script>

<Meta title="TransformForm" component={TransformForm} />

<Template bind:args>
  <Theme />
  <TransformForm {...args} bind:formContext={args.formContext} />
</Template>

<Story name="Default" />
