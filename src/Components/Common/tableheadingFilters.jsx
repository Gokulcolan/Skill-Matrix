import React, { useEffect, useState } from 'react'
import { CycleGamesExerciseData, DaysFilter, SafetyTrainingHead, SafetyTrainingValues } from '../../utils/constants/tableDatas';
import CommonDropdown from './commonDropDown';
import { Grid, Typography } from "@mui/material";
import SafetyTrainingTable from '../SafetyTraining/safetyTrainingTable';
import CycleTimeGamesTable from '../CycleGames/cycleTimeGamesTable';


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
    
    const [updatedCycleGamesValues, setUpdatedCycleGamesValues] = useState([]);

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
        if (CycleGames && CycleGames.length > 0) {
            const updatedValues = CycleGamesExerciseData.map((exerciseData) => {
                // Find matching game for this exercise, if exists
                const matchingGame = CycleGames.find(game => game.task_id === exerciseData.task_id) || {};
    
                // Create consistent attempts array with 5 entries
                const attempts = Array.from({ length: 5 }, (_, index) => {
                    const attempt = matchingGame.attempts ? 
                        (matchingGame.attempts[index] || {}) : 
                        {};
                    
                    return {
                        attempt_number: index + 1,
                        cycle_time: attempt.cycle_time || "",
                        mistakes: attempt.mistakes || "",
                        pf_status: attempt.pf_status || "",
                    };
                });
    
                return {
                    task_id: exerciseData.task_id,
                    dct: exerciseData.dct,
                    name: exerciseData.name,
                    sign: {
                        Signature_by_Process_Coach: matchingGame.sign?.Signature_by_Process_Coach || "",
                        Signature_by_Trainee: matchingGame.sign?.Signature_by_Trainee || "",
                        Signature_by_Training_Officer: matchingGame.sign?.Signature_by_Training_Officer || "",
                    },
                    attempts: attempts,
                    status_: matchingGame.status_ || "",
                };
            });
    
            setUpdatedCycleGamesValues(updatedValues);
        } else {
            // If no data, create a default set of 5 exercises with empty data
            const defaultValues = CycleGamesExerciseData.map((exerciseData) => ({
                task_id: exerciseData.task_id,
                dct: exerciseData.dct,
                name: exerciseData.name,
                sign: {
                    Signature_by_Process_Coach: "",
                    Signature_by_Trainee: "",
                    Signature_by_Training_Officer: "",
                },
                attempts: Array.from({ length: 5 }, (_, index) => ({
                    attempt_number: index + 1,
                    cycle_time: "",
                    mistakes: "",
                    pf_status: "",
                })),
                status_: "",
            }));
    
            setUpdatedCycleGamesValues(defaultValues);
        }
    }, [CycleGames]);
    

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