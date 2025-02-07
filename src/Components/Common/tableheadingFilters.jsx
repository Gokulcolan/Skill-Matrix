import React, { useEffect, useState } from 'react'
import { AttendanceFilter, CycleGamesExerciseData, CycleTimeAchievement, DaysFilter, MemoryTestData, SafetyTrainingHead, SafetyTrainingValues } from '../../utils/constants/tableDatas';
import CommonDropdown from './commonDropDown';
import { Card, CardContent, Grid, Typography } from "@mui/material";
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
    const [entryDate, setEntryDate] = useState(); // State to hold the selected date
    const [safetyDate, setSafetyDate] = useState(); // State to hold the selected date
    const [cycleGamesDate, setCycleGamesDate] = useState(); // State to hold the selected date
    const [memoryTestDate, setMemoryTestDate] = useState(); // State to hold the selected date
    const [cycleAchievementDate, setCycleAchievementDate] = useState(); // State to hold the selected date
    const [selectedPlace, setSelectedPlace] = useState(); // State to hold the selected date
    const [safetyPlace, setSafetyPlace] = useState(); // State to hold the selected date
    const [cycleGamesPlace, setCycleGamesPlace] = useState(); // State to hold the selected date
    const [memoryTestPlace, setMemoryTestPlace] = useState(); // State to hold the selected date
    const [cycleAchievementPlace, setCycleAchievementPlace] = useState(); // State to hold the selected date
    const [selectedAttendance, setSelectedAttendance] = useState({
        day1: "",
        day2: "",
        day3: "",
    });
    const [updatedSafetyTrainingValues, setUpdatedSafetyTrainingValues] = useState(
        () =>
            (SafetyTrainingValues || []).map(row => ({
                ...row,
                actual_score: "",
                faculty_name: "",
                status_: "",
                sign_by_trainee: "",
                sign_by_training_officer: "",
                Remarks: "",
            }))
    );
    const [updatedCycleGamesValues, setUpdatedCycleGamesValues] = useState([]);
    const [updatedMemoryTestValues, setUpdatedMemoryTestValues] = useState([]);
    const [updatedCycleAchievementValues, setUpdatedCycleAchievementValues] = useState([]);
    const [BUunit, setBUunit] = useState()
    const [formValuesFirst, setFormValuesFirst] = useState({
        module: "",
        cell: "",
        processName: "",
    });
    const [formValuesSecond, setFormValuesSecond] = useState({
        module: "",
        cell: "",
        processName: "",
    });

    useEffect(() => {
        if (Array.isArray(TrainingDetails)) { // Ensure TrainingDetails is an array
            const updatedValues = SafetyTrainingValues.map(row => {
                const matchingDetail = TrainingDetails.find(
                    detail => detail.topics === row.topic
                );
                const place = matchingDetail?.place || "";
                const date = matchingDetail?.date || "";
                const entryDate = matchingDetail?.entry_date || "";
                const attendance = {
                    day1: matchingDetail?.day_one || "",
                    day2: matchingDetail?.day_two || "",
                    day3: matchingDetail?.day_three || "",
                };
                setSafetyPlace(place)
                setSafetyDate(date)
                setEntryDate(entryDate)
                setSelectedAttendance(attendance);
                return {
                    ...row,
                    actual_score: matchingDetail?.actual_score || "",
                    faculty_name: matchingDetail?.faculty_name || "",
                    status_: matchingDetail?.status_ || "",
                    sign_by_trainee: matchingDetail?.sign_by_trainee || "",
                    sign_by_training_officer: matchingDetail?.sign_by_training_officer || "",
                    Remarks: matchingDetail?.Remarks || "",
                };
            });
            setUpdatedSafetyTrainingValues(updatedValues);
        } else {
            setSafetyPlace(null)
            setSafetyDate(null)
            setEntryDate(null)
            setSelectedAttendance({
                day1: "",
                day2: "",
                day3: "",
            }); // Reset to default object
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
            const place = CycleGames[0].place
            const date = CycleGames[0].date
            const BU = CycleGames[0].BU_unit
            setCycleGamesPlace(place)
            setCycleGamesDate(date)
            setBUunit(BU)
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
            setCycleGamesPlace(null)
            setCycleGamesDate(null)
            setBUunit(null)
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
                const place = matchingGame.place
                const fields = {
                    cell: matchingGame?.cell || "" || undefined,
                    module: matchingGame?.module || "" || undefined,
                    processName: matchingGame?.title_memory_process_name || "" || undefined,
                };
                setMemoryTestDate(apiDate);
                setMemoryTestPlace(place)
                setFormValuesFirst(fields)
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
            setMemoryTestPlace(null);
            setFormValuesFirst(null)
            setUpdatedMemoryTestValues(defaultValues);
        }
    }, [MemoryTest]);

    useEffect(() => {
        if (CycleAchievement && CycleAchievement.length > 0) {
            const updatedValues = CycleTimeAchievement.map((exerciseData) => {
                // Find matching game for this exercise, if exists

                const matchingGame = CycleAchievement.find(game => game.task_id === exerciseData.task_id) || {};
                const date = matchingGame.date
                const place = matchingGame.place
                const fields = {
                    cell: matchingGame?.cell || "",
                    module: matchingGame?.module || "",
                    processName: matchingGame?.title_cycle_process_name || "",
                };
                setCycleAchievementPlace(place);
                setCycleAchievementDate(date);
                setFormValuesSecond(fields)
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
            setCycleAchievementPlace(null);
            setCycleAchievementDate(null);
            setUpdatedCycleAchievementValues(defaultValues);
            setFormValuesSecond(null)
        }
    }, [CycleAchievement]);

    const handleDropdownChange = (value) => {
        setSelectedValue(value);
    };

    const handleAttendanceChange = (day, value) => {
        setSelectedAttendance((prev) => ({
            ...prev,
            [day]: value,
        }));
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

    const handleEntryDate = (date) => {
        // Ensure `date` is a `dayjs` instance
        const normalizedDate = date ? dayjs(date) : null;
        const formattedDate = normalizedDate?.format('YYYY-MM-DD') || '';
        setEntryDate(formattedDate);
    }

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

    const handleBUunit = (e) => {
        const BU = e.target.value
        setBUunit(BU); // Update the selected date locally
    }

    const handleInputChangeFirst = (e) => {
        const { name, value } = e.target;
        setFormValuesFirst((prev) => ({ ...(prev || {}), [name]: value }));
    };
    const handleInputChangeSecond = (e) => {
        const { name, value } = e.target;
        setFormValuesSecond((prev) => ({ ...(prev || {}), [name]: value }));
    };

    const titleFields = [
        { label: "Module", placeholder: "Enter Module", name: "module" },
        { label: "Cell", placeholder: "Enter Cell", name: "cell" },
        { label: "Process Name", placeholder: "Enter Process Name", name: "processName" },
    ];

    const title = selectedValue === 10
        ? "1a - Basic Induction Training"
        : selectedValue === 20
            ? "1b - Dexterity Exercise"
            : selectedValue === 30
                ? "2 - JI Memory Test"
                : "3 - Cycle Time Achievement";

    const owner = selectedValue === 40
        ? "Owner: Module Controller" : selectedValue === 20 ? "Owner: Process Coach" : selectedValue === 30 ? "Owner: Line Captain / Team Leader"
            : "Owner: Training Officer";

    const table = selectedValue === 10
        ? <SafetyTrainingTable columns={SafetyTrainingHead} data={updatedSafetyTrainingValues} cc={cc} testdate={safetyDate} place={safetyPlace} entryDate={entryDate} attendance={selectedAttendance} />
        : selectedValue === 20
            ? <CycleTimeGamesTable data={updatedCycleGamesValues} cc={cc} date={cycleGamesDate} place={cycleGamesPlace} BUunit={BUunit} />
            : selectedValue === 30 ? <MemoryFirst data={updatedMemoryTestValues} cc={cc} date={memoryTestDate} place={memoryTestPlace} fieldValues={formValuesFirst} />
                : <MemorySecond data={updatedCycleAchievementValues} cc={cc} date={cycleAchievementDate} place={cycleAchievementPlace} fieldValues={formValuesSecond} />;

    return (
        <>
            <Card className="p-6 rounded-2xl shadow-xl bg-white" sx={{ padding:"10px",backgroundColor: "#f9f9f9", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", textAlign: "none !important" }}>
                <CardContent>
                    <Grid container spacing={4} alignItems="center" justifyContent="space-between" className="mb-6">
                        {/* Title in the center */}
                        <Grid item xs={12} sm={10} md={10} className="flex justify-center">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <Typography
                                        variant="h5"
                                        className="font-bold text-gray-700"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {title}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body1" className="font-medium text-gray-600" sx={{ fontWeight: "bold" }}>
                                        {owner}
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                        {/* Target Completion Dropdown aligned to the right */}
                        <Grid item xs={12} sm={2} md={2} className="flex justify-end">
                            <CommonDropdown
                                label="Target Completion"
                                options={DaysFilter}
                                value={selectedValue}
                                onChange={handleDropdownChange}
                                className="w-full"
                            />
                        </Grid>
                    </Grid>

                    {/* Owner, Place, and Test Date Section */}
                    <Grid container spacing={4} alignItems="center" justifyContent="center" className="mb-6">
                      
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomTextField
                                placeholder="Enter Place"
                                label="Place"
                                value={selectedPlace}
                                onChange={handlePlaceChange}
                                className="w-full"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CommonDatePicker
                                selectedDate={selectedDate}
                                onDateChange={handleDateChange}
                                label={selectedValue === 10 || selectedValue === 20 ? "Test Date" : "Deployment Date"}
                                className="w-full"
                                sx={{ width: "100%" }}
                            />
                        </Grid>
                        {selectedValue === 20 ? (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <CustomTextField
                                        placeholder="Enter BU Unit"
                                        label="BU Unit"
                                        value={BUunit}
                                        onChange={handleBUunit}
                                        className="w-full"
                                    />
                                </Grid>
                            </>
                        ) : null}
                    </Grid>
                    <br />
                    {selectedValue === 10 ? (
                        <>
                            {/* Attendance Record Section */}
                            <Grid container spacing={4} >
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography
                                        variant="h6"
                                        className="font-semibold text-gray-700 mb-6"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Attendance Record
                                    </Typography>
                                </Grid>
                            </Grid>

                            <br />
                            <Grid container spacing={4} alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={6} md={3}>
                                    <CommonDatePicker
                                        selectedDate={entryDate}
                                        onDateChange={handleEntryDate}
                                        label="Trainee Entry Date"
                                        sx={{ width: "100%" }}
                                    />
                                </Grid>
                                {['day1', 'day2', 'day3'].map((day, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <CommonDropdown
                                            label={`Day ${index + 1}`}
                                            options={AttendanceFilter}
                                            value={selectedAttendance[day]}
                                            onChange={(value) => handleAttendanceChange(day, value)}
                                            sx={{ width: "100%" }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )
                        : selectedValue === 30 ? (
                            <>
                                <Grid container spacing={4} alignItems="center" justifyContent="center" className="mb-6">
                                    {titleFields?.length > 0 && titleFields?.map((field) => (
                                        <Grid item xs={12} sm={6} md={3} key={field.name}>
                                            <CustomTextField
                                                placeholder={field.placeholder}
                                                label={field.label}
                                                value={formValuesFirst?.[field.name] || ""}
                                                onChange={handleInputChangeFirst}
                                                name={field.name}
                                                className="w-full"
                                            />
                                        </Grid>
                                    ))}

                                </Grid>
                            </>
                        ) : selectedValue === 40 ? (<>
                            <Grid container spacing={4} alignItems="center" justifyContent="center" className="mb-6">
                                {titleFields?.length > 0 && titleFields?.map((field) => (
                                    <Grid item xs={12} sm={6} md={3} key={field.name}>
                                        <CustomTextField
                                            placeholder={field.placeholder}
                                            label={field.label}
                                            value={formValuesSecond?.[field?.name] || ""}
                                            onChange={handleInputChangeSecond}
                                            name={field.name}
                                            className="w-full"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                        ) : null
                    }
                </CardContent>
            </Card>
            <div>
                {table}
            </div>
        </>
    )
}

export default TableFilters