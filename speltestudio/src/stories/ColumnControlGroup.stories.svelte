<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ColumnControlGroup from "../flowCanvas/controls/ColumnControlGroup.svelte";
  import Theme from "../Theme.svelte";
</script>

<Meta title="ColumnControlGroup" component={ColumnControlGroup} />

<Template let:args>
  <Theme />
  <ColumnControlGroup {...args} />
</Template>

<Story
  name="Regular"
  args={{
    columnDefinition: {
      id: "xyz",
      name: "column_1",
      datatype: "NVARCHAR(32)",
      primaryKey: true,
      nullable: false,
      unique: false,
      materialised: true,
    },
  }}
/>

<Story
  name="Nullable"
  args={{
    columnDefinition: {
      id: "xyz",
      name: "column_1",
      datatype: "NVARCHAR(32)",
      primaryKey: false,
      nullable: true,
      unique: false,
      materialised: false,
    },
  }}
/>

<Story
  name="Unique"
  args={{
    columnDefinition: {
      id: "xyz",
      name: "column_1",
      datatype: "NVARCHAR(32)",
      primaryKey: false,
      nullable: false,
      unique: true,
      materialised: false,
    },
  }}
/>
