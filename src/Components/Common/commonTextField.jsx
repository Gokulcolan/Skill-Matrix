import React from 'react';
import { TextField } from '@mui/material';
import { useFormikContext } from 'formik';

const FormikTextField = ({
  id,
  name,
  label,
  customStyles,
  disabled,
  placeholder,
  required,
  fullWidth = true,
  margin = 'normal',
  type = 'text',
  autoComplete,
  autoFocus = false,
  variant = 'outlined',
  inputProps = {},
  ...props
}) => {
  const formik = useFormikContext();
  return (
    <TextField
      variant={variant}
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      id={name}
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      value={formik?.values[name] || ''}
      onChange={formik?.handleChange}
      onBlur={formik?.handleBlur}
      error={formik?.touched?.[name] && Boolean(formik?.errors?.[name])}
      helperText={formik?.touched?.[name] && formik?.errors?.[name]}      
      {...props}
    />
  );
};

export default FormikTextField;
