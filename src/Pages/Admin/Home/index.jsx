import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { EmployeeListHead } from '../../../utils/constants/tableDatas'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import EmployeeTableList from '../../../Components/EmployeeList/employeeTableList'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEmployeeDetailsApi } from '../../../redux/action/adminAction'
import CustomTextField from '../../../Components/Common/customTextField'
import Loader from '../../../Components/Loader/Loader';

const Home = () => {

    const { getAllEmployeeDetail } = useSelector((state) => state.admin);
    const [searchInput, setSearchInput] = useState(""); // State for search input
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleNewEmployee = () => {
        navigate("/adminDashboard/addNewEmployee");
    };

    useEffect(() => {
        dispatch(getAllEmployeeDetailsApi()); // Fetch fresh data
        setLoading(true);
    }, [dispatch]);


    useEffect(() => {
        if (getAllEmployeeDetail) {
            setFilteredData(getAllEmployeeDetail?.Full_table || []);
            setLoading(false);
        }
    }, [getAllEmployeeDetail]);

    const handleSearch = () => {
        if (!searchInput.trim()) {
            // Reset to full data if search input is empty
            setFilteredData(getAllEmployeeDetail?.Full_table || []);
        } else {
            // Filter data based on search input
            const filtered = getAllEmployeeDetail?.Full_table.filter((item) =>
                Object.values(item) // Search through all values in the object
                    .join(" ") // Combine values into a single string
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleChange = (e) => {
        setSearchInput(e.target.value); // Update search input state
    };

    return (

        <div>

            <Box sx={{ textAlign: "center", marginTop: "30px" }} className="bg-img">
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "'Roboto', sans-serif",
                        color: "white",
                        fontSize: "2rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        position: "relative", // Ensure the text stays above the overlay
                        zIndex: 3, // Ensure the text is on top of the overlay
                        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)", // Add a shadow for brightness
                    }}
                >
                    Welcome to the Lucas TVS Skill Analyser Portal
                    <br />
                    Empowering Trainees for Success.
                </Typography>
            </Box>

            <br />

            <Box sx={{ display: "flex", justifyContent: "space-between", padding: "5px 40px" }}>
                <div>
                    <h2>Employee List</h2>
                </div>
            </Box>

            <Box sx={{ padding: "0px 40px" }}>
                <div className="search-container1">
                    <div>
                        <Button
                            variant="contained"
                            className="default-btn"
                            onClick={handleNewEmployee}
                        >
                            + Add New Employee
                        </Button>
                    </div>
                    <div>
                        <CustomTextField
                            name="CC_No"
                            label="Search CC No"
                            type="text"
                            customStyles={{
                                width: "200px",
                                margin: "0 10px",
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                style: {
                                    height: "30px",
                                    padding: "20px",
                                },
                            }}
                            onChange={handleChange}
                        />
                        <button className="default-btn" onClick={handleSearch}>
                            <SearchIcon sx={{ fontSize: "16px", fontWeight: "600" }} /> Search
                        </button>
                    </div>
                </div>
            </Box>

            
            <Box className="tablePad">
                {loading ? (
                    <Loader /> // Replace with your loader component
                ) : (
                    <EmployeeTableList columns={EmployeeListHead} data={filteredData} />
                )}
            </Box>

        </div>

    );
};


export default Home