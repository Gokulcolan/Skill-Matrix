import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { SafetyTrainingHead } from "../../utils/constants/tableHead";
import { useDispatch } from "react-redux";
import { updateEmployeDetailApi } from "../../redux/action/adminAction";
import { resetEmployeeData } from "../../redux/slice/adminSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses?.head}`]: {
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses?.body}`]: {
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

  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      setTableData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      dispatch(resetEmployeeData());
    };
  }, [dispatch]);


  const handleInputChange = (rowIndex, field, value) => {

    // Validate 'actualScore' to allow only numbers
    if (field === "actual_score" && isNaN(value)) {
      return; // Exit if non-numeric input
    }

    // Update the specific field in the row based on user input
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(updatedData);

    // Optional callback to parent
    if (onValueChange) {
      onValueChange(updatedData);
    }
  };

  console.log(tableData, "tableData")

  const isEditable = (columnId) => {
    // Define non-editable columns
    return !["topic", "totalScore", "targetScore"].includes(columnId);
  };

  const handleSave = () => {
    // Dispatch updated data to the Redux action for saving
    console.log("Updated Table Data:", tableData);
    const payload = [
      {
        "Safety_training": tableData,
        "cc_no": cc
      },
    ]
    dispatch(updateEmployeDetailApi(payload));
  };

  return (
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
                  {isEditable(column.id) ? (
                    <input
                      type={column.id === "actual_score" ? "number" : "text"} // Enforce numeric input for actualScore
                      className="p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={row[column.id] || ""}
                      onChange={(e) => handleInputChange(rowIndex, column.id, e.target.value)}
                      style={{
                        width: column.id === "Remarks" ? "100%" : "80px",
                      }}
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

export default SafetyTrainingTable;
