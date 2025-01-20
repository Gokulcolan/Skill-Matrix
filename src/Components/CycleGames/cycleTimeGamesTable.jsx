
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
import { Box, styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { updateCycleGamesApi } from "../../redux/action/adminAction";
import { showToast } from "../Toast/toastServices";
import SignPopup from "../Modal/signVerify";
import Loader from "../Loader/Loader";
import CustomTextField from "../Common/customTextField";
import CommonDropdown from "../Common/commonDropDown";
import { status } from "../../utils/constants/tableDatas";

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

const CycleTimeGamesTable = ({ data, cc, date, place }) => {
    
    const [open, setOpen] = useState(false);
    const [assessmentData, setAssessmentData] = useState([]);
    const [loading, setLoading] = useState(false);

    const { updateCycleGamesDetail } = useSelector((state) => state.admin);

    const dispatch = useDispatch();
    const isFirstRender = useRef(true);
    const previousDetail = useRef(null);

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

    const handleSave = async () => {
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
            date: date,
            place: place,
        };
        // dispatch(updateCycleGamesApi(payload));
        setLoading(true);
        try {
            await dispatch(updateCycleGamesApi(payload));
        } catch (error) {
            console.error("Error saving data:", error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (updateCycleGamesDetail?.Status === 'success') {
    //         showToast(updateCycleGamesDetail?.Message, "success");
    //         setLoading(false);
    //     } else if (updateCycleGamesDetail?.Status === 'fail') {
    //         showToast(updateCycleGamesDetail?.Message, "error");
    //         setLoading(false);
    //     }
    // }, [updateCycleGamesDetail]);

    // Show toast messages based on API response
    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false; // Set to false after the first render
            previousDetail.current = updateCycleGamesDetail; // Set initial value
            return; // Skip showing toast on the first render
        }

        // Show toast only if updateEmployeeDetail has changed
        if (
            updateCycleGamesDetail &&
            updateCycleGamesDetail !== previousDetail.current
        ) {
            previousDetail.current = updateCycleGamesDetail; // Update the previous value
            if (updateCycleGamesDetail?.Status === "success") {
                showToast(updateCycleGamesDetail?.Message, "success");
                setLoading(false);
            } else if (updateCycleGamesDetail?.Status === "fail") {
                showToast(updateCycleGamesDetail?.Message, "error");
                setLoading(false);
            }
        }
    }, [updateCycleGamesDetail]);

    const handleSignVerify = () => {
        setOpen(true);
    };

    const handleSaveSignature = (signatureData) => {
        const updatedData = [...assessmentData];
        updatedData[0].signByTrainee = signatureData; // Update the specific field
        setAssessmentData(updatedData); // Ensure `setAssessmentData` updates state
        // setTableData(signatureData);
        setOpen(false);
    };


    return (
        <div>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                    <Loader />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell rowSpan={2}>Exercise Name</StyledTableCell>
                                <StyledTableCell rowSpan={2}>DCT</StyledTableCell>
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
                                                <CommonDropdown
                                                    label="Status"
                                                    value={attempt.pf_status}
                                                    options={status}
                                                    size="small"
                                                    onChange={(value) => handleValueChange(index, "pf_status", attemptIndex, value)}
                                                    className="field-style"
                                                />
                                                <CustomTextField
                                                    placeholder="Mistakes"
                                                    label="Mistakes"
                                                    value={attempt.mistakes}
                                                    onChange={(e) =>
                                                        handleValueChange(index, "mistakes", attemptIndex, e.target.value)
                                                    }
                                                    size="small"
                                                    className="field-style2"
                                                />
                                                <CustomTextField
                                                    placeholder="Cycle Time"
                                                    label="Cycle Time"
                                                    value={attempt.cycle_time}
                                                    onChange={(e) =>
                                                        handleValueChange(index, "cycle_time", attemptIndex, e.target.value)
                                                    }
                                                    className="field-style2"
                                                    size="small"
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
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <StyledTableCell>Signature by Trainee</StyledTableCell>
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
                                            // style={{ width: "100px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
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
                                <StyledTableCell>Signature by Process Coach</StyledTableCell>
                                <StyledTableCell colSpan={2}>
                                    <input
                                        type="text"
                                        value={assessmentData[0]?.signByProcessCoach}
                                        onChange={(e) =>
                                            handleValueChange(0, "signByProcessCoach", null, e.target.value)
                                        }
                                        className="field-style"
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
                                        className="field-style"
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
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <SignPopup
                        openModal={open}
                        setOpenModal={() => setOpen(false)}
                        onSave={handleSaveSignature}
                    />
                </TableContainer>
            )}
        </div>
    );
};

export default CycleTimeGamesTable;

