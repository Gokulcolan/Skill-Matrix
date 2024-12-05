import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses, Button } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { SearchEmployeApi } from "../../redux/action/adminAction";
import { useDispatch } from "react-redux";

const EmployeeTableList = ({ columns = [], data = [], title, onRowClick, rowKey }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  const handleView = (row) => {
    const payload = [
      {
        "cc_no": row.cc_no
      }
    ]
    dispatch(SearchEmployeApi(payload))
    navigate(`/adminDashboard/safety/`);
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: "20px", maxHeight: "400px", overflowY: "auto" }}>
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
                  {column.id === "action" ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleView(row)}
                      color="primary"
                    >
                      View
                    </Button>
                  ) : (
                    row[column.id] || "-"
                  )}
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
