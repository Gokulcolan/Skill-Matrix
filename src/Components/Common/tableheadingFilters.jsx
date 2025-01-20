import React, { useEffect, useState } from 'react'
import { CycleGamesExerciseData, CycleTimeAchievement, DaysFilter, MemoryTestData, SafetyTrainingHead, SafetyTrainingValues } from '../../utils/constants/tableDatas';
import CommonDropdown from './commonDropDown';
import { Grid, Typography } from "@mui/material";
import SafetyTrainingTable from '../SafetyTraining/safetyTrainingTable';
import CycleTimeGamesTable from '../CycleGames/cycleTimeGamesTable';
import CommonDatePicker from './datePicker';
import MemoryFirst from '../MemoryTest/FirstOff/MemoryFirst';
import MemorySecond from '../MemoryTest/SecondOff/MemorySecond';
import dayjs from 'dayjs';
import CustomTextField from './customTextField';


const TableFilters = ({ employeeTrainingDetails }) => {

    const TrainingDetails = employeeTrainingDetails?.Safety_training;
    const CycleGames = employeeTrainingDetails?.Cycle_games;
    const MemoryTest = employeeTrainingDetails?.memory_games;
    const CycleAchievement = employeeTrainingDetails?.Cycle_time_achievement;

    const cc = employeeTrainingDetails?.cc_no

    const [selectedValue, setSelectedValue] = useState(10);
    const [selectedDate, setSelectedDate] = useState(); // State to hold the selected date
    const [safetyDate, setSafetyDate] = useState(); // State to hold the selected date
    const [cycleGamesDate, setCycleGamesDate] = useState(); // State to hold the selected date
    const [memoryTestDate, setMemoryTestDate] = useState(); // State to hold the selected date
    const [cycleAchievementDate, setCycleAchievementDate] = useState(); // State to hold the selected date
    const [selectedPlace, setSelectedPlace] = useState(); // State to hold the selected date
    const [safetyPlace, setSafetyPlace] = useState(); // State to hold the selected date
    const [cycleGamesPlace, setCycleGamesPlace] = useState(); // State to hold the selected date
    const [memoryTestPlace, setMemoryTestPlace] = useState(); // State to hold the selected date
    const [cycleAchievementPlace, setCycleAchievementPlace] = useState(); // State to hold the selected date

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
    const [updatedMemoryTestValues, setUpdatedMemoryTestValues] = useState([]);
    const [updatedCycleAchievementValues, setUpdatedCycleAchievementValues] = useState([]);
    console.log(updatedCycleAchievementValues,"updatedCycleAchievementValues")

    useEffect(() => {
        if (Array.isArray(TrainingDetails)) { // Ensure TrainingDetails is an array
            const updatedValues = SafetyTrainingValues.map(row => {
                const matchingDetail = TrainingDetails.find(
                    detail => detail.topics === row.topic
                );
                // const place = matchingDetail.place
                // setSafetyPlace(place)
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
        } else {
            console.error("TrainingDetails is not an array:", TrainingDetails);
            setSafetyPlace(null);
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

    useEffect(() => {
        if (MemoryTest && MemoryTest.length > 0) {
            const updatedValues = MemoryTestData.map((exerciseData) => {
                // Find matching game for this exercise, if exists
                const matchingGame = MemoryTest.find(game => game.task_id === exerciseData.task_id) || {};
                // Update the date from API response or set to null for manual selection
                const apiDate = matchingGame.date ? dayjs(matchingGame.date).format('YYYY-MM-DD') : null;
                setMemoryTestDate(apiDate);
                // Create consistent attempts array with 5 entries
                const attempts = Array.from({ length: 5 }, (_, index) => {
                    const attempt = matchingGame.attempts ?
                        (matchingGame.attempts[index] || {}) :
                        {};
                    return {
                        attempt_number: index + 1,
                        mistakes: attempt.mistakes || "",
                        heart_test: attempt.heart_test || "",
                    };
                });
                return {
                    task_id: matchingGame.task_id,
                    process_name: matchingGame.process_name,
                    process_observation: matchingGame.process_observation,
                    sign: {
                        sign_by_trainee: matchingGame.sign?.sign_by_trainee || "",
                        sign_by_line_captain: matchingGame.sign?.sign_by_line_captain || "",
                    },
                    attempts: attempts,
                    status_: matchingGame.status_ || "",
                    remarks: matchingGame.remarks || "",
                    // date: matchingGame.date || "",
                };
            });
            setUpdatedMemoryTestValues(updatedValues);
        } else {

            // If no data, create a default set of 5 exercises with empty data
            const defaultValues = MemoryTestData.map((exerciseData) => ({
                task_id: exerciseData.task_id,
                process_name: "",
                process_observation: "",
                sign: {
                    sign_by_trainee: "",
                    sign_by_line_captain: "",
                },
                attempts: Array.from({ length: 5 }, (_, index) => ({
                    attempt_number: index + 1,
                    mistakes: "",
                    heart_test: "",
                })),
                status_: "",
                remarks: "",
                // date: "",
            }));
            setMemoryTestDate(null); // Reset date for manual selection
            setUpdatedMemoryTestValues(defaultValues);
        }
    }, [MemoryTest]);

    useEffect(() => {
        if (CycleAchievement && CycleAchievement.length > 0) {
            setCycleAchievementDate(MemoryTest[0]?.date);
            const updatedValues = CycleTimeAchievement.map((exerciseData) => {
                // Find matching game for this exercise, if exists
                const matchingGame = CycleAchievement.find(game => game.task_id === exerciseData.task_id) || {};
                // Create consistent attempts array with 5 entries
                const attempts = Array.from({ length: 5 }, (_, index) => {
                    const attempt = matchingGame.attempts ?
                        (matchingGame.attempts[index] || {}) :
                        {};
                    return {
                        attempt_number: index + 1,
                        JI_demo_line_captain: attempt.ji_demo_line_captain || "",
                        mistakes: attempt.mistakes || "",
                        cycle_time: attempt.cycle_time || "",
                    };
                });
                return {
                    task_id: matchingGame.task_id,
                    process_name: matchingGame.process_name || "",
                    dct: matchingGame.dct || "",
                    attempts: attempts,
                    date: matchingGame.date || "",
                    actual_score: matchingGame.actual_score || "",
                    status_: matchingGame.status_ || "",
                    remarks: matchingGame.remarks || "",
                    demo_line_captain: matchingGame.demo_line_captain || "",
                    demo_trainee: matchingGame.demo_trainee || "",
                    cycle_achievement: matchingGame.cycle_achievement || "",
                    skill_matrix: matchingGame.skill_matrix || "",
                    sign: {
                        sign_by_trainee: matchingGame?.sign?.sign_by_trainee || "",
                        sign_by_line_captain: matchingGame?.sign?.sign_by_line_captain || "",
                        sign_by_module_controller: matchingGame?.sign?.sign_by_module_controller || "",
                    },
                };
            });
            setUpdatedCycleAchievementValues(updatedValues);
        } else {
            // If no data, create a default set of 5 exercises with empty data
            const defaultValues = CycleTimeAchievement.map((exerciseData) => ({
                task_id: exerciseData.task_id,
                sign: {
                    sign_by_trainee: "",
                    sign_by_line_captain: "",
                    sign_by_module_controller: "",
                },
                attempts: Array.from({ length: 5 }, (_, index) => ({
                    attempt_number: index + 1,
                    JI_demo_line_captain: "",
                    cycle_time: Array(5).fill(""), // Array of 5 empty strings for cycle times
                    mistakes: Array(5).fill(""),  // Array of 5 empty strings for mistakes
                })),
                process_name: "",
                status_: "",
                remarks: "",
                actual_score: "",
                demo_line_captain: "",
                demo_trainee: "",
                cycle_achievement: "",
                skill_matrix: "",
                dct: "",
                date: "",
            }));
            setUpdatedCycleAchievementValues(defaultValues);
        }
    }, [CycleAchievement]);

    const handleDropdownChange = (value) => {
        setSelectedValue(value);
    };

    useEffect(() => {
        let apiDate = null;
        // Determine the correct source of data based on `selectedValue`
        switch (selectedValue) {
            case 10: // SafetyTask
                if (TrainingDetails?.length > 0) {
                    apiDate = TrainingDetails[0].date ? dayjs(TrainingDetails[0].date).startOf('day') : null;
                }
                break;
            case 20: // CycleGamesTask
                if (CycleGames?.length > 0) {
                    apiDate = CycleGames[0].date ? dayjs(CycleGames[0].date).startOf('day') : null;
                }
                break;
            case 30: // MemoryTestTask
                if (MemoryTest?.length > 0) {
                    apiDate = MemoryTest[0].date ? dayjs(MemoryTest[0].date).startOf('day') : null;
                }
                break;
            case 40: // CycleAchievementTask
                if (CycleAchievement?.length > 0) {
                    apiDate = CycleAchievement[0].date ? dayjs(CycleAchievement[0].date).startOf('day') : null;
                }
                break;
            default:
                console.warn("Unhandled selectedValue:", selectedValue);
        }
        // Set the selected date based on the API response or reset if not available
        setSelectedDate(apiDate);
    }, [TrainingDetails, CycleGames, MemoryTest, CycleAchievement, selectedValue]);

    // Handle manual date selection
    const handleDateChange = (date) => {
        // Ensure `date` is a `dayjs` instance
        const normalizedDate = date ? dayjs(date) : null;

        setSelectedDate(normalizedDate); // Update the selected date locally

        // Dynamically set state based on `selectedValue`
        const formattedDate = normalizedDate?.format('YYYY-MM-DD') || '';
        switch (selectedValue) {
            case 10:
                setSafetyDate(formattedDate);
                break;
            case 20:
                setCycleGamesDate(formattedDate);
                break;
            case 30:
                setMemoryTestDate(formattedDate);
                break;
            case 40:
                setCycleAchievementDate(formattedDate);
                break;
            default:
                console.warn("Unhandled selectedValue:", selectedValue);
        }
    };

    useEffect(() => {
        let apiPlace = null;
    
        // Determine the correct source of data based on `selectedValue`
        switch (selectedValue) {
            case 10: // SafetyTask
                apiPlace = TrainingDetails?.[0]?.place || null;
                break;
            case 20: // CycleGamesTask
                apiPlace = CycleGames?.[0]?.place || null;
                break;
            case 30: // MemoryTestTask
                apiPlace = MemoryTest?.[0]?.place || null;
                break;
            case 40: // CycleAchievementTask
                apiPlace = CycleAchievement?.[0]?.place || null;
                break;
            default:
                console.warn("Unhandled selectedValue:", selectedValue);
        }
    
        // Explicitly reset `selectedPlace` if `apiPlace` is null
        setSelectedPlace(apiPlace || ""); // Use an empty string if place is not available
    }, [TrainingDetails, CycleGames, MemoryTest, CycleAchievement, selectedValue]);

    const handlePlaceChange = (e) => {
        // Ensure `date` is a `dayjs` instance
        const place = e.target.value

        setSelectedPlace(place); // Update the selected date locally

        // Dynamically set state based on `selectedValue`
        switch (selectedValue) {
            case 10:
                setSafetyPlace(place);
                break;
            case 20:
                setCycleGamesPlace(place);
                break;
            case 30:
                setMemoryTestPlace(place);
                break;
            case 40:
                setCycleAchievementPlace(place);
                break;
            default:
                console.warn("Unhandled selectedValue:", selectedValue);
        }
    };

    const title = selectedValue === 10
        ? "1a - Basic & Safety Training"
        : selectedValue === 20
            ? "1b - Cycle Time Games"
            : selectedValue === 30
                ? "2 - JI Memory Test"
                : "Cycle Time Achievement";

    const place = selectedValue === 10
        ? "Training Center"
        : selectedValue === 20
            ? "Process Coach"
            : selectedValue === 30
                ? "Line Captain / Team Leader"
                : "Line Captain";

    const owner = selectedValue === 40
        ? "Owner: Module Controller" : selectedValue === 20 ? "Owner: Process Coach" : selectedValue === 30 ? "Owner: Line Captain / Team Leader"
            : "Owner: Training Officer";


    const table = selectedValue === 10
        ? <SafetyTrainingTable columns={SafetyTrainingHead} data={updatedSafetyTrainingValues} cc={cc} date={safetyDate} place={safetyPlace} />
        : selectedValue === 20
            ? <CycleTimeGamesTable data={updatedCycleGamesValues} cc={cc} date={cycleGamesDate} place={cycleGamesPlace} />
            : selectedValue === 30 ? <MemoryFirst data={updatedMemoryTestValues} cc={cc} date={memoryTestDate} place={memoryTestPlace} /> : <MemorySecond data={updatedCycleAchievementValues} cc={cc} date={cycleAchievementDate} place={cycleAchievementPlace} />;

    return (
        <>
            <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Grid container spacing={2} alignItems="center" sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid item xs={2}>
                        <Typography variant="h6" color="black" sx={{ fontWeight: "600" }}>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body1" sx={{ fontWeight: "600" }}>{owner}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        {/* <Typography variant="body1" sx={{ fontWeight: "600" }}>{place}</Typography> */}
                        <CustomTextField
                            placeholder="Place"
                            label="Place"
                            value={selectedPlace}
                            onChange={handlePlaceChange} // Update on chang
                            className="field-style" />
                    </Grid>
                    <Grid item xs={2}>
                        <CommonDatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
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