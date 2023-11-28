import * as Yup from "yup";
import { useState } from "react";
import RouterLink from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useFormik, Form, FormikProvider } from "formik";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import jwtDecode from "jwt-decode";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
//
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import { useMutation } from "react-query";
import * as api from "src/services";
// redux
import { useDispatch } from "react-redux";
import { setLogin } from "src/redux/slices/user";
import toast from "react-hot-toast";
// ----------------------------------------------------------------------

export default function LoginForm() {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const { mutate } = useMutation(api.login, {
    onSuccess: (data) => {
      toast.success(t("login-success"));
      setloading(false);
      localStorage.setItem("token", data.token);
      const newUser = jwtDecode(data.token);
      dispatch(setLogin(newUser));
    },
    onError: (err: any) => {
      const message = JSON.stringify(err.response.data.message);
      toast.error(t(message ? t(JSON.parse(message)) : t("something-wrong")));
      setloading(false);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t("valid-email")).required(t("email-required")),
    password: Yup.string().required(t("password-required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      setloading(true);
      mutate({ email, password });
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
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
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label={t("remember-me")}
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            href="/auth/forget-password"
          >
            {t("forgot-password")}
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          {t("login")}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
