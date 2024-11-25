import React from 'react'
import EmployeeDetailsCard from '../../../Components/Common/employeeDetailsCard'
import CustomTextField from '../../../Components/Common/customTextField'
import SearchIcon from '@mui/icons-material/Search';
import TableFilters from '../../../Components/Common/tableheadingFilters'

const ProgessDetails = () => {
    return (
        <div className="tablePad">
            <div>
                <h2 style={{float:"left"}}>Trainee Progress Details</h2>
                <div className='search-container'>
                    <CustomTextField
                        name="CC_No"
                        label="Search CC No"
                        type="text"
                        customStyles={{ width: "300px", margin: "0px 20px" }}
                    />
                    <button className="default-btn"><SearchIcon sx={{ fontSize: "16px", fontWeight: "600" }} /> Search</button>
                </div>
            </div>
            <EmployeeDetailsCard />
            <br />
            <TableFilters />
        </div>
    )
}

export default ProgessDetails