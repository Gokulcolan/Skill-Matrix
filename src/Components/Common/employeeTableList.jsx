import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses } from "@mui/material";
import styled from "@emotion/styled";

const EmployeeTableList = ({ columns = [], data = [], title, onRowClick, rowKey }) => {
  const StyledTableCell = styled(TableCell)({
    "&.MuiTableCell-head": {
      backgroundColor: "#1976d2", 
      color: "#fff",           // Fallback white
    },
    "&.MuiTableCell-body": {
      fontSize: 14,
    },
  });

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "rgb(0 0 0 / 4%)",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  return (
    <TableContainer component={Paper} sx={{ marginTop: "20px", maxHeight: "400px" }}>
      <Table stickyHeader aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <StyledTableCell key={index} align={column.align || "left"} sx={{ fontWeight: "bold" }}>
                {column.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow
              key={row[rowKey] || index} // Use unique row key, fallback to index
              onClick={() => onRowClick && onRowClick(row)}
              hover
              sx={{ cursor: "pointer" }}
            >
              {columns.map((column, columnIndex) => (
                <StyledTableCell key={columnIndex} align={column.align || "left"}>
                  {row[column.field] || "-"}
                </StyledTableCell>
              ))}
            </StyledTableRow >
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTableList;
