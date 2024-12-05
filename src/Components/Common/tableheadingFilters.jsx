import React, { useEffect, useState } from 'react'
import { CycleGamesExerciseData, DaysFilter, SafetyTrainingHead, SafetyTrainingValues } from '../../utils/constants/tableHead';
import CommonDropdown from './commonDropDown';
import { Grid, Typography } from "@mui/material";
import SafetyTrainingTable from './safetyTrainingTable';
import CycleTimeGamesTable from './cycleTimeGamesTable';

const TableFilters = ({ employeeTrainingDetails }) => {

    const TrainingDetails = employeeTrainingDetails?.Safety_training;

    const CycleGames = employeeTrainingDetails?.Cycle_games;

    console.log(CycleGames, "CycleGames")

    const cc = employeeTrainingDetails?.cc_no

    const [selectedValue, setSelectedValue] = useState(10);

    const [updatedSafetyTrainingValues, setUpdatedSafetyTrainingValues] = useState(
        () =>
            (SafetyTrainingValues || []).map(row => ({
                ...row,
                actual_score: "",
                status_: "",
                sign_by_trainee: "",
                sign_by_training_officer: "",
                Remarks: "",
            }))
    );


    const [updatedCycleGamesValues, setUpdatedCycleGamesValues] = useState(
        () =>
            (CycleGamesExerciseData || []).map(row => ({
                ...row,
                Signature_by_Process_Coach: "",
                Signature_by_Trainee: "",
                Signature_by_Training_Officer: "",
                attempt_number: "",
                attempts_id: "",
                cc_no: "",
                cycle_time: "",
                mistakes: "",
                pf_status: "",
                status_: "",
            }))
    );

    console.log(updatedCycleGamesValues, "updatedCycleGamesValues")

    useEffect(() => {
        if (TrainingDetails) {
            const updatedValues = SafetyTrainingValues.map(row => {
                const matchingDetail = TrainingDetails.find(
                    detail => detail.topics === row.topic
                );
                return {
                    ...row,
                    actual_score: matchingDetail?.actual_score || "",
                    status_: matchingDetail?.status_ || "",
                    sign_by_trainee: matchingDetail?.sign_by_trainee || "",
                    sign_by_training_officer: matchingDetail?.sign_by_training_officer || "",
                    Remarks: matchingDetail?.Remarks || "",
                };
            });
            setUpdatedSafetyTrainingValues(updatedValues);
        }
    }, [TrainingDetails, SafetyTrainingValues]);

    useEffect(() => {
        if (!CycleGames || !CycleGamesExerciseData || CycleGames.length === 0 || CycleGamesExerciseData.length === 0) {
            console.log("Data not loaded yet.");
            return; // Exit early if data is not ready
        }

        const updatedValues = CycleGamesExerciseData.map((row) => {
            // Make sure task_id from both arrays are compared as strings
            const matchingDetail = CycleGames.find(
                (detail) => String(detail.task_id) === String(row.task_id)
            );

            return {
                ...row,
                Signature_by_Process_Coach: matchingDetail?.Signature_by_Process_Coach || "",
                Signature_by_Trainee: matchingDetail?.Signature_by_Trainee || "",
                Signature_by_Training_Officer: matchingDetail?.Signature_by_Training_Officer || "",
                attempt_number: matchingDetail?.attempt_number || "",
                attempts_id: matchingDetail?.attempts_id || "",
                cc_no: matchingDetail?.cc_no || "",
                cycle_time: matchingDetail?.cycle_time || "",
                mistakes: matchingDetail?.mistakes || "",
                pf_status: matchingDetail?.pf_status || "",
                status_: matchingDetail?.status_ || "",
            };
        });

        console.log("Updated Values:", updatedValues);
        setUpdatedCycleGamesValues(updatedValues);
    }, [CycleGames, CycleGamesExerciseData]);


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

    const table = selectedValue === 10 ? <SafetyTrainingTable columns={SafetyTrainingHead} data={updatedSafetyTrainingValues} cc={cc} /> : <CycleTimeGamesTable data={updatedCycleGamesValues} cc={cc} />

    return (
        <>
            <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h6" color="black" sx={{ fontWeight: "600" }}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">{place}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">{owner}</Typography>
                    </Grid>
                    {/* <Grid item xs={2}>
                        <Typography variant="body1">Date:</Typography>
                    </Grid> */}
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