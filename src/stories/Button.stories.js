import KdButton from "../components/kd/KdButton.vue";

export default {
  title: "Kd/Button",
  component: KdButton,
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["large", "medium", "small", "small", "mini"],
    },
    type: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", "text"],
    },
  },
  args: {
    text: "Button",
    size: "large",
    type: "primary",
    plain: false,
    round: false,
    circle: false,
  },
};

const Template = (args) => ({
  components: { KdButton },
  setup() {
    return { args };
  },
  template: '<kd-button v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {};
