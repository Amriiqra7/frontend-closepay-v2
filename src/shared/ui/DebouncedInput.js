import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export default function DebouncedInput({
  value: initialValue,
  onFilterChange,
  debounce = 500,
  size,
  width,
  fullWidth,
  startAdornment = "",
  ...props
}) {
  const [value, setValue] = useState(initialValue || "");
  const isInitialMount = useRef(true);
  const previousInitialValueRef = useRef(initialValue || "");
  const lastEmittedValueRef = useRef(initialValue || "");

  const handleInputChange = (event) => setValue(event.target.value);

  const handleClear = () => {
    setValue("");
    lastEmittedValueRef.current = "";
    onFilterChange("");
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      if (value !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = value;
        onFilterChange(value);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onFilterChange]);

  useEffect(() => {
    const nextValue = initialValue || "";
    if (previousInitialValueRef.current === nextValue) return;

    previousInitialValueRef.current = nextValue;
    const timeout = setTimeout(() => {
      setValue(nextValue);
      lastEmittedValueRef.current = nextValue;
    }, 0);

    return () => clearTimeout(timeout);
  }, [initialValue]);

  const widthStyles = fullWidth
    ? { width: "100%" }
    : { minWidth: width || 100, width: width || "auto" };

  return (
    <OutlinedInput
      {...props}
      value={value}
      onChange={handleInputChange}
      fullWidth={fullWidth}
      inputProps={{
        "aria-label": "Search Input",
        "data-testid": "debounced-search-input",
        ...props.inputProps,
      }}
      sx={{
        ...widthStyles,
        ...props.sx,
      }}
      {...(startAdornment && { startAdornment })}
      {...(size && { size })}
      endAdornment={
        value ? (
          <IconButton
            aria-label="clear search"
            data-testid="debounced-clear-btn"
            onClick={handleClear}
            edge="end"
            size="small"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ) : null
      }
    />
  );
}

DebouncedInput.propTypes = {
  value: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  debounce: PropTypes.number,
  size: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fullWidth: PropTypes.bool,
  startAdornment: PropTypes.node,
};
