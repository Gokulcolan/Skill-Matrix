
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableFooter,
    Button,
    tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { updateCycleGamesApi } from "../../redux/action/adminAction";
import { showToast } from "../Toast/toastServices";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: "center",
    },
    [`&.${tableCellClasses.footer}`]: {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: "rgb(0 0 0 / 4%)",
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const CycleTimeGamesTable = ({ data, cc }) => {

    const dispatch = useDispatch();
    
    const { updateCycleGamesDetail } = useSelector((state) => state.admin);

    const [assessmentData, setAssessmentData] = useState([]);
    

    useEffect(() => {

        if (data && data.length > 0) {

            const transformedData = data.map((exercise) => {
                // Mapping attempts with defaults if missing
                const attemptsArray = exercise.attempts.map((attempt) => ({
                    attempts_id: attempt.attempts_id || null,
                    pf_status: attempt.pf_status || "",
                    mistakes: attempt.mistakes || "",
                    cycle_time: attempt.cycle_time || "",
                }));

                return {
                    ...exercise,
                    attempts: attemptsArray,
                    status_: exercise.status_ || "",
                    signByTrainee: exercise.sign.Signature_by_Trainee || "",
                    signByProcessCoach: exercise.sign.Signature_by_Process_Coach || "",
                    signByTrainingOfficer: exercise.sign.Signature_by_Training_Officer || "",
                };
            });

            // console.log("Transformed Data:", transformedData);

            setAssessmentData(transformedData);
        }
    }, [data]);

    const handleValueChange = (exerciseIndex, field, attemptIndex, value) => {
        setAssessmentData((prevData) => {
            const updatedData = [...prevData];
            if (attemptIndex !== null) {
                updatedData[exerciseIndex].attempts[attemptIndex] = {
                    ...updatedData[exerciseIndex].attempts[attemptIndex],
                    [field]: value,
                };
            } else {
                updatedData[exerciseIndex][field] = value;
            }
            return updatedData;
        });
    };

    const handleSave = () => {
        const payload = {
            Cycle_games: assessmentData.map((exercise) => ({
                task_id: exercise.task_id,
                attempts: exercise.attempts.map((attempt, index) => ({
                    attempt_number: index + 1,
                    ...attempt,
                })),
                status_: exercise.status_,
                sign: {
                    Signature_by_Trainee: exercise.signByTrainee,
                    Signature_by_Process_Coach: exercise.signByProcessCoach,
                    Signature_by_Training_Officer: exercise.signByTrainingOfficer,
                },
            })),
            cc_no: cc,
        };
        console.log(payload, "Payload for API");
        dispatch(updateCycleGamesApi(payload));
    };

    useEffect(() => {
        if (updateCycleGamesDetail?.Status === 'success') {
            showToast(updateCycleGamesDetail?.Messege, "success");
        } else if (updateCycleGamesDetail?.Status === 'error') {
            showToast("Failed to register the employee. Please try again.", "error");
        }
    }, [updateCycleGamesDetail]);

    return (
        <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell rowSpan={2}>Exercise Name</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Default Cycle Time</StyledTableCell>
                        <StyledTableCell colSpan={5}>Skill Assessment (Attempts)</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Status</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        {[1, 2, 3, 4, 5].map((attempt) => (
                            <StyledTableCell key={attempt}>{`Attempt ${attempt}`}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assessmentData.map((exercise, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell>{exercise?.name}</StyledTableCell>
                            <StyledTableCell>{exercise.dct || "-"}</StyledTableCell>
                            {exercise.attempts.map((attempt, attemptIndex) => (
                                <StyledTableCell key={attemptIndex}>
                                    <div>
                                        <select
                                            value={attempt.pf_status}
                                            onChange={(e) =>
                                                handleValueChange(index, "pf_status", attemptIndex, e.target.value)
                                            }
                                            className="field-drop-style"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Pass">Pass</option>
                                            <option value="Fail">Fail</option>
                                        </select>

                                        <input
                                            type="number"
                                            placeholder="Mistakes"
                                            value={attempt.mistakes}
                                            onChange={(e) =>
                                                handleValueChange(index, "mistakes", attemptIndex, e.target.value)
                                            }
                                            className="field-style"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cycle Time"
                                            value={attempt.cycle_time}
                                            onChange={(e) =>
                                                handleValueChange(index, "cycle_time", attemptIndex, e.target.value)
                                            }
                                            className="field-style"
                                        />
                                    </div>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>
                                <select
                                    value={exercise.status_}
                                    onChange={(e) =>
                                        handleValueChange(index, "status_", null, e.target.value)
                                    }
                                    className="field-drop-style"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pass">Pass</option>
                                    <option value="Fail">Fail</option>
                                </select>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <StyledTableCell>Signature by Trainee</StyledTableCell>
                        <StyledTableCell colSpan={2}>
                            <input
                                type="text"
                                value={assessmentData[0]?.signByTrainee}

                                onChange={(e) =>
                                    handleValueChange(0, "signByTrainee", null, e.target.value)
                                }
                                className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </StyledTableCell>
                        <StyledTableCell>Signature by Process Coach</StyledTableCell>
                        <StyledTableCell colSpan={2}>
                            <input
                                type="text"
                                value={assessmentData[0]?.signByProcessCoach}
                                onChange={(e) =>
                                    handleValueChange(0, "signByProcessCoach", null, e.target.value)
                                }
                                className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </StyledTableCell>
                        <StyledTableCell>Signature by Training Officer</StyledTableCell>
                        <StyledTableCell colSpan={2}>
                            <input
                                type="text"
                                value={assessmentData[0]?.signByTrainingOfficer}
                                onChange={(e) =>
                                    handleValueChange(0, "signByTrainingOfficer", null, e.target.value)
                                }
                                className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </StyledTableCell>
                    </TableRow>
                </TableFooter>

            </Table>
            <br />
            <Button
                variant="contained"
                color="success"
                sx={{ marginBottom: "16px" }}
                onClick={handleSave}
            >
                Save
            </Button>
        </TableContainer>
    );
};

export default CycleTimeGamesTable;

