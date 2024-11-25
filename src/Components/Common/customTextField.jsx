import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  customStyles = {},
  disabled,
  placeholder,
  required,
  fullWidth = true,
  margin = "normal",
  type = "text",
  autoComplete,
  autoFocus = false,
  variant = "outlined",
  inputProps = {},
 
  ...props
}) => {
  return (
    <TextField
      variant={variant}
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      id={id || name}
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={Boolean(error)}
      helperText={helperText}
      placeholder={placeholder}
      disabled={disabled}
      InputProps={inputProps}
      style={{ ...customStyles }}
      {...props}
    />
  );
};

export default CustomTextField;
