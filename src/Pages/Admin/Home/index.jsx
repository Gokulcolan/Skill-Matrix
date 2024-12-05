import { Box, Button, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { EmployeeListHead } from '../../../utils/constants/tableHead'
import { useNavigate } from 'react-router-dom'
import EmployeeTableList from '../../../Components/Common/employeeTableList'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEmployeeDetailsApi } from '../../../redux/action/adminAction'

const Home = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    
    const { getAllEmployeeDetail } = useSelector((state) => state.admin);

    const handleNewEmployee = () => {
        navigate("/adminDashboard/addNewEmployee")
    }

    useEffect(() => {
        dispatch(getAllEmployeeDetailsApi())
    }, [dispatch])


    return (
        <div>
            <Box sx={{ textAlign: "center", marginTop: "50px" }}>
                <Typography
                    variant="h3" // You can use h1, h2, h3, etc., depending on your design requirements
                    sx={{
                        fontWeight: "bold",
                        fontFamily: "'Roboto', sans-serif", // You can change the font family to match your design
                        color: "#303972", // Dark color for the heading
                        fontSize: "2rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase", // Makes it more formal and prominent
                        padding: "20px",
                        backgroundColor: "#F0F0F0", // Light background color to make the text pop
                        borderRadius: "8px", // Rounded corners for a more modern look
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
                    }}
                >
                    Welcome to the Lucas TVS Skill Analyser Portal
                    <br />
                    Empowering Trainees for Success.
                </Typography>
            </Box>
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between", padding: "20px 40px" }}>
                <div>
                    <h2>Employee List</h2>
                </div>
                <div>
                    <Button variant="contained" color="success" onClick={handleNewEmployee}>
                        Add New Employee
                    </Button>
                </div>
            </Box>
            <Box className="tablePad" >
                <EmployeeTableList columns={EmployeeListHead}  data={getAllEmployeeDetail?.Full_table || []} />
            </Box>
        </div>
    )
}

export default Home