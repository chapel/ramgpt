import React, { useCallback, useState } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const truncateString = (str: string, startTrunc: number, endTrunc: number) => {
  if (str.length < startTrunc + endTrunc) {
    return str;
  }
  return `${str.slice(0, startTrunc)}...${str.slice(-endTrunc)}`;
};

export const VisualTruncateInput = ({
  startTrunc,
  endTrunc,
  value,
  onChange,
  ...props
}: InputProps & { startTrunc: number; endTrunc: number }) => {
  const [managedValue, setManagedValue] = useState(String(value ?? ""));
  const [visibleValue, setVisibleValue] = useState(
    truncateString(managedValue, startTrunc, endTrunc),
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setManagedValue(value);
      setVisibleValue(value);
      onChange?.(e);
    },
    [setManagedValue, onChange],
  );

  const handleFocus = useCallback(() => {
    setVisibleValue(managedValue);
  }, [setVisibleValue, managedValue]);

  const handleBlur = useCallback(() => {
    setVisibleValue(truncateString(managedValue, startTrunc, endTrunc));
  }, [setVisibleValue, managedValue, startTrunc, endTrunc]);

  return (
    <input
      value={visibleValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};
