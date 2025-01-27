import React, { useState, useEffect, useRef } from "react";
import {
    Grid,
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Card,
    CardContent,
    Typography,
    CardHeader,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from '@mui/icons-material/Cancel';
import FormikTextField from "../Common/commonTextField";
import { AddNewEmployeeApi } from "../../redux/action/adminAction";
import { showToast } from "../Toast/toastServices";
import { useNavigate } from "react-router-dom";


const AddNewEmployee = () => {

    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const navigate = useNavigate()
    const isFirstRender = useRef(true);
    const previousDetail = useRef(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

    const { addNewEmployeeDetail } = useSelector((state) => state.admin);

    // Cleanup effect for camera stream
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const initialValues = {
        traineeName: "",
        ccNumber: "",
        qualification: "",
        branch: "",
        designation: "",
        yearOfPass: "",
        grade: "",
        collegeName: "",
        joiningDate: "",
        photo: null,
        previouslyWorked: false,
        previousCcNumber: '',
    };

    const validationSchema = Yup.object({

        traineeName: Yup.string().required("Trainee Name is required"),
        ccNumber: Yup.string()
            .matches(/^\d+$/, " CC Number must contain only numbers")
            .required(' CC Number is required'),
        qualification: Yup.string().required("Qualification is required"),
        previouslyWorked: Yup.boolean(),
        previousCcNumber: Yup.string().when('previouslyWorked', {
            is: true,
            then: () => Yup.string()
                .matches(/^\d+$/, "Previous CC Number must contain only numbers")
                .required('Previous CC Number is required'),
            otherwise: () => Yup.string()
        }),
        branch: Yup.string().required("Branch is required"),
        designation: Yup.string().required("Designation is required"),
        yearOfPass: Yup.number()
            .required("Year of Pass is required")
            .typeError("Must be a valid number"),
        grade: Yup.string().required("Grade is required"),
        collegeName: Yup.string().required("College Name is required"),
        joiningDate: Yup.date().required("Joining Date is required"),
        photo: Yup.mixed().required("Photo is required"),

    });

    // const handleFileUpload = (event, setFieldValue, setFieldTouched) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    //         const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

    //         if (!isValidType || !isValidSize) {
    //             showToast(
    //                 isValidType
    //                     ? "File too large. Max size is 2MB."
    //                     : "Invalid file type. Only JPG/PNG allowed.",
    //                 "error"
    //             );
    //             setFieldValue("photo", null); // Reset the value if invalid
    //             setFieldTouched("photo", true); // Mark as touched to trigger error message
    //             return;
    //         }

    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result); // Set the preview image
    //             setFieldValue("photo", file); // Update Formik's field value
    //             setFieldTouched("photo", true); // Mark the field as touched
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleFileUpload = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
            const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit
    
            if (!isValidType || !isValidSize) {
                showToast(
                    isValidType
                        ? "File too large. Max size is 2MB."
                        : "Invalid file type. Only JPG/PNG allowed.",
                    "error"
                );
                setFieldValue("photo", null); // Reset the value if invalid
                return;
            }
    
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview image
                setFieldValue("photo", file); // Update Formik's field value
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (isCameraOpen && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

    const handleOpenCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"  // Use front camera
                }
            });

            setStream(mediaStream);
            setIsCameraOpen(true);

            // Directly set the stream to video element
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            showToast("Unable to access the camera. Please check permissions.", "error");
        }
    };

    const handleCapturePhoto = async (setFieldValue, setFieldTouched) => {
        if (!videoRef.current) {
            showToast("Video element not found.", "error");
            return;
        }
        try {
            // Create a canvas element
            const canvas = document.createElement("canvas");
            const video = videoRef.current;

            // Set canvas dimensions to match the video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
            const imageUrl = URL.createObjectURL(blob);

            // Create a File object from the blob
            const file = new File([blob], "captured-photo.jpg", { type: 'image/jpeg' });

            // Update preview and form
            setImagePreview(imageUrl);
            setFieldValue("photo", file); // Ensure the file is set to the Formik field
            setFieldTouched("photo", true); // Mark as touched

            // Close camera after capture
            closeCamera();
        } catch (error) {
            console.error('Photo capture error:', error);
            // showToast("Failed to capture photo", "error");
        }
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "values")
        setSubmitting(true);

        try {
            // Initialize the body object for the request
            const body = {
                train: [{
                    Branch: values.branch,
                    cc_no: values.ccNumber,
                    college_name: values.collegeName,
                    Designation: values.designation,
                    grade: values.grade,
                    date_of_joining: values.joiningDate,
                    qualification: values.qualification,
                    name: values.traineeName,
                    year_passed_out: values.yearOfPass,
                    previous_cc_no: values.previouslyWorked ? values.previousCcNumber : null,
                    previously_worked: values.previouslyWorked,
                    // photo:values
                }]
            };

            // Check if photo is provided and convert to base64
            if (values.photo) {
                const base64Photo = await convertToBase64(values.photo);
                // Add the base64 photo inside the 'train' array object
                body.train[0].photo = base64Photo; // Add the base64 photo to the 'train' array object
            } else {
                console.log("No photo selected!");
            }

            // Send the body data to the AP
            await dispatch(AddNewEmployeeApi(body));
            resetForm();
            setImagePreview(null); // Reset the image preview after submission

        } catch (error) {
            console.error('Error submitting form:', error);
        }
        finally {
            setSubmitting(false); // Reset the submitting state
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // Skip the first render
            previousDetail.current = addNewEmployeeDetail; // Set initial value
            return;
        }

        if (
            addNewEmployeeDetail &&
            addNewEmployeeDetail !== previousDetail.current
        ) {
            previousDetail.current = addNewEmployeeDetail; // Update previous detail

            if (addNewEmployeeDetail?.status === "Success") {
                showToast("Employee added successfully!", "success");
                navigate("/adminDashboard/home");
            } else if (addNewEmployeeDetail?.status === "Failed") {
                showToast(addNewEmployeeDetail?.message, "error");
            }
        }
    }, [addNewEmployeeDetail, navigate]);

    // Helper function to convert image file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result); // The result is the base64 string
            };

            reader.onerror = (error) => {
                reject(error); // If there was an error during conversion
            };
        });
    };

    // Rest of your component remains the same...
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // minHeight: '100vh', // Ensure it's centered even on a full page
                    mb: 5, // Add padding to the container
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        boxShadow: 3, // Slightly stronger shadow for better depth
                        borderRadius: 3, // Rounded corners for a soft look
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth hover effect
                        '&:hover': {
                            transform: 'scale(1.02)', // Slightly enlarge on hover
                            boxShadow: 6, // Enhance the shadow on hover
                        },
                    }}
                >

                    <CardHeader
                        sx={{
                            backgroundColor: '#1976d2',
                            padding: '12px 24px',
                            textAlign: 'center',
                        }}
                        title={
                            <Typography
                                variant="h6" // Specify a variant that fits your design
                                sx={{
                                    fontSize: '18px', // Reduces the font size
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    color: 'white',
                                }}
                            >
                                Trainees Progress Card
                            </Typography>
                        }
                    />
                    <CardContent sx={{
                        padding: '24px', // Padding around the content
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2, // Spacing between content sections
                    }}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, setFieldValue, isSubmitting, handleChange, touched, errors }) =>
                            (
                                <Form>
                                    <Grid container spacing={2}>
                                        {/* Other form fields remain the same... */}
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="traineeName" label="Trainee Name" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="ccNumber" label="CC Number" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="qualification" label="Qualification" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="branch" label="Branch" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="designation" label="Designation" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="yearOfPass" label="Year of Pass" type="number" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="grade" label="Grade" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField name="collegeName" label="College Name" />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormikTextField
                                                name="joiningDate"
                                                label="Joining Date"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box
                                                sx={{
                                                    border: "1px dashed #ccc",
                                                    p: 2,
                                                    borderRadius: 2,
                                                    textAlign: "center",
                                                    minHeight: "100px", // Ensures the container has a minimum height
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {imagePreview ? (
                                                    <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            style={{
                                                                maxWidth: "90%",  // Reduced size for better UI
                                                                height: "auto",
                                                                maxHeight: "120px",  // Reduced height for better proportion
                                                                objectFit: "contain", // Keeps the image's aspect ratio
                                                            }}
                                                        />
                                                        <Button
                                                            color="error"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                setFieldValue("photo", null);
                                                            }}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 5,
                                                                right: 5,
                                                                zIndex: 1,
                                                                padding: '2px', // Makes the button smaller
                                                            }}
                                                        >
                                                            <CancelIcon />
                                                        </Button>
                                                    </Box>
                                                ) : isCameraOpen ? (
                                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                        <video
                                                            ref={videoRef}
                                                            autoPlay
                                                            playsInline
                                                            muted
                                                            style={{
                                                                width: '90%',  // Reduced width for video preview
                                                                maxWidth: '200px',  // Slightly smaller size for better UI
                                                                height: 'auto',
                                                                objectFit: 'cover',
                                                                backgroundColor: '#000',
                                                            }}
                                                        />
                                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleCapturePhoto(setFieldValue)}
                                                                startIcon={<CameraAltIcon />}
                                                            >
                                                                Capture Photo
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={closeCamera}
                                                            >
                                                                Close Camera
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleOpenCamera}
                                                            startIcon={<CameraAltIcon />}
                                                        >
                                                            Open Camera
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            id="photo-upload"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => handleFileUpload(e, setFieldValue)}
                                                        />
                                                        <label htmlFor="photo-upload">
                                                            <Button
                                                                variant="contained"
                                                                component="span"
                                                                startIcon={<UploadIcon />}
                                                            >
                                                                Upload Photo
                                                            </Button>
                                                        </label>
                                                    </Box>
                                                )}
                                            </Box>

                                            {touched.photo && errors.photo && (
                                                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                                    {errors.photo}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.previouslyWorked}
                                                        onChange={(e) => {
                                                            setFieldValue('previouslyWorked', e.target.checked);
                                                            // Clear previous CC number if unchecked
                                                            if (!e.target.checked) {
                                                                setFieldValue('previousCcNumber', '');
                                                            }
                                                        }}
                                                        color="primary"
                                                    />
                                                }
                                                label="Have you worked at Lucas TVS before?"
                                            />
                                        </Grid>

                                        {/* Conditional Previous CC Number field */}
                                        {values.previouslyWorked && (
                                            <Grid item xs={12} md={6}>
                                                <FormikTextField
                                                    name="previousCcNumber"
                                                    label="Previous CC Number"
                                                    // helperText="Please enter your previous CC Number"
                                                    value={values.previousCcNumber}
                                                    onChange={handleChange} // Make sure handleChange is available from Formik
                                                    error={touched.previousCcNumber && Boolean(errors.previousCcNumber)}
                                                    helperText={touched.previousCcNumber && errors.previousCcNumber}
                                                />
                                            </Grid>
                                        )}

                                    </Grid>
                                    <Box mt={3}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            startIcon={isSubmitting && <CircularProgress size={20} />}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </Box >
        </>


    );
};

export default AddNewEmployee;