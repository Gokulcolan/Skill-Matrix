import React, { useState } from 'react'
import { DaysFilter, SafetyTrainingHead, SafetyTrainingValues } from '../../utils/constants/tableHead';
import CommonDropdown from './commonDropDown';
import { Grid, Typography } from "@mui/material";
import SafetyTrainingTable from './safetyTrainingTable';
import CycleTimeGamesTable from './cycleTimeGamesTable';

const TableFilters = () => {

    const [selectedValue, setSelectedValue] = useState(10);
    console.log(selectedValue, "selectedValue")

    const handleDropdownChange = (value) => {
        setSelectedValue(value);
    };

    const title = selectedValue === 10
        ? "1a - Performance During Basic & Safety Training"
        : selectedValue === 20
            ? "1b - Cycle Time Games"
            : selectedValue === 30
                ? "2 - JI Memory Test"
                : "Cycle Time Achievement";

    const place = selectedValue === 10
        ? "Place: Training Center"
        : selectedValue === 20
            ? "Place: Process Coach"
            : selectedValue === 30
                ? "Place: Line Caption / Team Leader"
                : "Place: Line Caption";

    const owner = selectedValue === 40
        ? "Owner: Module Controller"
        : "Owner: Training Officer";

    const table = selectedValue === 10 ? <SafetyTrainingTable columns={SafetyTrainingHead} data={SafetyTrainingValues} /> : <CycleTimeGamesTable />

    return (
        <>
            <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h6" color="black" sx={{ fontWeight: "600" }}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body1">{place}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body1">{owner}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body1">Date:</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <CommonDropdown
                            label="Target Completion"
                            options={DaysFilter}
                            value={selectedValue}
                            onChange={handleDropdownChange}
                        />
                    </Grid>
                </Grid>
            </div>
            <div>
                {table}
            </div>
        </>
    )
}

export default TableFilters