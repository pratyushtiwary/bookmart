import { TextField, InputAdornment } from "@mui/material";

export default function Input({
  label,
  placeholder,
  left,
  className,
  value,
  onChange,
}) {
  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{left}</InputAdornment>
        ),
      }}
      className={className}
    />
  );
}
