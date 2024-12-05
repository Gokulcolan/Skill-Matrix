// import React, { useEffect, useState } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     TableFooter,
//     tableCellClasses,
//     Button,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { CycleGamesExerciseData } from "../../utils/constants/tableHead";
// import { useDispatch } from "react-redux";
// import { updateCycleGamesApi } from "../../redux/action/adminAction";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses?.head}`]: {
//         backgroundColor: "#1976d2",
//         color: "#fff",
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     [`&.${tableCellClasses?.body}`]: {
//         fontSize: 14,
//         textAlign: "center",
//     },
//     [`&.${tableCellClasses?.footer}`]: {
//         backgroundColor: "#1976d2",
//         color: "#fff",
//         fontWeight: "bold",
//         textAlign: "center",
//     },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     "&:nth-of-type(odd)": {
//         backgroundColor: "rgb(0 0 0 / 4%)",
//     },
//     "&:last-child td, &:last-child th": {
//         border: 0,
//     },
// }));

// const CycleTimeGamesTable = ({ data, cc }) => {
//     console.log(data,"data2323")

//     const dispatch = useDispatch()

//     // Initialize assessmentData with incoming data prop
//     const [assessmentData, setAssessmentData] = useState(
//         data.map((exercise) => ({
//             ...exercise,
//             attempts: Array(5).fill({ pf_status: "", mistakes: "", cycle_time: "" }),
//             status_: exercise.status_ || "",
//             signByTrainee: exercise.Signature_by_Trainee || "",
//             signByProcessCoach: exercise.Signature_by_Process_Coach || "",
//             signByTrainingOfficer: exercise.Signature_by_Training_Officer || "",
//         }))
//     );

//     const handleValueChange = (exerciseIndex, field, attemptIndex, value) => {
//         setAssessmentData((prevData) => {
//             const updatedData = [...prevData];
//             if (attemptIndex !== null) {
//                 // Update attempt-specific fields
//                 updatedData[exerciseIndex].attempts[attemptIndex] = {
//                     ...updatedData[exerciseIndex].attempts[attemptIndex],
//                     [field]: value,
//                 };
//             } else {
//                 // Update non-attempt-specific fields
//                 updatedData[exerciseIndex][field] = value;
//             }
//             return updatedData;
//         });
//     };

//     const handleSave = () => {
//         const payload = {
//             "Cycle_games": assessmentData.map((exercise) => (
//                 {
//                     task_id: exercise.task_id,
//                     // name: exercise.name,
//                     attempts: exercise.attempts.map((attempt, index) => ({
//                         attempt_number: index + 1,
//                         pf_status: attempt.pf_status || null,
//                         mistakes: attempt.mistakes || null,
//                         cycle_time: attempt.cycle_time || null,
//                     })),
//                     status_: exercise.status_ || null,
//                     sign: {
//                         Signature_by_Trainee: exercise.signByTrainee || null,
//                         Signature_by_Process_Coach: exercise.signByProcessCoach || null,
//                         Signature_by_Training_Officer: exercise.signByTrainingOfficer || null,
//                     }
//                 }
//             )),
//             "cc_no": cc
//         };
//         console.log(payload, "payload")
//         dispatch(updateCycleGamesApi(payload))
//     }

//     return (
//         <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
//             <Table stickyHeader>
//                 <TableHead>
//                     <TableRow>
//                         <StyledTableCell rowSpan={2}>Exercise Name</StyledTableCell>
//                         <StyledTableCell rowSpan={2}>Default Cycle Time</StyledTableCell>
//                         <StyledTableCell colSpan={5}>Skill Assessment (Attempts)</StyledTableCell>
//                         <StyledTableCell rowSpan={2}>Status</StyledTableCell>
//                     </TableRow>
//                     <TableRow>
//                         {[1, 2, 3, 4, 5].map((attempt) => (
//                             <StyledTableCell key={attempt}>{`Attempt ${attempt}`}</StyledTableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {assessmentData.map((exercise, index) => (
//                         <StyledTableRow key={index}>
//                             <StyledTableCell>{exercise.name}</StyledTableCell>
//                             <StyledTableCell>{exercise.dct || "-"}</StyledTableCell>
//                             {exercise.attempts.map((attempt, attemptIndex) => (
//                                 <StyledTableCell key={attemptIndex}>
//                                     <div className="flex flex-col">
//                                         <input
//                                             type="text"
//                                             placeholder="PF"
//                                             value={attempt.pf_status}
//                                             onChange={(e) =>
//                                                 handleValueChange(index, "pf_status", attemptIndex, e.target.value)
//                                             }
//                                             className="mb-1 p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             style={{ marginBottom: "5px" }}
//                                         />
//                                         <input
//                                             type="number"
//                                             placeholder="Mistakes"
//                                             value={attempt.mistakes}
//                                             onChange={(e) =>
//                                                 handleValueChange(index, "mistakes", attemptIndex, e.target.value)
//                                             }
//                                             className="mb-1 p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             style={{ marginBottom: "5px" }}
//                                         />
//                                         <input
//                                             type="text"
//                                             placeholder="Cycle Time"
//                                             value={attempt.cycle_time}
//                                             onChange={(e) =>
//                                                 handleValueChange(index, "cycle_time", attemptIndex, e.target.value)
//                                             }
//                                             className="p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                 </StyledTableCell>
//                             ))}
//                             <StyledTableCell>
//                                 <input
//                                     type="text"
//                                     value={exercise.status_}
//                                     onChange={(e) =>
//                                         handleValueChange(index, "status_", null, e.target.value)
//                                     }
//                                     className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </StyledTableCell>
//                         </StyledTableRow>
//                     ))}
//                 </TableBody>
//                 <TableFooter>
//                     <TableRow>
//                         <StyledTableCell>Signature by Trainee</StyledTableCell>
//                         <StyledTableCell colSpan={2}>
//                             <input
//                                 type="text"
//                                 value={assessmentData[0]?.signByTrainee}
                                
//                                 onChange={(e) =>
//                                     handleValueChange(0, "signByTrainee", null, e.target.value)
//                                 }
//                                 className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </StyledTableCell>
//                         <StyledTableCell>Signature by Process Coach</StyledTableCell>
//                         <StyledTableCell colSpan={2}>
//                             <input
//                                 type="text"
//                                 value={assessmentData[0]?.signByProcessCoach}
//                                 onChange={(e) =>
//                                     handleValueChange(0, "signByProcessCoach", null, e.target.value)
//                                 }
//                                 className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </StyledTableCell>
//                         <StyledTableCell>Signature by Training Officer</StyledTableCell>
//                         <StyledTableCell colSpan={2}>
//                             <input
//                                 type="text"
//                                 value={assessmentData[0]?.signByTrainingOfficer}
//                                 onChange={(e) =>
//                                     handleValueChange(0, "signByTrainingOfficer", null, e.target.value)
//                                 }
//                                 className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </StyledTableCell>
//                     </TableRow>
//                 </TableFooter>
//             </Table>
//             <br />
//             <Button
//                 variant="contained"
//                 color="success"
//                 sx={{ marginBottom: "16px" }}
//                 onClick={handleSave}
//             >
//                 Save
//             </Button>
//         </TableContainer>
//     );
// };

// export default CycleTimeGamesTable;

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
import { useDispatch } from "react-redux";
import { updateCycleGamesApi } from "../../redux/action/adminAction";

// Custom styled TableCell for headers and body cells
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

const CycleTimeGamesTable = ({ data, cc }) => {
    console.log(data,"datadata")
    const dispatch = useDispatch();

    // Initialize assessmentData with incoming data prop
    const [assessmentData, setAssessmentData] = useState(
        data?.map((exercise) => ({
            ...exercise,
            attempts: Array(5).fill({ pf_status: "", mistakes: "", cycle_time: "" }),
            status_: exercise.status_ || "",
            signByTrainee: exercise.Signature_by_Trainee || "",
            signByProcessCoach: exercise.Signature_by_Process_Coach || "",
            signByTrainingOfficer: exercise.Signature_by_Training_Officer || "",
        }))
    );

    useEffect(() => {
        console.log(JSON.stringify(assessmentData, null, 2), "assessmentData (inside useEffect)");
    }, [assessmentData]);

    // Handle value change for fields (either attempts or other fields)
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
                // Update non-attempt-specific fields (status and signatures)
                updatedData[exerciseIndex][field] = value;
            }
            return updatedData;
        });
    };

    // Save function to prepare data and dispatch API action
    const handleSave = () => {
        const payload = {
            "Cycle_games": assessmentData.map((exercise) => ({
                task_id: exercise.task_id,
                attempts: exercise.attempts.map((attempt, index) => ({
                    attempt_number: index + 1,
                    pf_status: attempt.pf_status || null,
                    mistakes: attempt.mistakes || null,
                    cycle_time: attempt.cycle_time || null,
                })),
                status_: exercise.status_ || null,
                sign: {
                    Signature_by_Trainee: exercise.signByTrainee || null,
                    Signature_by_Process_Coach: exercise.signByProcessCoach || null,
                    Signature_by_Training_Officer: exercise.signByTrainingOfficer || null,
                },
            })),
            "cc_no": cc,
        };
        console.log(payload, "payload");
        dispatch(updateCycleGamesApi(payload));
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
                    {assessmentData?.map((exercise, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell>{exercise.name}</StyledTableCell>
                            <StyledTableCell>{exercise.dct || "-"}</StyledTableCell>
                            {exercise.attempts.map((attempt, attemptIndex) => (
                                <StyledTableCell key={attemptIndex}>
                                    <div className="flex flex-col">
                                        <input
                                            type="text"
                                            placeholder="PF"
                                            value={attempt.pf_status}
                                            onChange={(e) =>
                                                handleValueChange(index, "pf_status", attemptIndex, e.target.value)
                                            }
                                            className="mb-1 p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ marginBottom: "5px" }}
                                        />
                                        <input
                                            type="number"
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
                                            value={attempt.cycle_time}
                                            onChange={(e) =>
                                                handleValueChange(index, "cycle_time", attemptIndex, e.target.value)
                                            }
                                            className="p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>
                                <input
                                    type="text"
                                    value={exercise.status_}
                                    onChange={(e) =>
                                        handleValueChange(index, "status_", null, e.target.value)
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
