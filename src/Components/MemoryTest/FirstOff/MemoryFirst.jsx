import React, { useEffect, useRef, useState } from "react";
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
import SignPopup from "../../Modal/signVerify";
import { showToast } from "../../Toast/toastServices";
import { updateMemoryTestApi } from "../../../redux/action/adminAction";
import CustomTextField from "../../Common/customTextField";
import { status } from "../../../utils/constants/tableDatas";
import CommonDropdown from "../../Common/commonDropDown";

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

const MemoryFirst = ({ data, cc, date ,place }) => {

    const [open, setOpen] = useState(false);
    const [assessmentData, setAssessmentData] = useState([]);
    const { updateMemoryTestDetail } = useSelector((state) => state.admin);

    const dispatch = useDispatch();
    const isFirstRender = useRef(true);
    const previousDetail = useRef(null);

    useEffect(() => {
        if (data && data.length > 0) {
            const transformedData = data.map((exercise) => {
                // Mapping attempts with defaults if missing
                const attemptsArray = exercise.attempts.map((attempt) => ({
                    attempts_id: attempt.attempts_id || null,
                    mistakes: attempt.mistakes || "",
                    heart_test: attempt.heart_test || "",
                }));
                return {
                    ...exercise,
                    attempts: attemptsArray,
                    status_: exercise.status_ || "",
                    remarks: exercise.remarks || "",
                    process_name: exercise.process_name,
                    process_observation: exercise.process_observation,
                    date: exercise.date || "",
                    signByTrainee: exercise.sign.sign_by_trainee || "",
                    signByLineCaptain: exercise.sign.sign_by_line_captain || "",
                };
            });
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
            memory_games: assessmentData.map((exercise) => ({
                // task_id: exercise.task_id,
                attempts: exercise.attempts.map((attempt, index) => ({
                    attempt_number: index + 1,
                    ...attempt,
                })),
                status_: exercise.status_,
                remarks: exercise.remarks,
                process_name: exercise.process_name,
                process_observation: exercise.process_observation,
                sign: {
                    sign_by_trainee: exercise.signByTrainee,
                    sign_by_line_captain: exercise.signByLineCaptain,
                },
                date: date,
                place: place,
            })),
            cc_no: cc,
        };
        dispatch(updateMemoryTestApi(payload));
    };


    // Show toast messages based on API response
    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false; // Set to false after the first render
            previousDetail.current = updateMemoryTestDetail; // Set initial value
            return; // Skip showing toast on the first render
        }

        // Show toast only if updateEmployeeDetail has changed
        if (
            updateMemoryTestDetail &&
            updateMemoryTestDetail !== previousDetail.current
        ) {
            previousDetail.current = updateMemoryTestDetail; // Update the previous value
            if (updateMemoryTestDetail?.Status === "success") {
                showToast(updateMemoryTestDetail?.Message, "success");
            } else if (updateMemoryTestDetail?.Status === "fail") {
                showToast(updateMemoryTestDetail?.Message, "error");
            }
        }
    }, [updateMemoryTestDetail]);

    const handleSignVerify = () => {
        setOpen(true);
    };

    const handleSaveSignature = (signatureData) => {
        const updatedData = [...assessmentData];
        updatedData[0].signByTrainee = signatureData; // Update the specific field
        setAssessmentData(updatedData); // Ensure `setAssessmentData` updates state
        setOpen(false);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell rowSpan={2}>Process Name & Number</StyledTableCell>
                        <StyledTableCell rowSpan={2}>My Process Observation</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Target Score</StyledTableCell>
                        <StyledTableCell colSpan={5}>Skill Assessment (Attempts)</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Status</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Remarks</StyledTableCell>
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
                            <StyledTableCell>
                                <input
                                    type="text"
                                    placeholder="process Name"
                                    value={exercise?.process_name}
                                    onChange={(e) =>
                                        handleValueChange(index, "process_name", null, e.target.value)
                                    }
                                    className="field-style"
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <input
                                    type="text"
                                    placeholder="Process Observation"
                                    value={exercise?.process_observation}
                                    onChange={(e) =>
                                        handleValueChange(index, "process_observation", null, e.target.value)
                                    }
                                    className="field-style"
                                />
                            </StyledTableCell>
                            <StyledTableCell> &gt;93 </StyledTableCell>
                            {exercise.attempts.map((attempt, attemptIndex) => (
                                <StyledTableCell key={attemptIndex}>
                                    <div>
                                        <CustomTextField
                                            placeholder="Mistakes"
                                            label="No of Mistakes"
                                            value={attempt.mistakes}
                                            onChange={(e) =>
                                                handleValueChange(index, "mistakes", attemptIndex, e.target.value)
                                            }
                                            // customStyles={inputStyle}
                                            size="small"
                                            className="field-style"
                                        />
                                        <CustomTextField
                                            placeholder="Heart Test"
                                            label="By Heart Test Actual"
                                            value={attempt.heart_test}
                                            onChange={(e) =>
                                                handleValueChange(index, "heart_test", attemptIndex, e.target.value)
                                            }
                                            // customStyles={inputStyle}
                                            size="small"
                                            className="field-style"
                                        />
                                    </div>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>
                                <CommonDropdown
                                    label="Status"
                                    value={exercise.status_}
                                    options={status}
                                    size="small"
                                    onChange={(value) => handleValueChange(index, "status_", null, value)}  // Directly pass the value
                                    className="field-style"
                                />
                                {/* <select
                                    value={exercise.status_}
                                    onChange={(e) =>
                                        handleValueChange(index, "status_", null, e.target.value)
                                    }
                                    className="field-drop-style"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pass">Pass</option>
                                    <option value="Fail">Fail</option>
                                </select> */}
                            </StyledTableCell>
                            <StyledTableCell>
                                <input
                                    type="text"
                                    placeholder="Remarks"
                                    value={exercise.remarks}
                                    onChange={(e) =>
                                        handleValueChange(index, "remarks", null, e.target.value)
                                    }
                                    className="field-style"
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <StyledTableCell colSpan={2}>Signature by Trainee</StyledTableCell>
                        <StyledTableCell colSpan={2}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                {assessmentData[0]?.signByTrainee ? (
                                    <img
                                        src={
                                            typeof assessmentData[0]?.signByTrainee === "string" &&
                                                (assessmentData[0]?.signByTrainee.startsWith("http") ||
                                                    assessmentData[0]?.signByTrainee.startsWith("data:image"))
                                                ? assessmentData[0]?.signByTrainee
                                                : "https://via.placeholder.com/150"
                                        }
                                        alt="Profile"
                                        className="signature-img-cycle"
                                    />
                                ) : (
                                    ""
                                )}

                                <Button
                                    variant="outlined"
                                    onClick={() => handleSignVerify()}
                                    sx={{ backgroundColor: "white" }}
                                >
                                    Click here to Sign
                                </Button>
                            </div>
                        </StyledTableCell>
                        <StyledTableCell colSpan={2}>&nbsp; </StyledTableCell>
                        <StyledTableCell colSpan={2}>Signature Line Caption / Team Leader </StyledTableCell>
                        <StyledTableCell colSpan={1}>
                            <input
                                type="text"
                                value={assessmentData[0]?.signByLineCaptain}
                                onChange={(e) =>
                                    handleValueChange(0, "signByLineCaptain", null, e.target.value)
                                }
                                className="field-style"
                            />
                        </StyledTableCell>
                        <StyledTableCell colSpan={1}>&nbsp; </StyledTableCell>
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
            <SignPopup
                openModal={open}
                setOpenModal={() => setOpen(false)}
                onSave={handleSaveSignature}
            />
        </TableContainer>
    );
};

export default MemoryFirst;

