import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import FormikTextField from '../Common/commonTextField';
import { AddNewEmployeeApi } from '../../redux/action/adminAction';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../Toast/toastServices';
import { useNavigate } from 'react-router-dom';

const AddNewEmployee = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { addNewEmployeeDetail } = useSelector((state) => state.admin);

    const initialValues = {
        traineeName: '',
        ccNumber: '',
        qualification: '',
        branch: "",
        designation: '',
        yearOfPass: '',
        grade: '',
        collegeName: "",
        joiningDate: '',
        // photo: null,
    };

    const validationSchema = Yup.object({
        traineeName: Yup.string().required('Trainee Name is required'),
        ccNumber: Yup.string().matches(/^\d+$/, "CC Number must contain only numbers") // Regex to allow only numeric values
            .required('CC Number is required'),
        qualification: Yup.string().required('Qualification is required'),
        branch: Yup.string().required('Branch is required'),
        designation: Yup.string().required('Designation is required'),
        yearOfPass: Yup.number()
            .positive('Year of Pass must be a positive number')
            .integer('Year of Pass must be an integer')
            .required('Year of Pass is required'),
        grade: Yup.string().required('Grade is required'),
        joiningDate: Yup.date().required('Joining Date is required'),
        collegeName: Yup.string().required('Joining Date is required'),
        // photo: Yup.mixed().required('Photo is required'),
    });

    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = (error) => reject(error);
    //     });
    // };

    const handleSubmit = async (e) => {
        console.log(e, "TEST");
        // const photoBase64 = e.photo ? await convertToBase64(e.photo) : null;
        const payload = {
            train: [
                {
                    name: e.traineeName,
                    cc_no: e.ccNumber,
                    Designation: e.designation,
                    date_of_joining: e.joiningDate,
                    grade: e.grade,
                    year_passed_out: e.yearOfPass,
                    qualification: e.qualification,
                    Branch: e.branch,
                    college_name: e.collegeName,
                    photo: "", // you might want to handle photo upload separately if needed
                }
            ]
        };
        dispatch(AddNewEmployeeApi(payload))
        navigate("/adminDashboard/home")
    };

    useEffect(() => {
        if (addNewEmployeeDetail?.status === 'success') {
            showToast("Employee registered successfully!", "success");
        } else if (addNewEmployeeDetail?.status === 'error') {
            showToast("Failed to register the employee. Please try again.", "error");
        }
    }, [addNewEmployeeDetail]);

    return (
        <Container maxWidth="md">
            <Paper
                elevation={3}
                sx={{
                    mt: 4,
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box my={2}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            mb: 3,
                        }}
                    >
                        Trainees Progress Card
                    </Typography>
                </Box>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="traineeName" label="Trainee Name" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="ccNumber" label="CC Number" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="grade" label="Grade" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="designation" label="Designation" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="qualification" label="Qualification" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="branch" label="Branch" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField
                                        name="collegeName"
                                        label="College Name"
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField
                                        name="yearOfPass"
                                        label="Year of Pass"
                                        type="number"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormikTextField
                                        name="joiningDate"
                                        label="Joining Date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => setFieldValue('photo', event.currentTarget.files[0])}
                                        style={{
                                            display: 'block',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            backgroundColor: '#f9f9f9',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={3}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        padding: '10px 0',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    Register New Trainee
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};

export default AddNewEmployee;
