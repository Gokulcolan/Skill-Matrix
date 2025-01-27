import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { generateQRApi, SearchEmployeApi } from "../../redux/action/adminAction";
import { useDispatch, useSelector } from "react-redux";
import QRPopup from "../Modal/qrModal";
import { showToast } from "../Toast/toastServices";

const EmployeeTableList = ({ columns = [], data = [], title, onRowClick, rowKey }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isFirstRender = useRef(true);
  const previousDetail = useRef(null);

  const [open, setOpen] = useState(false);
  const [qrData, setQRData] = useState(null);
  const [loading, setLoading] = useState(false);


  const { generateQRDetail } = useSelector((state) => state.admin)


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

  const handleGenerateQR = async (row) => {
    // Reset qrData before making the API call
    setQRData(null); // Clear old data

    const payload = [{ cc_no: row.cc_no }];
    try {
      await dispatch(generateQRApi(payload));
    } catch (error) {
      console.log("Error generating QR", error);
    }
  };

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false; // Set to false after the first render
      previousDetail.current = generateQRDetail; // Set initial value
      return; // Skip showing toast on the first render
    }

    // Show toast only if updateEmployeeDetail has changed
    if (
      generateQRDetail &&
      generateQRDetail !== previousDetail.current
    ) {
      previousDetail.current = generateQRDetail; // Update the previous value
      if (generateQRDetail?.status === "success") {
        setQRData(generateQRDetail);
        showToast(generateQRDetail?.message, "success");
        setLoading(false);
      } else if (generateQRDetail?.status === "fail") {
        showToast(generateQRDetail?.message, "error");
        setLoading(false);
      }
    }
  }, [generateQRDetail]);


  // Use useEffect to watch the qrData and open the modal when qrData is updated
  useEffect(() => {
    if (qrData) {
      setOpen(true); // Open the modal when qrData is set
    }
  }, [qrData]); // This will run whenever qrData changes



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
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleView(row)}
                        color="primary"
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleGenerateQR(row)}
                        color="primary"
                      >
                        Generate QR
                      </Button>
                    </Box>

                  ) : column.id === "photo" ? ( // Render photo if column.id is "photo"
                    row[column.id] && ( // Ensure there's a value for photo
                      (row[column.id].startsWith("http") || row[column.id].startsWith("data:image")) ? (
                        <img
                          src={row[column.id]} // Use the URL or Base64 data directly
                          alt="Employee"
                          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                      ) : (
                        <img
                          src="placeholder-image-url.png" // Fallback to placeholder if the data is invalid
                          alt="Placeholder"
                          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                      )
                    )
                  ) : (
                    row[column.id] || "-" // Render regular data
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow >
          ))}
        </TableBody>
      </Table>
      <QRPopup
        openModal={open}
        setOpenModal={() => setOpen(false)}
        data={qrData}
      // resetData={resetData} // Reset data when modal is closed
      />
    </TableContainer>
  );
};

export default EmployeeTableList;
