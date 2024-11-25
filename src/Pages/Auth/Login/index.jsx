import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  Link,
  FormControlLabel,
  Paper,
  IconButton,
  InputAdornment,
  Checkbox,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Logo from "../../../Assets/Images/tvs-lucas-logo.png";
import { handleSesssionStorage } from "../../../utils/helperFunctions";
import { useNavigate } from "react-router";
import FormikTextField from "../../../Components/Common/commonTextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const initialValues = {
    Username: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object({
    Username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setErrors }) => {
    if (values.Username === "1" && values.password === "1") {
      handleSesssionStorage("add", "ur", 1);
      navigate("/adminDashboard/home");
    } else {
      const errors = {};
      if (values.Username !== "1") {
        errors.Username = "Invalid username";
      }
      if (values.password !== "1") {
        errors.password = "Invalid password";
      }
      setErrors(errors);
    }
  };

  return (
    <div className="bgLogin">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
            <Box textAlign="center">
              <img src={Logo} alt="TVS Lucas Logo" style={{ maxWidth: "250px" }} />
            </Box>
            <br />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form>
                  <FormikTextField
                    name="Username"
                    label="Username"
                    type="text"
                  />
                  <FormikTextField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="remember"
                          color="primary"
                          checked={values.remember}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      }
                      label="Remember me"
                    />
                    <Link className="forgotPassword" href="#">
                      Forgot password?
                    </Link>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="loginBtn"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
