import React, { useEffect } from 'react'
import { resetEmployeeData } from '../../redux/slice/adminSlice';
import { useDispatch } from 'react-redux';

const EmployeeDetailsCard = ({ employeeDetails }) => {
    
    const dispatch = useDispatch()

    // Clear data when leaving the component
    useEffect(() => {
        return () => {
            dispatch(resetEmployeeData());
        };
    }, [dispatch]);

    if (!employeeDetails || !employeeDetails.bio || employeeDetails.bio.length === 0) {
        return (
            <div>
                <div className="profile-card">
                    <div className="profile-image-section">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Profile"
                            className="profile-img"
                        />
                    </div>
                    <div className="profile-details-section">
                        <div className="details-grid">
                            <div className="details-column">
                                <p><b>Name</b> - </p>
                                <p><b>CC NO</b> - </p>
                                <p><b>Designation</b> - </p>
                            </div>
                            <div className="details-column">
                                <p><b>Date Of Joining</b> - </p>
                                <p><b>Grade </b>- </p>
                                <p><b>Year Passed Out</b> -  </p>
                            </div>
                            <div className="details-column">
                                <p><b>College Name</b> -  </p>
                                <p><b>Branch </b>- </p>
                                <p><b>Qualification </b>- </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const bio = employeeDetails?.bio[0]; // Access the first item in the bio array


    return (
        <div>
            <div className="profile-card">
                <div className="profile-image-section">
                    {bio?.photo ? ( // Check if there is a profile image URL or Base64 data
                        <img
                            src={bio.photo.startsWith("http") || bio.photo.startsWith("data:image") ? bio.photo : "https://via.placeholder.com/150"} // Use the image URL or Base64 data if available, fallback to placeholder
                            alt="Profile"
                            className="profile-img"
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/150" // Fallback image
                            alt="Profile"
                            className="profile-img"
                        />
                    )}
                </div>
                <div className="profile-details-section">
                    <div className="details-grid">
                        <div className="details-column">
                            <p><b>Name</b> - {bio?.name_}</p>
                            <p><b>CC NO</b> - {bio?.cc_no}</p>
                            <p><b>Designation</b> - {bio?.designation}</p>
                            {bio?.is_existing === "1" ?
                                <p className="highlight"><b>Previously Worked in LucasTVS</b> - Yes</p> : ""}
                        </div>
                        <div className="details-column">
                            <p><b>Date Of Joining</b> - {bio?.date_of_joining}</p>
                            <p><b>Grade</b> - {bio?.grade}</p>
                            <p><b>Year Passed Out</b> - {bio?.year_passed_out}</p>
                            {bio?.existing_cc_no ?
                                <p className="highlight"><b>Previous CC NO</b> - {bio?.existing_cc_no}</p> : " "}
                        </div>
                        <div className="details-column">
                            <p><b>College Name</b> - {bio?.college_name}</p>
                            <p><b>Branch</b> - {bio?.branch}</p>
                            <p><b>Qualification</b> - {bio?.qualification}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetailsCard