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
  Select,
  MenuItem,
  tableCellClasses,
} from "@mui/material";
import { borderBottom, styled } from "@mui/system";
import { SafetyTrainingHead } from "../../utils/constants/tableDatas";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployeDetailApi } from "../../redux/action/adminAction";
import { showToast } from "../Toast/toastServices";
import SignPopup from "../Modal/signVerify";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// const StyledTableCell = styled(TableCell)(({ theme,index  }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#1976d2",
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: "rgb(0 0 0 / 4%)",
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

const StyledTableCell = styled(TableCell)(({ theme, columnIndex }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
    borderBottom: columnIndex === 0 ? "1px solid rgba(224, 224, 224, 1)" : "none",
    padding: "15px 16px",
    textAlign: "center", // Center text in header
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: columnIndex % 2 === 0 ? "rgb(240, 240, 240)" : "rgb(255, 255, 255)",
    borderBottom: columnIndex === 0 ? "1px solid rgb(197, 196, 196)" : "none",
    padding: "15px 16px",
    transition: "background-color 0.3s ease", // Smooth transition on hover
    textAlign: "center", // Center text in header
  },
  // Hover Effect for Table Cells
  // "&:hover": {
  //   backgroundColor: "rgb(210, 210, 210)", // Light hover effect
  // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  // Add hover effect on the row
  "&:hover": {
    backgroundColor: "rgb(245, 245, 245)", // Hover color for row
  },
  // Add some spacing and shadow to rows
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
}));



const SafetyTrainingTable = ({ data: initialData, onValueChange, cc, date, place }) => {

  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const { updateEmployeeDetail } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const isFirstRender = useRef(true);
  const previousDetail = useRef(null);

  // Initialize table data from props
  useEffect(() => {
    if (initialData) {
      setTableData(initialData);
    }
  }, [initialData]);

  // Handle input changes in the table
  const handleInputChange = (rowIndex, field, value) => {
    if (field === "actual_score" && isNaN(value)) {
      return; // Prevent non-numeric input
    }
    const updatedData = tableData.map((row, index) =>
      index === rowIndex ? { ...row, [field]: value } : row
    );
    setTableData(updatedData);
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
      date: date,
      place: place,
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
              <StyledTableRow key={rowIndex}>
                {SafetyTrainingHead.map((column, columnIndex) => (
                  <StyledTableCell key={column.id} align="left" columnIndex={columnIndex}>
                    {column.id === "sign_by_trainee" && rowIndex === 4 ? (
                      row[column.id] ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={row[column.id].startsWith("http") || row[column.id].startsWith("data:image") ? row[column.id] : "https://via.placeholder.com/150"} // Use the image URL or Base64 data if available, fallback to placeholder
                            alt="Profile"
                            className="signature-img"
                          />
                          <span style={{ color: "green", fontWeight: "bold" }}>Signed</span>
                          <CheckCircleIcon color="success" />
                        </div>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() => handleSignVerify(rowIndex)}
                        >
                          Click here to Sign
                        </Button>
                      )
                    ) : column.id === "status_" && rowIndex === 4 ? (
                      <Select
                        value={row[column.id] || ""}
                        onChange={(e) =>
                          handleInputChange(rowIndex, column.id, e.target.value)
                        }
                        className="field-drop-style"
                        fullWidth
                      >
                        <MenuItem value="Pass">Pass</MenuItem>
                        <MenuItem value="Fail">Fail</MenuItem>
                      </Select>
                    ) : isEditable(column.id) && rowIndex === 4 ? (
                      <input
                        className="field-style"
                        type={column.id === "actual_score" ? "number" : "text"}
                        value={row[column.id] || ""}
                        onChange={(e) =>
                          handleInputChange(rowIndex, column.id, e.target.value)
                        }
                      />
                    ) : (
                      row[column.id] || ""
                    )
                    }
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
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
      </TableContainer>

      <SignPopup
        openModal={open}
        setOpenModal={() => setOpen(false)}
        onSave={handleSaveSignature}
      />

    </>
  );
};

export default SafetyTrainingTable;
