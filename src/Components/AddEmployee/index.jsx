import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import FormikTextField from '../Common/commonTextField';

const AddNewEmployee = () => {
    const initialValues = {
        traineeName: '',
        ccNumber: '',
        qualification: '',
        designation: '',
        yearOfPass: '',
        grade: '',
        joiningDate: '',
        photo: null,
    };

    const validationSchema = Yup.object({
        traineeName: Yup.string().required('Trainee Name is required'),
        ccNumber: Yup.string().required('CC Number is required'),
        qualification: Yup.string().required('Qualification is required'),
        designation: Yup.string().required('Designation is required'),
        yearOfPass: Yup.number()
            .positive('Year of Pass must be a positive number')
            .integer('Year of Pass must be an integer')
            .required('Year of Pass is required'),
        grade: Yup.string().required('Grade is required'),
        joiningDate: Yup.date().required('Joining Date is required'),
        photo: Yup.mixed().required('Photo is required'),
    });

    const handleSubmit = (values) => {
        console.log(values);
    };

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
                    {({ setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2}>
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
                                    <FormikTextField name="designation" label="Designation" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField
                                        name="yearOfPass"
                                        label="Year of Pass"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormikTextField name="grade" label="Grade" />
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
                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                        color="secondary"
                                    >
                                        Upload Photo
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(event) =>
                                                setFieldValue('photo', event.currentTarget.files[0])
                                            }
                                        />
                                    </Button>
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
