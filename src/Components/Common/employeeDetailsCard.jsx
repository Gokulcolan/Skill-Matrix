import React from 'react'

const EmployeeDetailsCard = ({ employeeDetails }) => {
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
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        className="profile-img"
                    />
                </div>
                <div className="profile-details-section">
                    <div className="details-grid">
                        <div className="details-column">
                            <p><b>Name</b> - {bio?.name_}</p>
                            <p><b>CC NO</b> - {bio?.cc_no}</p>
                            <p><b>Designation</b> - {bio?.designation}</p>
                        </div>
                        <div className="details-column">
                            <p><b>Date Of Joining</b> - {bio?.date_of_joining}</p>
                            <p><b>Grade</b> - {bio?.grade}</p>
                            <p><b>Year Passed Out</b> - {bio?.year_passed_out}</p>
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