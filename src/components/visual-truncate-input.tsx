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
  id,
  name,
  startTrunc,
  endTrunc,
  value,
  onChange,
  type,
  className,
  defaultValue,
  placeholder,
  ...props
}: Omit<InputProps, "onChange"> & {
  startTrunc: number;
  endTrunc: number;
  onChange?: (value: string) => void;
}) => {
  const [managedValue, setManagedValue] = useState(
    String(defaultValue ?? value ?? ""),
  );
  const [visibleValue, setVisibleValue] = useState(
    truncateString(managedValue, startTrunc, endTrunc),
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setManagedValue(value);
      setVisibleValue(value);
      onChange?.(value);
    },
    [setManagedValue, setVisibleValue, onChange],
  );

  const handleFocus = useCallback(() => {
    setVisibleValue(managedValue);
  }, [setVisibleValue, managedValue]);

  const handleBlur = useCallback(() => {
    setVisibleValue(truncateString(managedValue, startTrunc, endTrunc));
  }, [setVisibleValue, managedValue, startTrunc, endTrunc]);

  const fallbackOnChange = useCallback(() => {
    onChange?.(managedValue);
  }, [onChange, managedValue]);

  return (
    <>
      <input
        id={`${id}-visual-truncate`}
        name={`${name}-visual-truncate`}
        type={type}
        value={visibleValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
      />
      <input
        id={id}
        name={name}
        type={type}
        value={managedValue}
        onChange={fallbackOnChange}
        className="hidden"
        {...props}
      />
    </>
  );
};
