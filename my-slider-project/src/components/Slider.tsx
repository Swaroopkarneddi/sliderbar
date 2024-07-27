import React, { useState, useCallback, useEffect, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [draggingHandle, setDraggingHandle] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((handleIndex: number) => {
    setIsDragging(true);
    setDraggingHandle(handleIndex);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggingHandle(null);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging && sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const newValue =
          ((event.clientX - sliderRect.left) / sliderRect.width) * 100;
        const clampedValue = Math.max(0, Math.min(100, newValue));

        if (subtype === "single") {
          setValue(clampedValue);
          onChange(clampedValue);
        } else if (draggingHandle !== null) {
          const [min, max] = value as [number, number];
          if (draggingHandle === 0) {
            const newMin = Math.min(clampedValue, max);
            setValue([newMin, max]);
            onChange([newMin, max]);
          } else {
            const newMax = Math.max(clampedValue, min);
            setValue([min, newMax]);
            onChange([min, newMax]);
          }
        }
      }
    },
    [isDragging, onChange, subtype, value, draggingHandle]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`slider ${handleSize} ${isDragging ? "dragging" : ""}`}
      ref={sliderRef}
    >
      <div className="slider-track"></div>
      <div
        className={`slider-handle ${handleSize} ${isDragging ? "active" : "hover"}`}
        onMouseDown={() => handleMouseDown(0)}
        style={{
          left: `${Array.isArray(value) ? value[0] : value}%`,
        }}
      ></div>
      {subtype === "range" && (
        <div
          className={`slider-handle ${handleSize} ${isDragging ? "active" : "hover"}`}
          onMouseDown={() => handleMouseDown(1)}
          style={{
            left: `${(value as [number, number])[1]}%`,
          }}
        ></div>
      )}
      <div className="slider-value">
        Slider Value:{" "}
        {Array.isArray(value) ? `${value[0]} - ${value[1]}` : value}
      </div>
    </div>
  );
};

export default Slider;
