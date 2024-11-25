import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/system";
import { SafetyTrainingHead, SafetyTrainingValues } from "../../utils/constants/tableHead";

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

const SafetyTrainingTable = ({ onValueChange }) => {
  const [tableData, setTableData] = useState(SafetyTrainingValues);

  const handleInputChange = (rowIndex, field, value) => {
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(updatedData);
    if (onValueChange) {
      onValueChange(updatedData);
    }
  };

  const isEditable = (columnId) => {
    return !["topic", "totalScore", "targetScore"].includes(columnId);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                      type="text"
                      className="p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={row[column.id]}
                      onChange={(e) => handleInputChange(rowIndex, column.id, e.target.value)}
                      style={{
                        width: column.id === "remarks" ? "100%" : "80px",
                      }}
                    />
                  ) : (
                    row[column.id] || "-"
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SafetyTrainingTable;
