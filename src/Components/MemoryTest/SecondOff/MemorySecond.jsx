
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
import { updateCycleTimeAchievementApi } from "../../../redux/action/adminAction";
import { showToast } from "../../Toast/toastServices";
import SignPopup from "../../Modal/signVerify";
import CustomTextField from "../../Common/customTextField";

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

const MemorySecond = ({ data, cc, date, place }) => {

    const [open, setOpen] = useState(false);
    const [assessmentData, setAssessmentData] = useState([]);
    console.log(assessmentData, "assessmentData234")

    const { updateCycleTimeDetail } = useSelector((state) => state.admin);
    console.log(updateCycleTimeDetail, "updateCycleTimeDetail")
    const dispatch = useDispatch();
    const isFirstRender = useRef(true);
    const previousDetail = useRef(null);

    useEffect(() => {
        if (data && data.length > 0) {
            const transformedData = data.map((exercise) => {
                console.log(exercise, "exercise")
                const attemptsArray = exercise?.attempts?.map((attempt) => ({
                    attempts_id: attempt.attempts_id || null,
                    JI_demo_line_captain: attempt.JI_demo_line_captain || null,
                    mistakes: attempt.mistakes || [],
                    cycle_time: attempt.cycle_time || [],
                })) || [];
                return {
                    ...exercise,
                    attempts: attemptsArray,
                    dct: exercise.dct || "",
                    status_: exercise.status_ || "",
                    remarks: exercise.remarks || "",
                    process_name: exercise.process_name || "",
                    demo_line_captain: exercise.demo_line_captain || "",
                    demo_trainee: exercise.demo_trainee || "",
                    cycle_achievement: exercise.cycle_achievement || "",
                    skill_matrix: exercise.skill_matrix || "",
                    actual_score: exercise.actual_score || "",
                    signByTrainee: exercise.sign?.sign_by_trainee || "",
                    signByLineCaptain: exercise.sign?.sign_by_line_captain || "",
                    signByModuleController: exercise.sign?.sign_by_module_controller || "",
                    date: exercise.date || "",
                };
            });
            setAssessmentData(transformedData);
        }
    }, [data]);


    // const handleValueChange = (exerciseIndex, field, attemptIndex, value) => {
    //     setAssessmentData((prevData) => {
    //         const updatedData = [...prevData];
    //         if (attemptIndex !== null) {
    //             updatedData[exerciseIndex].attempts[attemptIndex] = {
    //                 ...updatedData[exerciseIndex].attempts[attemptIndex],
    //                 [field]: value,
    //             };
    //         } else {
    //             updatedData[exerciseIndex][field] = value;
    //         }
    //         return updatedData;
    //     });
    // };

    // const handleValueChange = (exerciseIndex, field, attemptIndex, subIndex, value) => {
    //     console.log(field,"field")
    //     setAssessmentData((prevData) => {
    //         const updatedData = [...prevData];
    //         if (field === "cycle_time" || field === "mistakes") {
    //             // Update the specific field in the array
    //             updatedData[exerciseIndex].attempts[attemptIndex][field][subIndex] = value;
    //         } else {
    //             updatedData[exerciseIndex].attempts[attemptIndex][field] = value;
    //         }
    //         return updatedData;
    //     });
    // };

    const handleValueChange = (exerciseIndex, field, attemptIndex, subIndex, value) => {
        setAssessmentData((prevData) => {
            const updatedData = [...prevData]; // Shallow copy of top-level array

            // Deep copy the specific exercise object
            updatedData[exerciseIndex] = { ...updatedData[exerciseIndex] };

            if (attemptIndex !== null) {
                // Deep copy the attempts array
                updatedData[exerciseIndex].attempts = [...updatedData[exerciseIndex].attempts];

                if (subIndex !== null) {
                    // Deep copy the specific field array
                    updatedData[exerciseIndex].attempts[attemptIndex][field] = [
                        ...updatedData[exerciseIndex].attempts[attemptIndex][field],
                    ];
                    updatedData[exerciseIndex].attempts[attemptIndex][field][subIndex] = value; // Modify the value
                } else {
                    updatedData[exerciseIndex].attempts[attemptIndex] = {
                        ...updatedData[exerciseIndex].attempts[attemptIndex],
                    };
                    updatedData[exerciseIndex].attempts[attemptIndex][field] = value; // Modify the value
                }
            } else {
                updatedData[exerciseIndex] = { ...updatedData[exerciseIndex] };
                updatedData[exerciseIndex][field] = value; // Modify the value
            }

            return updatedData; // Return the fully updated copy
        });
    };


    // const handleValueChange = (exerciseIndex, field, attemptIndex, subIndex, value) => {
    //     setAssessmentData((prevData) => {
    //         const updatedData = [...prevData];
    //         if (attemptIndex !== null && subIndex !== null) {
    //             // For deeply nested fields (e.g., cycle_time or mistakes)
    //             updatedData[exerciseIndex].attempts[attemptIndex][field][subIndex] = value;
    //         } else if (attemptIndex !== null) {
    //             // For attempt-level fields (e.g., JI_demo_line_captain)
    //             updatedData[exerciseIndex].attempts[attemptIndex][field] = value;
    //         } else {
    //             // For exercise-level fields
    //             updatedData[exerciseIndex][field] = value;
    //         }
    //         return updatedData;
    //     });
    // };

    const handleSave = () => {
        const payload = {
            Cycle_time_achievement: assessmentData.map((exercise) => (
                {
                    task_id: exercise.task_id,
                    attempts: exercise.attempts.map((attempt, index) => ({
                        attempt_number: index + 1,
                        ...attempt,
                    })),
                    dct: exercise.dct,
                    date: date,
                    place: place,
                    status_: exercise.status_,
                    remarks: exercise.remarks,
                    actual_score: exercise.actual_score,
                    demo_line_captain: exercise.demo_line_captain,
                    demo_trainee: exercise.demo_trainee,
                    cycle_achievement: exercise.cycle_achievement,
                    skill_matrix: exercise.skill_matrix,
                    process_name: exercise.process_name,
                    sign: {
                        Signature_by_Trainee: exercise?.signByTrainee,
                        Signature_by_line_caption: exercise?.signByLineCaptain,
                        Signature_by_module_controller: exercise?.signByModuleController,
                    },
                }
            )),
            cc_no: cc,
        };
        dispatch(updateCycleTimeAchievementApi(payload));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Set to false after the first render
            previousDetail.current = updateCycleTimeDetail; // Set initial value
            return; // Skip showing toast on the first render
        }
        // Show toast only if updateEmployeeDetail has changed
        if (
            updateCycleTimeDetail &&
            updateCycleTimeDetail !== previousDetail.current
        ) {
            previousDetail.current = updateCycleTimeDetail; // Update the previous value
            if (updateCycleTimeDetail[0]?.status === "success") {
                showToast(updateCycleTimeDetail[0]?.message, "success");
            } else if (updateCycleTimeDetail[0]?.action === "fail") {
                showToast(updateCycleTimeDetail[0]?.message, "error");
            }
        }
    }, [updateCycleTimeDetail]);

    const handleSignVerify = () => {
        setOpen(true);
    };

    const handleSaveSignature = (signatureData) => {
        const updatedData = [...assessmentData];
        updatedData[0].signByTrainee = signatureData; // Update the specific field
        setAssessmentData(updatedData); // Ensure `setAssessmentData` updates state
        setOpen(false);
    };

    const inputStyle = {
        width: "100px", // Smaller width for the input field
        fontSize: "10px", // Smaller font size
        borderRadius: "4px", // Slightly rounded corners
        textAlign: "center", // Align text centrally in inputs
        margin: "8px", // Small margin for spacing
    };

    const inputWrapperStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center inputs vertically
        alignItems: "center", // Center inputs horizontally
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell rowSpan={2}>JI Training - 5 Times Demo by Line Captain</StyledTableCell>
                        <StyledTableCell rowSpan={2}>JI Training - 5 Times by Trainee</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Cycle Time Achievement</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Update Skill Matrix</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Process Name & Number</StyledTableCell>
                        <StyledTableCell rowSpan={2}>DCT</StyledTableCell>
                        <StyledTableCell colSpan={5}>Cycle Time Achievement(Attempts)</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Target Score</StyledTableCell>
                        <StyledTableCell rowSpan={2}>Actual Score</StyledTableCell>
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
                    {assessmentData?.map((exercise, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell>
                                <select
                                    value={exercise.demo_line_captain}
                                    onChange={(e) =>
                                        handleValueChange(index, "demo_line_captain", null, null, e.target.value)
                                    }
                                    className="field-drop-style2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <select
                                    value={exercise.demo_trainee}
                                    onChange={(e) =>
                                        handleValueChange(index, "demo_trainee", null, null, e.target.value)
                                    }
                                    className="field-drop-style2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <select
                                    value={exercise.cycle_achievement}
                                    onChange={(e) =>
                                        handleValueChange(index, "cycle_achievement", null, null, e.target.value)
                                    }
                                    className="field-drop-style2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <select
                                    value={exercise.skill_matrix}
                                    onChange={(e) =>
                                        handleValueChange(index, "skill_matrix", null, null, e.target.value)
                                    }
                                    className="field-drop-style2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <input
                                    type="text"
                                    placeholder="Process Name"
                                    value={exercise.process_name}
                                    onChange={(e) =>
                                        handleValueChange(index, "process_name", null, null, e.target.value)
                                    }
                                    className="field-style2"
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <input
                                    type="text"
                                    placeholder="Dct"
                                    value={exercise.dct}
                                    onChange={(e) =>
                                        handleValueChange(index, "dct", null, null, e.target.value)
                                    }
                                    className="field-style2"
                                />
                            </StyledTableCell>
                            {exercise?.attempts?.map((attempt, attemptIndex) => (
                                <StyledTableCell key={attemptIndex}>
                                    <div style={{ display: "flex" }}>
                                        {/* Loop for Cycle Time inputs */}
                                        <div style={inputWrapperStyle}>
                                            {Array.isArray(attempt?.cycle_time) &&
                                                attempt?.cycle_time?.map((time, subIndex) => (
                                                    <CustomTextField
                                                        key={`cycle_time-${attemptIndex}-${subIndex}`}
                                                        placeholder={`Cycle Time ${subIndex + 1}`}
                                                        label={`Cycle Time ${subIndex + 1}`}
                                                        value={time}
                                                        onChange={(e) =>
                                                            handleValueChange(
                                                                index,
                                                                "cycle_time",
                                                                attemptIndex,
                                                                subIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        size="small"
                                                        customStyles={inputStyle}
                                                        className="field-style2"
                                                        InputProps={{
                                                            sx: {
                                                                "&::placeholder": {
                                                                    fontSize: "10px", // Reduced placeholder font size
                                                                    color: "#888", // Optional: Adjust placeholder color
                                                                },
                                                            },
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                        {/* Render Mistakes Inputs */}
                                        <div style={inputWrapperStyle}>
                                            {attempt?.mistakes?.map((mistake, subIndex) => (
                                                <CustomTextField
                                                    className="field-style2"
                                                    key={`mistake-${attemptIndex}-${subIndex}`}
                                                    placeholder={`Mistake ${subIndex + 1}`}
                                                    label={`Mistake ${subIndex + 1}`}
                                                    value={mistake}
                                                    onChange={(e) =>
                                                        handleValueChange(
                                                            index,
                                                            "mistakes",
                                                            attemptIndex,
                                                            subIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    customStyles={inputStyle}
                                                    size="small"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Render JI Demo Line Captain */}
                                    <CustomTextField
                                        placeholder="JI Demo Line Captain"
                                        label="JI Demo Line Captain"
                                        value={attempt.JI_demo_line_captain}
                                        onChange={(e) =>
                                            handleValueChange(
                                                index,
                                                "JI_demo_line_captain",
                                                attemptIndex,
                                                null,
                                                e.target.value
                                            )
                                        }
                                        customStyles={inputStyle}
                                        size="small"
                                        className="field-style3"
                                    />
                                </StyledTableCell>
                            ))}
                            <StyledTableCell> &gt;93</StyledTableCell>
                            <StyledTableCell>
                                <input
                                    type="number"
                                    placeholder="Actual Score"
                                    value={exercise.actual_score}
                                    onChange={(e) =>
                                        handleValueChange(index, "actual_score", null, null, e.target.value)
                                    }
                                    className="field-style2"
                                />
                            </StyledTableCell>
                            <StyledTableCell>
                                <select
                                    value={exercise.status_}
                                    onChange={(e) =>
                                        handleValueChange(index, "status_", null, null, e.target.value)
                                    }
                                    className="field-drop-style2"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pass">Pass</option>
                                    <option value="Fail">Fail</option>
                                </select>
                            </StyledTableCell>
                            <StyledTableCell>
                                <input
                                    type="text"
                                    placeholder="Remarks"
                                    value={exercise.remarks}
                                    onChange={(e) =>
                                        handleValueChange(index, "remarks", null, null, e.target.value)
                                    }
                                    className="field-style2"
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {/* Signature by Trainee */}
                        <StyledTableCell colSpan={2} align="center">Signature by Trainee</StyledTableCell>
                        <StyledTableCell colSpan={3} align="center">
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
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                ) : (
                                    ""
                                )}

                                <Button
                                    variant="outlined"
                                    onClick={() => handleSignVerify()}
                                    sx={{ backgroundColor: "white", border: "1px solid #ccc", fontSize: "14px" }}
                                >
                                    Click here to Sign
                                </Button>
                            </div>
                        </StyledTableCell>

                        {/* Signature by Line Captain */}
                        <StyledTableCell colSpan={2} align="center">Signature by Line Captain</StyledTableCell>
                        <StyledTableCell colSpan={1} align="center">
                            <input
                                type="text"
                                value={assessmentData[0]?.signByLineCaptain}
                                onChange={(e) =>
                                    handleValueChange(0, "signByLineCaptain", null, null, e.target.value)
                                }
                                className="field-style"
                                style={{ width: "150px", padding: "5px" }}
                            />
                        </StyledTableCell>
                        {/* Signature by Module Controller */}
                        <StyledTableCell colSpan={2} align="center">Signature by Module Controller</StyledTableCell>
                        <StyledTableCell colSpan={1} align="center">
                            <input
                                type="text"
                                value={assessmentData[0]?.signByModuleController}
                                onChange={(e) =>
                                    handleValueChange(0, "signByModuleController", null, null, e.target.value)
                                }
                                className="field-style"
                                style={{ width: "150px", padding: "5px" }}
                            />
                        </StyledTableCell>
                        <StyledTableCell colSpan={4} ></StyledTableCell>
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

export default MemorySecond;

