import KdButton from "../components/kd/KdButton.vue";

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: KdButton,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["large", "small"],
    },
  },
  args: {
    label: "Button",
    size: "",
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { KdButton },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    const { label } = args;
    return { args, label };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<kd-button v-bind="args">{{ label }}</kd-button>',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  type: "primary",
};

export const Large = Template.bind({});
Large.args = {
  size: "large"
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
};
