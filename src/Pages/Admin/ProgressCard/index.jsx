import React, { useEffect, useState } from 'react'
import CustomTextField from '../../../Components/Common/customTextField'
import SearchIcon from '@mui/icons-material/Search';
import TableFilters from '../../../Components/Common/tableheadingFilters'
import { SearchEmployeApi } from '../../../redux/action/adminAction';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../../Components/Toast/toastServices';
import EmployeeDetailsCard from '../../../Components/EmployeeDetails/employeeDetailsCard';
import { resetEmployeeData } from '../../../redux/slice/adminSlice';

const ProgessDetails = () => {

    const [inputValue, setInputValue] = useState()

    const { searchEmployeeDetail } = useSelector((state) => state.admin);

    const dispatch = useDispatch()

    const handleSearch = () => {

        if (!inputValue) {
            alert("Please enter a valid CC Number");
            return;
        }

        const payload = [
            {
                "cc_no": inputValue
            }
        ]

        console.log(payload, "test")

        dispatch(SearchEmployeApi(payload))

    }
    useEffect(() => {
        if (searchEmployeeDetail) {
            showToast(searchEmployeeDetail.message, "success");
        }
        //  else if (addNewEmployeeDetail?.status === 'error') {
        //     showToast("Failed to register the employee. Please try again.", "error");
        // }
    }, [searchEmployeeDetail]);

    const handleChange = (e) => {
        setInputValue(e.target.value)
    }


    return (

        <div className="tablePad">
            <div>
                <h2 style={{ float: "left" }}>Trainee Progress Details</h2>
                <div className='search-container'>
                    <CustomTextField
                        name="CC_No"
                        label="Search CC No"
                        type="text"
                        customStyles={{ width: "300px", margin: "0px 20px" }}
                        onChange={handleChange}
                    />
                    <button className="default-btn" onClick={handleSearch}><SearchIcon sx={{ fontSize: "16px", fontWeight: "600" }} /> Search</button>
                </div>
            </div>
            <EmployeeDetailsCard employeeDetails={searchEmployeeDetail} />
            <br />
            <TableFilters employeeTrainingDetails={searchEmployeeDetail} />
        </div>
    )
}

export default ProgessDetails