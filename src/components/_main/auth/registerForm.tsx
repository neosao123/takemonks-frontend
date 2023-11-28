import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/router";

// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

//icons
import PersonIcon from "@mui/icons-material/Person";
import FemaleIcon from "@mui/icons-material/Female";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import MaleIcon from "@mui/icons-material/Male";
// utils
import { useFormik, Form, FormikProvider } from "formik";

// api
import { useMutation } from "react-query";
import * as api from "src/services";

// redux
import { useDispatch } from "react-redux";
import { setLogin } from "src/redux/slices/user";
// jwt
import jwtDecode from "jwt-decode";
import useTranslation from "next-translate/useTranslation";
import { toast } from "react-hot-toast";
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { t } = useTranslation("register");
  const dispatch = useDispatch();

  const [loading, setloading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const { mutate } = useMutation(api.register, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success(t("common:account-created"));
      const newUser = jwtDecode(data.token);
      dispatch(setLogin(newUser));
      setloading(false);
    },
    onError: (err: any) => {
      const message = JSON.stringify(err.response.data.message);
      toast.error(
        t(message ? t(JSON.parse(message)) : t("common:something-wrong"))
      );
      setloading(false);
    },
  });

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+gmail\.com$/;
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
    .required("First Name is required")
    .matches(/^[A-Za-z]+$/, "First Name must contain only letters")
    .min(3, "First Name must be at least 3 characters")
    .max(15, "First Name not be more than 15 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .matches(/^[A-Za-z]+$/, "Last Name must contain only letters")
    .min(3, "Last Name must be at least 3 characters")
    .max(15, "Last Name not be more than 15 characters"),
    email: Yup.string()
      .matches(emailRegex, "Email is not valid")
      .email("Email must be a valid email address")
      .required(t("email-is-required")),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone Number is not valid")
      .required("Phone Number is required")
      .min(10, "Phone Number is Invalid")
      .max(10, "Phone Number is Invalid"),
    password: Yup.string()
      .required(t("password-required"))
      .min(6, "Password must be between 6 and 16 characters")
      .max(16, "Password must be between 6 and 16 characters"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "male",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setloading(true);
      mutate(values);
    },
  });

  const { errors, touched, handleSubmit, values, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label={t("First Name")}
              type="text"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label={t("last-name")}
              type="text"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              id="outlined-select-currency"
              select
              fullWidth
              label={t("gender")}
              {...getFieldProps("gender")}
              error={Boolean(touched.gender && errors.gender)}
              helperText={touched.gender && errors.gender}
              inputProps={{
                pattern: "^[a-zA-Z0-9.]+$",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {values.gender === "male" ? <MaleIcon /> : <FemaleIcon />}
                  </InputAdornment>
                ),
              }}
            >
              {["male", "female"].map((option) => (
                <MenuItem key={option} value={option.toLowerCase()}>
                  {t(option)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label={t("Phone")}
              {...getFieldProps("phone")}
              type="number"
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label={t("email-address")}
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label={t("password")}
            {...getFieldProps("password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HttpsIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <RemoveRedEyeRoundedIcon />
                    ) : (
                      <VisibilityOffRoundedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
          >
            {t("register")}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
