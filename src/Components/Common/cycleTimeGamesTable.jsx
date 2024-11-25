import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableFooter,
    tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/system";
import { CycleGamesExerciseData } from "../../utils/constants/tableHead";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses?.head}`]: {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    [`&.${tableCellClasses?.body}`]: {
        fontSize: 14,
        textAlign: "center",
    },
    [`&.${tableCellClasses?.footer}`]: {
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

const CycleTimeGamesTable = () => {
    const [assessmentData, setAssessmentData] = useState(
        CycleGamesExerciseData.map((exercise) => ({
            ...exercise,
            attempts: Array(5).fill({ pf: "", mistakes: "", cycleTime: "" }),
            status: "",
            signByTrainee: "",
            signByProcessCoach: "",
            signByTrainingOfficer: "",
        }))
    );

    const handleValueChange = (exerciseIndex, field, attemptIndex, value) => {
        setAssessmentData((prevData) => {
            const updatedData = [...prevData];
            if (attemptIndex !== null) {
                // Update attempt-specific fields
                updatedData[exerciseIndex].attempts[attemptIndex] = {
                    ...updatedData[exerciseIndex].attempts[attemptIndex],
                    [field]: value,
                };
            } else {
                // Update non-attempt-specific fields
                updatedData[exerciseIndex][field] = value;
            }
            return updatedData;
        });
    };

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
                            <StyledTableCell>{exercise.name}</StyledTableCell>
                            <StyledTableCell>{exercise.dct || "-"}</StyledTableCell>
                            {exercise.attempts.map((attempt, attemptIndex) => (
                                <StyledTableCell key={attemptIndex}>
                                    <div className="flex flex-col">
                                        <input
                                            type="text"
                                            placeholder="PF"
                                            value={attempt.pf}
                                            onChange={(e) =>
                                                handleValueChange(index, "pf", attemptIndex, e.target.value)
                                            }
                                            className="mb-1 p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ marginBottom: "5px" }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Mistakes"
                                            value={attempt.mistakes}
                                            onChange={(e) =>
                                                handleValueChange(index, "mistakes", attemptIndex, e.target.value)
                                            }
                                            className="mb-1 p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ marginBottom: "5px" }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cycle Time"
                                            value={attempt.cycleTime}
                                            onChange={(e) =>
                                                handleValueChange(index, "cycleTime", attemptIndex, e.target.value)
                                            }
                                            className="p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>
                                <input
                                    type="text"
                                    value={exercise.status}
                                    onChange={(e) =>
                                        handleValueChange(index, "status", null, e.target.value)
                                    }
                                    className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
        </TableContainer>
    );
};

export default CycleTimeGamesTable;
