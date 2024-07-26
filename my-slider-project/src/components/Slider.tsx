// src/components/Slider.tsx
import React, { useState } from "react";
import "./Slider.scss";

export type SliderType = "continuous" | "discreet";
export type SliderSubtype = "single" | "range";
export type HandleSize = "Size_24" | "Size_32";

export interface SliderProps {
  type: SliderType;
  subtype: SliderSubtype;
  numberOfSteps?: number;
  handleSize: HandleSize;
  onChange: (value: number | [number, number]) => void;
}

const Slider: React.FC<SliderProps> = ({
  type,
  subtype,
  numberOfSteps,
  handleSize,
  onChange,
}) => {
  const [value, setValue] = useState<number | [number, number]>(
    subtype === "single" ? 0 : [0, 10]
  );

  const handleChange = (newValue: number | [number, number]) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={`slider ${handleSize}`}>
      {/* Render slider based on type and subtype */}
      {/* Add hover and active states for handles */}
      {/* Add logic for discrete steps if type is 'discreet' */}
    </div>
  );
};

export default Slider;
