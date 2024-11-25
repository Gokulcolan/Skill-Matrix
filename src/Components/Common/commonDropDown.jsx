import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

const CommonDropdown = ({
    label,
    options = [],
    value,
    onChange,
    id = "common-dropdown",
    fullWidth = true,
    ...props
}) => {
    return (
        <Box >
            <FormControl sx={{ minWidth: 200, float: "right" }}  {...props}>
                <InputLabel id={`${id}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${id}-label`}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    label={label}
                >
                    {options.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>

    );
};

export default CommonDropdown;
