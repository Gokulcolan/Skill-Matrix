import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  tableCellClasses,
  TableFooter,
} from "@mui/material";
import { styled } from "@mui/system";
import { SafetyTrainingHead } from "../../utils/constants/tableDatas";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployeDetailApi } from "../../redux/action/adminAction";
import { showToast } from "../Toast/toastServices";
import SignPopup from "../Modal/signVerify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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


const SafetyTrainingTable = ({ data: initialData, onValueChange, cc, testdate, place, entryDate, attendance }) => {
 
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [finalStatus, setFinalStatus] = useState("Pending"); // Add finalStatus to state

  const { updateEmployeeDetail } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const isFirstRender = useRef(true);
  const previousDetail = useRef(null);

  // Helper function to process rows and calculate overall score and status
  const processTableData = (data) => {
    const processedData = data.map((row) => {
      const overallScore = Object.keys(row)
        .filter((key) => key.startsWith("actual_score"))
        .reduce((sum, key) => sum + (Number(row[key]) || 0), 0);
      return {
        ...row,
        status_: overallScore >= 40 ? "Pass" : overallScore > 0 ? "Fail" : "Pending",
      };
    });

    // Calculate final status across all rows
    const totalScoreAcrossRows = processedData.reduce(
      (sum, row) => sum + (Number(row.actual_score) || 0),
      0
    );
    const finalStatus = totalScoreAcrossRows >= 40 ? "Pass" : "Fail";
    return { processedData, finalStatus };
  };

  // useEffect to process initial data
  useEffect(() => {
    if (initialData) {
      const { processedData, finalStatus } = processTableData(initialData);
      setTableData(processedData);
      setFinalStatus(finalStatus);
    }
  }, [initialData]);

  const handleInputChange = (rowIndex, field, value) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row, [field]: value };
        if (field.startsWith("actual_score")) {
          // Calculate overall score and update status only if `actual_score` is modified
          const overallScore = Object.keys(updatedRow)
            .filter((key) => key.startsWith("actual_score"))
            .reduce((sum, key) => sum + (Number(updatedRow[key]) || 0), 0);
          updatedRow.status_ = overallScore >= 40 ? "Pass" : "Fail";
        }
        return updatedRow;
      }
      return row;
    });

    // Now handle the additional conditions for rows 3, 4, and 5
    const row3Valid = updatedData[2].actual_score >= 3; // Row index 2 for the 3rd row
    const row4Valid = updatedData[3].actual_score >= 3; // Row index 3 for the 4th row
    const row5Valid = updatedData[4].actual_score >= 5; // Row index 4 for the 5th row

    // Final status calculation remains unaffected
    const totalScoreAcrossRows = updatedData.reduce(
      (sum, row) => sum + (Number(row.actual_score) || 0),
      0
    );
    // Check if overall score is >= 40 and other conditions for rows 3, 4, and 5 are met
    const calculatedFinalStatus =
      totalScoreAcrossRows >= 40 && row3Valid && row4Valid && row5Valid
        ? "Pass"
        : "Fail";

    setTableData(updatedData);
    setFinalStatus(calculatedFinalStatus);

    // Trigger callback if provided
    if (onValueChange) onValueChange(updatedData);
  };

  // Check if a column is editable
  const isEditable = (columnId) => {
    return !["topic", "totalScore", "targetScore"].includes(columnId);
  };

  // Save signature data for the selected row
  const handleSaveSignature = (signatureData) => {
    const updatedData = tableData.map((row, index) =>
      index === currentRow ? { ...row, sign_by_trainee: signatureData } : row
    );
    setTableData(updatedData);
    setCurrentRow(null);
    setOpen(false);
  };

  // Save all data
  const handleSave = () => {
    const payload = [{
      Safety_training: tableData,
      cc_no: cc,
      date: testdate,
      place: place,
      entry_date: entryDate,
      attendance_day1: attendance.day1,
      attendance_day2: attendance.day2,
      attendance_day3: attendance.day3,
      over_all_status: finalStatus,
    }];
    dispatch(updateEmployeDetailApi(payload));
  };

  // Show toast messages based on API response
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Set to false after the first render
      previousDetail.current = updateEmployeeDetail; // Set initial value
      return; // Skip showing toast on the first render
    }

    // Show toast only if updateEmployeeDetail has changed
    if (
      updateEmployeeDetail &&
      updateEmployeeDetail !== previousDetail.current
    ) {
      previousDetail.current = updateEmployeeDetail; // Update the previous value
      if (updateEmployeeDetail?.Status === "success") {
        showToast(updateEmployeeDetail?.Message, "success");
      } else if (updateEmployeeDetail?.Status === "fail") {
        showToast(updateEmployeeDetail?.Message, "error");
      }
    }
  }, [updateEmployeeDetail]);

  // Handle sign verification
  const handleSignVerify = (rowIndex) => {
    setCurrentRow(rowIndex);
    setOpen(true);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {SafetyTrainingHead.map((column, columnIndex) => (
                <StyledTableCell key={column.id} align="left" columnIndex={columnIndex}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              // console.log(row,"row")
              <StyledTableRow key={rowIndex}>
                {SafetyTrainingHead.map((column, columnIndex) => (
                  <StyledTableCell key={column.id} align="left" columnIndex={columnIndex}>
                    {
                      isEditable(column.id) ? (
                        <input
                          className="field-style"
                          type={column.id === "actual_score" ? "number" : "text"}
                          value={row[column.id] || ""}
                          onChange={(e) => handleInputChange(rowIndex, column.id, e.target.value)}
                        />
                      ) : (
                        row[column.id] || ""
                      )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* Status Column */}
              <StyledTableCell>
                {/* <div style={{ display: "flex", justifyContent: "space-around" }}> */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <p>Status</p>
                  <span
                    style={{
                      color:
                        finalStatus === "Pass"
                          ? "white"
                          : finalStatus === "Fail"
                            ? "white"
                            : !finalStatus
                              ? "black"
                              : "white",
                      backgroundColor:
                        finalStatus === "Pass"
                          ? "#14b014"
                          : finalStatus === "Fail"
                            ? "red"
                            : !finalStatus
                              ? "yellow"
                              : "red",
                      fontWeight: "bold",
                      width: "30%",
                      borderRadius: "4px",
                    }}
                    className="field-drop-style"
                  >
                    {finalStatus || "Pending"}
                  </span>
                </div>
                {/* </div> */}
              </StyledTableCell>
              <StyledTableCell>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <p>Remarks</p>
                  <input
                    type="text"
                    value={tableData[0]?.Remarks || ""}
                    onChange={(e) => handleInputChange(0, "Remarks", e.target.value)}
                    className="field-style"
                  />
                </div>
              </StyledTableCell>
              {/* Signatures Columns */}
              <StyledTableCell>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <p>Signature by Trainee</p>
                  <div >
                    {tableData[0]?.sign_by_trainee ? (
                      <img
                        src={
                          tableData[0]?.sign_by_trainee.startsWith("http") ||
                            tableData[0]?.sign_by_trainee.startsWith("data:image")
                            ? tableData[0]?.sign_by_trainee
                            : "https://via.placeholder.com/150"
                        }
                        alt="Trainee Signature"
                        className="signature-img-cycle"
                      />
                    ) : (
                      <Button variant="outlined" onClick={() => handleSignVerify(0)} sx={{ backgroundColor: "white" }}>
                        Click here to Sign
                      </Button>
                    )}
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <p>Signature by Training Officer</p>
                  <input
                    type="text"
                    value={tableData[0]?.sign_by_training_officer || ""}
                    onChange={(e) => handleInputChange(0, "sign_by_training_officer", e.target.value)}
                    className="field-style"
                  />
                </div>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ margin: "16px 0" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </TableContainer >
      <SignPopup
        openModal={open}
        setOpenModal={() => setOpen(false)}
        onSave={handleSaveSignature}
      />
    </>
  );
};

export default SafetyTrainingTable;
