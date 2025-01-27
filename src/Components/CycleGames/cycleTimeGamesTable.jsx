
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
    // const [assessmentData, setAssessmentData] = useState([]);
    const [assessmentData, setAssessmentData] = useState([
        {
            signByProcessCoach: "",
            signByTrainingOfficer: "",
            dct: 0,
            attempts: [], // Ensure this exists and is initialized
        },
    ]);

    const [loading, setLoading] = useState(false);
    console.log(loading, "loading")
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

            setAssessmentData(transformedData);
        }
    }, [data]);

    const handleValueChange = (exerciseIndex, field, attemptIndex, value) => {
        setAssessmentData((prevData) => {
            // Create a copy of the current assessment data
            const updatedData = [...prevData];

            // Check if the provided exerciseIndex is valid
            if (!updatedData[exerciseIndex]) {
                return prevData; // Return previous state to avoid breaking
            }

            // Check if the update is for an attempt or a top-level field
            if (attemptIndex !== null) {
                // Ensure attempts array exists
                if (!updatedData[exerciseIndex]?.attempts) {
                    return prevData; // Return previous state
                }

                // Check if the attemptIndex is valid
                if (!updatedData[exerciseIndex].attempts[attemptIndex]) {

                    return prevData; // Return previous state
                }

                // Update the specific attempt field
                updatedData[exerciseIndex].attempts[attemptIndex] = {
                    ...updatedData[exerciseIndex].attempts[attemptIndex],
                    [field]: value,
                };

                // Automatically calculate pf_status based on conditions
                const attempt = updatedData[exerciseIndex].attempts[attemptIndex];
                const mistakes =
                    attempt.mistakes && attempt.mistakes !== "" ? parseInt(attempt.mistakes, 10) : null;
                const cycleTime =
                    attempt.cycle_time && attempt.cycle_time !== "" ? parseFloat(attempt.cycle_time) : null;
                const dct = parseFloat(updatedData[exerciseIndex].dct || 0);

                if (mistakes !== null && cycleTime !== null) {
                    attempt.pf_status =
                        mistakes === 0 && cycleTime <= dct ? "Pass" : "Fail";
                }

                // Calculate overall status for the exercise
                const passCount = updatedData[exerciseIndex].attempts.filter(
                    (attempt) => attempt.pf_status === "Pass"
                ).length;
                updatedData[exerciseIndex].status_ = passCount >= 2 ? "Pass" : "Fail";
            } else {
                // Update top-level fields (e.g., signByProcessCoach, signByTrainingOfficer)
                updatedData[exerciseIndex][field] = value;
            }

            return updatedData; // Return the updated state
        });
    };


    const handleSave = async () => {

        // Compute the overall result
        // const overallResult = assessmentData.every((exercise) => exercise.status_ === "Pass")
        //     ? "Pass"
        //     : assessmentData.some((exercise) => exercise.status_ === "Fail")
        //         ? "Fail"
        //         : "Pending";

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
            // over_all_result: overallResult,
        };
        // dispatch(updateCycleGamesApi(payload));
        setLoading(true);
        try {
            await dispatch(updateCycleGamesApi(payload));
        } catch (error) {
            console.error("Error saving data:", error);
            setLoading(false); // Hide loader if an error occurs
        }
        // finally {
        //     // Always stop the loader
        //     setLoading(false);
        // }
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
            {loading && <Loader />}
            <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell rowSpan={2}>Exercise Name</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Target Cycle Time</StyledTableCell>
                            <StyledTableCell colSpan={5}>Skill Assessment ( Minimum two attempts are required to pass and meet the overall pass )</StyledTableCell>
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
                                            <CustomTextField
                                                placeholder="Mistakes"
                                                label="Mistakes"
                                                value={attempt.mistakes}
                                                onChange={(e) =>
                                                    handleValueChange(index, "mistakes", attemptIndex, e.target.value)
                                                }
                                                size="small"
                                            // className="field-style2"
                                            />
                                            <CustomTextField
                                                placeholder="Cycle Time"
                                                label="Cycle Time"
                                                value={attempt.cycle_time}
                                                onChange={(e) =>
                                                    handleValueChange(index, "cycle_time", attemptIndex, e.target.value)
                                                }
                                                // className="field-style2"
                                                size="small"
                                            />
                                            {/* <CommonDropdown
                                                    label="Status"
                                                    value={attempt.pf_status}
                                                    options={status}
                                                    size="small"
                                                    onChange={(value) => handleValueChange(index, "pf_status", attemptIndex, value)}
                                                    className="field-style"
                                                /> */}
                                            {/* <span
                                                    style={{
                                                        color: attempt.pf_status === "Pass" ? "green" : "red",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {attempt.pf_status || "Pending"}
                                                </span> */}
                                            <div style={{ margin: "8px 0px" }}>
                                                <span
                                                    style={{
                                                        color:
                                                            attempt.pf_status === "Pass"
                                                                ? "white"
                                                                : attempt.pf_status
                                                                    ? "white"
                                                                    : "black",
                                                        backgroundColor:
                                                            attempt.pf_status === "Pass"
                                                                ? "#28a745"
                                                                : attempt.pf_status === "Fail"
                                                                    ? "#dc3545"
                                                                    : "#FFEB3B",
                                                        fontWeight: "bold",
                                                        padding: "4px 8px", // Optional: Add padding for better visibility
                                                        borderRadius: "4px", // Optional: Add rounded corners
                                                    }}
                                                >
                                                    {`Status: ${attempt.pf_status || "Pending"}`}
                                                </span>
                                            </div>

                                        </div>
                                    </StyledTableCell>
                                ))}
                                {/* <StyledTableCell>
                                        <CommonDropdown
                                            label="Over all Status"
                                            value={exercise.status_}
                                            options={status}
                                            size="small"
                                            onChange={(value) => handleValueChange(index, "status_", null, value)}  // Directly pass the value
                                            className="field-style"
                                        />
                                    </StyledTableCell> */}
                                <StyledTableCell>
                                    <span
                                        style={{
                                            color: exercise.status_ === "Pass"
                                                ? "White"  // Green for Pass
                                                : exercise.status_ === "Fail"
                                                    ? "white"  // Red for Fail
                                                    : "Black", // Golden Yellow for Pending
                                            fontWeight: "bold",
                                            backgroundColor: exercise.status_ === "Pass"
                                                ? "#28a745"  // Green background for Pass
                                                : exercise.status_ === "Fail"
                                                    ? "#dc3545"  // Red background for Fail
                                                    : "#FFEB3B", // Vivid Yellow background for Pending
                                            padding: "5px 10px",  // Adding some padding for better readability
                                            borderRadius: "4px",  // Rounded corners for the status
                                        }}
                                    >
                                        {exercise.status_ || "Pending"}
                                    </span>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        {/* Overall Status Row */}
                        {/* <StyledTableRow>
                                <StyledTableCell colSpan={8} style={{ textAlign: "center", padding: "30px" }}>
                                    <span
                                        style={{
                                            color:
                                                assessmentData.every((exercise) =>
                                                    exercise.status_ === "Pass" ? true : false
                                                )
                                                    ? "White" // Green for Pass
                                                    : assessmentData.some(
                                                        (exercise) => exercise.status_ === "Fail"
                                                    )
                                                        ? "white" // Red for Fail
                                                        : "Black", // Golden Yellow for Pending
                                            fontWeight: "bold",
                                            backgroundColor:
                                                assessmentData.every((exercise) =>
                                                    exercise.status_ === "Pass" ? true : false
                                                )
                                                    ? "#28a745" // Green background for Pass
                                                    : assessmentData.some(
                                                        (exercise) => exercise.status_ === "Fail"
                                                    )
                                                        ? "#dc3545" // Red background for Fail
                                                        : "#FFEB3B", // Vivid Yellow background for Pending
                                            padding: "15px", // Adding some padding for better readability
                                            borderRadius: "4px", // Rounded corners for the status
                                        }}
                                    >
                                        {assessmentData.every((exercise) => exercise.status_ === "Pass")
                                            ? "Overall Status: Pass"
                                            : assessmentData.some((exercise) => exercise.status_ === "Fail")
                                                ? "Overall Status: Fail"
                                                : "Overall Status: Pending"}
                                    </span>
                                </StyledTableCell>
                            </StyledTableRow> */}
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
                    save
                </Button>
                <SignPopup
                    openModal={open}
                    setOpenModal={() => setOpen(false)}
                    onSave={handleSaveSignature}
                />
            </TableContainer>
        </div>
    );
};

export default CycleTimeGamesTable;

