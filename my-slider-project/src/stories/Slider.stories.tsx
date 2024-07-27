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
    handleType: {
      control: "radio",
      options: ["circle", "circle-hover", "circle-focus"], // Ensure these match HandleType
    },
    onChange: { action: "changed" },
  },
  parameters: {
    controls: {
      include: ["type", "subtype", "numberOfSteps", "handleSize", "handleType"],
    },
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
  handleType: "circle",
};

export const Discreet = Template.bind({});
Discreet.args = {
  type: "discreet",
  subtype: "single",
  numberOfSteps: 11,
  handleSize: "Size_24",
  handleType: "circle",
};

export const Range = Template.bind({});
Range.args = {
  type: "continuous",
  subtype: "range",
  handleSize: "Size_24",
  handleType: "circle",
};
