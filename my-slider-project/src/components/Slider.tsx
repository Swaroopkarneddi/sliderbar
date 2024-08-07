import React, { useState, useCallback, useEffect, useRef } from "react";
import "./Slider.scss";

export type SliderType = "continuous" | "discreet";
export type SliderSubtype = "single" | "range";
export type HandleSize = "Size_24" | "Size_32";
export type HandleType = "circle" | "circle-hover" | "circle-focus";

export interface SliderProps {
  type: SliderType;
  subtype: SliderSubtype;
  numberOfSteps?: number;
  handleSize: HandleSize;
  handleType: HandleType;
  onChange: (value: number | [number, number]) => void;
}

const Slider: React.FC<SliderProps> = ({
  type,
  subtype,
  numberOfSteps = 11,
  handleSize,
  handleType,
  onChange,
}) => {
  const [value, setValue] = useState<number | [number, number]>(
    subtype === "single" ? 0 : [0, 100]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [draggingHandle, setDraggingHandle] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset value when subtype changes
    setValue(subtype === "single" ? 0 : [0, 100]);
  }, [subtype]);

  const getSnappedValue = (value: number) => {
    if (type === "discreet") {
      const stepSize = 100 / (numberOfSteps - 1);
      return Math.round(value / stepSize) * stepSize;
    }
    return value;
  };

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
        let newValue =
          ((event.clientX - sliderRect.left) / sliderRect.width) * 100;
        newValue = Math.max(0, Math.min(100, newValue));
        const snappedValue = getSnappedValue(newValue);

        if (subtype === "single") {
          setValue(snappedValue);
          onChange(snappedValue);
        } else if (draggingHandle !== null) {
          const [min, max] = value as [number, number];
          if (draggingHandle === 0) {
            const newMin = Math.min(snappedValue, max);
            setValue([newMin, max]);
            onChange([newMin, max]);
          } else {
            const newMax = Math.max(snappedValue, min);
            setValue([min, newMax]);
            onChange([min, newMax]);
          }
        }
      }
    },
    [isDragging, onChange, subtype, value, draggingHandle, type, numberOfSteps]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const renderSteps = () => {
    if (type !== "discreet") return null;
    const stepSize = 100 / (numberOfSteps - 1);
    const steps = Array.from({ length: numberOfSteps }, (_, index) => (
      <div
        key={index}
        className="slider-step"
        style={{ left: `${index * stepSize}%` }}
      />
    ));
    return <div className="slider-steps">{steps}</div>;
  };

  const trackFillStyle = () => {
    if (subtype === "single") {
      return {
        width: `${value}%`,
      };
    } else if (subtype === "range" && Array.isArray(value)) {
      const [min, max] = value;
      return {
        width: `${max - min}%`,
        left: `${min}%`,
      };
    }
    return {};
  };

  return (
    <div
      className={`slider ${handleSize} ${isDragging ? "dragging" : ""}`}
      ref={sliderRef}
    >
      <div className="slider-track">
        <div className="slider-track-fill" style={trackFillStyle()} />
        {renderSteps()}
      </div>
      <div
        className={`slider-handle ${handleSize} ${handleType} ${
          isDragging ? "active" : ""
        }`}
        onMouseDown={() => handleMouseDown(0)}
        style={{
          left: `${Array.isArray(value) ? value[0] : value}%`,
        }}
        tabIndex={0}
        aria-label="Slider handle"
      />
      {subtype === "range" && (
        <div
          className={`slider-handle ${handleSize} ${handleType} ${
            isDragging ? "active" : ""
          }`}
          onMouseDown={() => handleMouseDown(1)}
          style={{
            left: `${(value as [number, number])[1]}%`,
          }}
          tabIndex={0}
          aria-label="Slider handle"
        />
      )}
      <div className="slider-value">
        Slider Value:{" "}
        {Array.isArray(value) ? `${value[0]} - ${value[1]}` : value}
      </div>
    </div>
  );
};

export default Slider;
