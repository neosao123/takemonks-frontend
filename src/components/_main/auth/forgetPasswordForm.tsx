import { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
// react query
import { useMutation } from "react-query";
// formik
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
  TextField,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EmailIcon from "@mui/icons-material/Email";
// hooks
import useIsMountedRef from "src/hooks/useIsMountedRef";
// api
import * as api from "src/services";
// notification
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ ...props }) {
  const { onSent, onGetEmail, t, setOpenOtp, setdataEmail } = props;
  const isMountedRef = useIsMountedRef();
  const [loading, setloading] = useState(false);
  const { mutate } = useMutation(api.forgetPassword, {
    onSuccess: (data) => {
      console.log(data);
      setdataEmail(data?.updateOtp);
      onSent();
      onGetEmail(data.email);
      toast.success(t("common:email-sent"));
      setloading(false);
      setOpenOtp(true);
    },
    onError: (err: any) => {
      const message = JSON.stringify(err.response.data.message);
      setloading(false);
      toast.error(
        message ? t(JSON.parse(message)) : t("common:something-wrong")
      );
    },
  });

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("Email is not valid"))
      .required(t("Email is required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        setloading(true);

        await mutate(values.email);
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          toast.error(error.message);
        }
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )} */}

          <TextField
            fullWidth
            {...getFieldProps("email")}
            type="email"
            label={t("email-address")}
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

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
          >
            {t("send-email")}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
