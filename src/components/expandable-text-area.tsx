"use client";

import React, { useEffect, useRef } from "react";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export function ExpandableTextArea({
  maxRows,
  className,
  value,
  onValueChange,
  ...props
}: TextAreaProps & {
  maxRows?: number;
  value?: string;
  onValueChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [singleRowHeight, setSingleRowHeight] = React.useState<number>(0);

  useEffect(() => {
    const mirror = mirrorRef.current;
    if (mirror && !singleRowHeight) {
      mirror.textContent = "A";
      setSingleRowHeight(mirror.clientHeight);
    }
  }, [singleRowHeight]);

  useEffect(() => {
    const current = ref.current;
    const mirror = mirrorRef.current;

    if (current && mirror) {
      mirror.style.width = `${current.clientWidth}px`;
      mirror.textContent = current.value + "\n";

      let height = mirror.clientHeight;

      if (maxRows) {
        const visualRows = Math.ceil(height / singleRowHeight);
        if (visualRows > maxRows) {
          height = singleRowHeight * maxRows;
        }
      }

      current.style.height = `${height}px`;
    }
  }, [ref, mirrorRef, value, maxRows, singleRowHeight]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(event.target?.value);
  };

  //
  return (
    <div className="relative">
      <div
        ref={mirrorRef}
        className="overflow-wrap pointer-events-none absolute -left-[9999px] -top-[9999px] whitespace-pre-wrap break-words text-transparent"
      ></div>
      <textarea
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
        className={className + " block"}
      ></textarea>
    </div>
  );
}
