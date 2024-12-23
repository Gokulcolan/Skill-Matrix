import React, { useEffect, useState } from "react";
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
import { styled } from "@mui/system";
import { SafetyTrainingHead } from "../../utils/constants/tableDatas";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployeDetailApi } from "../../redux/action/adminAction";
import { resetEmployeeData } from "../../redux/slice/adminSlice";
import { showToast } from "../Toast/toastServices";
import SignPopup from "../Modal/signVerify";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const SafetyTrainingTable = ({ data: initialData, onValueChange, cc }) => {
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const { updateEmployeeDetail } = useSelector((state) => state.admin);
  const dispatch = useDispatch();


  console.log(tableData, "tableData")
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
    }];

    dispatch(updateEmployeDetailApi(payload));
  };
  // Show toast messages based on API response
  useEffect(() => {
    if (updateEmployeeDetail?.Status === "success") {
      showToast(updateEmployeeDetail?.Messege, "success");
    } else if (updateEmployeeDetail?.Status === "error") {
      showToast("Failed to register the employee. Please try again.", "error");
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
              {SafetyTrainingHead.map((column) => (
                <StyledTableCell key={column.id} align="left">
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {SafetyTrainingHead.map((column) => (
                  <StyledTableCell key={column.id} align="left">
                    {column.id === "sign_by_trainee" ? (

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
                    ) : column.id === "status_" ? (
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
                    ) : isEditable(column.id) ? (
                      <input
                        className="field-style"
                        type={column.id === "actual_score" ? "number" : "text"}
                        value={row[column.id] || ""}
                        onChange={(e) =>
                          handleInputChange(rowIndex, column.id, e.target.value)
                        }
                      />
                    ) : (
                      row[column.id] || "Pending"
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="success"
          sx={{ margin: "16px 0" }}
          onClick={handleSave}
        >
          Save
        </Button>
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
