import { TextField, MenuItem, TextFieldProps } from "@mui/material";
import React from "react";

interface CustomFieldsProps extends Omit<TextFieldProps, 'variant'> {
  fieldType?: "text" | "password" | "textarea" | "dropdown" | "number";
  options?: { value: string | number; label: string }[];
  label?: string;
  helperText: string | undefined;
  error: boolean | undefined;
}

const CustomFields: React.FC<CustomFieldsProps> = ({
  fieldType = "text",
  options = [],
  helperText,
  error,
  ...props
}) => {
  if (fieldType === "textarea") {
    return (
      <TextField
        {...props}
        multiline
        rows={4}
        variant="outlined"
        error={Boolean(error)}
        helperText={error ? helperText : ''}
      />
    );
  }

  if (fieldType === "dropdown") {
    return (
      <TextField
        {...props}
        select
        variant="outlined"
        error={Boolean(error)}
        helperText={error ? helperText : ''}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      {...props}
      type={fieldType}
      variant="outlined"
      error={Boolean(error)}
      helperText={error ? helperText : ''}
    />
  );
};

export default CustomFields;
