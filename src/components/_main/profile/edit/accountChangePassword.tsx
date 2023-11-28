import React from "react";
import * as Yup from "yup";

import { useFormik, Form, FormikProvider } from "formik";
// material
import { Stack, Card, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// redux
import { useSelector } from "react-redux";
import * as api from "src/services";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("profile");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be between 6 and 16 characters")
      .max(16, "Password must be between 6 and 16 characters")
      .required("New Password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setloading(true);
      const data = {
        password: values.oldPassword,
        newPassword: values.newPassword,
        id: user._id,
      };
      mutate(data);
    },
  });

  const { mutate } = useMutation(api.changerPassword, {
    onSuccess: ({ data }) => {
      console.log(data,"change message data")
      setloading(false);
      formik.resetForm();
      toast.success(t(data.message));
    },
    onError: (err: any) => {
      setloading(false);
      // const message = JSON.stringify(err.response.data.message);
      toast.error(t(err.response.data.message));
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="overline" sx={{ color: "text.secondary", width: 1 }}>
        Change password
      </Typography>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end" mt={2}>
            <TextField
              {...getFieldProps("oldPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="Old Password"
              error={Boolean(touched.oldPassword && errors.oldPassword)}
              helperText={touched.oldPassword && errors.oldPassword}
            />
            <TextField
              {...getFieldProps("newPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="New Password"
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
            />

            <TextField
              {...getFieldProps("confirmNewPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="Confirm New Password"
              error={Boolean(
                touched.confirmNewPassword && errors.confirmNewPassword
              )}
              helperText={
                touched.confirmNewPassword && errors.confirmNewPassword
              }
            />

            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
