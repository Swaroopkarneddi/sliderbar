// src/stories/Slider.stories.tsx
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Slider, { SliderProps } from "../components/Slider";

export default {
  title: "Components/Slider",
  component: Slider,
  argTypes: {
    type: {
      control: "radio",
      options: ["continuous", "discreet"],
    },
    subtype: {
      control: "radio",
      options: ["single", "range"],
    },
    numberOfSteps: {
      control: {
        type: "number",
        min: 1,
        max: 10,
      },
      if: { arg: "type", eq: "discreet" },
    },
    handleSize: {
      control: "radio",
      options: ["Size_24", "Size_32"],
    },
    onChange: { action: "changed" },
  },
} as Meta<typeof Slider>;

const Template: StoryFn<SliderProps> = (args: SliderProps) => (
  <Slider {...args} />
);

export const Default = Template.bind({});
Default.args = {
  type: "continuous",
  subtype: "single",
  handleSize: "Size_24",
};
