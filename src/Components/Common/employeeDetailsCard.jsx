import React from 'react'

const EmployeeDetailsCard = () => {
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
                            <p>Name - </p>
                            <p>CC NO - </p>
                            <p>Designation - </p>
                        </div>
                        <div className="details-column">
                            <p>Date Of Joining - </p>
                            <p>Grade - </p>
                            <p>Year Passed Out - </p>
                        </div>
                        <div className="details-column">
                            <p>College Name - </p>
                            <p>Branch -</p>
                            <p>Qualification -</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetailsCard