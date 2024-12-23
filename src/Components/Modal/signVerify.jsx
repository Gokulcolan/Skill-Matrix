import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SignPopup = ({ openModal, setOpenModal, onSave }) => {
    const [signaturePad, setSignaturePad] = useState(null);

    const clearSignature = () => {
        if (signaturePad) {
            signaturePad.clear();
        }
    };

    const saveSignature = () => {
        if (signaturePad && !signaturePad.isEmpty()) {
            const signatureData = signaturePad.toDataURL(); // Base64 string
            onSave(signatureData); // Pass the data back to the parent
            setOpenModal(false); // Close the modal
        } else {
            alert("Please sign before saving!");
        }
    };

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
                    <h2 style={{ margin: 0 }}>Sign Here</h2>
                    <IconButton
                        onClick={() => setOpenModal(false)}
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
                        <CloseIcon sx={{ fontSize: "1.5rem" }} /> {/* Adjusted size for better visibility */}
                    </IconButton>


                </Box>
                <SignatureCanvas
                    ref={(ref) => setSignaturePad(ref)}
                    penColor="black"
                    canvasProps={{
                        width: 550,
                        height: 300,
                        className: "signatureCanvas",
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={clearSignature}
                        sx={{
                            borderColor: "red",
                            color: "red",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            "&:hover": {
                                backgroundColor: "rgba(255, 0, 0, 0.1)",
                                borderColor: "red",
                            },
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        onClick={saveSignature}
                        sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.5)",
                            "&:hover": {
                                backgroundColor: "#155a9e",
                                boxShadow: "0px 6px 15px rgba(25, 118, 210, 0.7)",
                            },
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SignPopup;
