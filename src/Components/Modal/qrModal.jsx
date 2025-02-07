
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Button } from "@mui/material";
import html2canvas from "html2canvas"; // Import html2canvas
import Logo from "../../Assets/Images/tvs-lucas-logo.png"; // Add path to your logo image

const QRPopup = ({ openModal, setOpenModal, data }) => {
    // Function to handle downloading the card as an image
    const handleDownload = () => {
        const element = document.getElementById("downloadCard"); // Reference the card container
        html2canvas(element).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "card.png"; // Set the filename for the download
            link.click();
        });
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    // Safe access to the data
    const personalInfo = data?.personal_info || {}; // Safely access personal_info
    const photo = personalInfo.photo || "/path/to/default-photo.jpg"; // Default photo if none exists
    const name = personalInfo.name || "John Doe"; // Default name if none exists
    const ccNo = personalInfo.cc_no || "N/A"; // Default CCNO if none exists
    const doj = personalInfo.date_of_joining || "N/A";
    const qrCode = data?.QR_code || ""; // Default QR Code if none exists

    return (
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: "10px",
                    boxShadow: 24,
                    textAlign: "center",
                    p: 4,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <h2 style={{ margin: 0 }}>LEVEL ANALYSER QR</h2>
                    <IconButton
                    onClick={handleClose}
                        // onClick={() => setOpenModal(false)}
                        sx={{
                            padding: 0,
                            color: "red", // Default red color
                            transition: "all 0.3s ease-in-out", // Smooth transition for hover effects
                            "&:hover": {
                                color: "white",
                                backgroundColor: "red", // Red background on hover
                                boxShadow: "0 4px 10px rgba(255, 0, 0, 0.5)", // Red shadow effect
                            },
                            borderRadius: "50%", // Circular hover effect
                        }}
                        aria-label="close"
                    >
                        <CloseIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </Box>
                <Box
                    id="downloadCard" // Give the card a unique ID to capture it
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        padding: "20px",
                        backgroundColor: "#dce9f7",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    {/* Logo */}
                    <img
                        src={Logo} // Path to your logo
                        alt="Logo"
                        style={{
                            width: "250px",
                            height: "50px",
                            marginBottom: "20px",
                        }}
                    />

                    {/* Profile Picture */}
                    <img
                        src={photo}
                        alt="Profile"
                        style={{
                            width: "90px",
                            height: "90px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "16px",
                        }}
                    />

                    {/* Name */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {name}
                    </Typography>

                    {/* CCNO */}
                    <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                        CC NO - {ccNo}
                    </Typography>

                    <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                        DOJ - {doj}
                    </Typography>

                    {/* QR Code */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            //   backgroundColor: "#eaeaea",
                            padding: "8px",
                            borderRadius: "8px",
                            marginTop: "16px",
                            width: "100%",
                        }}
                    >
                        {qrCode ? (
                            <img
                                src={`data:image/png;base64,${qrCode}`}
                                alt="QR Code"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                }}
                            />
                        ) : (
                            <Typography variant="body2" sx={{ color: "grey" }}>
                                No QR Code Available
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Download Button */}
                <Button
                    onClick={handleDownload}
                    sx={{
                        marginTop: 2,
                        backgroundColor: "green",

                        color: "white",
                        "&:hover": {
                            backgroundColor: "darkgreen",
                        },
                    }}
                >
                    Download Card
                </Button>
            </Box>
        </Modal>
    );
};

export default QRPopup;
