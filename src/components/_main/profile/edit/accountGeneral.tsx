import React from "react";
import * as Yup from "yup";
import { useCallback } from "react";
import { Form, FormikProvider, useFormik } from "formik";
// material
import {
  Box,
  Grid,
  Card,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Skeleton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import UploadAvatar from "src/components/upload/UploadAvatar";
import * as api from "src/services";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLogin } from "src/redux/slices/user";
import { jwtDecode } from "src/utils/jwt";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { t } = useTranslation("profile");
  const [loadingUpload, setLoadingUpload] = React.useState(false);
  const dispatch = useDispatch();
  const { data, isLoading: profileLoading } = useQuery(
    "user profile",
    api.getUser,
    {
      onSuccess: ({ data }) => {
        setAvatarId(data?.avatar?._id || null);
      },
    }
  );
  const { mutate, isLoading: updateLoading } = useMutation(api.updateUser, {
    onSuccess: (data) => {
      localStorage.removeItem("token");
      localStorage.setItem("token", data.token);
      const updatedUser = jwtDecode(data.token);

      toast.success(t("common:updated-profile"));
      dispatch(setLogin(updatedUser));
    },
  });
  const { mutate: avatarMutate, isLoading: avatarLoading } = useMutation(
    api.singleDeleteFile,
    {
      onSuccess: () => {},
      onError: (error: any) => {
        toast.error(t(error.message));
      },
    }
  );
  const isLoading = profileLoading;
  const user = data?.data || {};
  const [loading, setLoading] = React.useState(100);
  const [avatarId, setAvatarId] = React.useState(null);
  const callbackLoading = useCallback(
    (value: any) => {
      setLoading(value);
    },
    [setLoading]
  );

  let gstNumberRegex = new RegExp(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  );

  const UpdateUserSchema = Yup.object().shape({
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
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .min(10, "Phone Number is Invalid")
      .max(10, "Phone Number is Invalid"),
    gender: Yup.string().required("Gender is required"),
    gst: Yup.string().matches(gstNumberRegex, "Invalid GST Number"),
    about: Yup.string()
      .min(15, "About must be at least 15 characters")
      .max(500, "About not be more than 500 characters"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      photoURL: user?.avatar?.url || "",
      phoneNumber: user?.phone || "",
      gender: user?.gender || "",
      about: user?.about || "",
      gst: user?.gst || "",
      file: "",
      avatar: user?.avatar,
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values: any) => {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: values.firstName + " " + values.lastName,
        phone: values.phoneNumber,
        about: values.about,
        gender: values.gender,
        avatar: values.avatar,
        gst: values.gst,
        id: user._id,
      };
      mutate(data);
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;
  const handleDrop = async (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file) {
      setLoadingUpload(true);
      setFieldValue("file", file);
      setFieldValue("photoURL", {
        ...file,
        preview: URL.createObjectURL(file),
      });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      const config = {
        onUploadProgress: (progressEvent: any) => {
          const { loaded, total } = progressEvent;
          const percentage = Math.floor((loaded * 100) / total);
          callbackLoading(percentage);
        },
      };
      await axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          config
        )
        .then(({ data }) => {
          setFieldValue("avatar", {
            _id: data.public_id,
            url: data.secure_url,
          });
        })
        .then(() => {
          avatarId && avatarMutate({ _id: avatarId });
          setLoadingUpload(false);
        });
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 11.8, px: 3, textAlign: "center" }}>
              {isLoading || avatarLoading || loadingUpload ? (
                <Stack alignItems="center">
                  <Skeleton variant="circular" width={142} height={142} />
                  <Skeleton variant="text" width={150} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width={150} />
                </Stack>
              ) : (
                <UploadAvatar
                  accept="image/*"
                  file={values.photoURL}
                  loading={loading}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.photoURL && errors.photoURL)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: "auto",
                        display: "block",
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {3145728}
                    </Typography>
                  }
                />
              )}

              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {touched.photoURL && (errors.photoURL as string)}
              </FormHelperText>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              {isLoading ? (
                <>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} sx={{ mt: "0 !important" }}>
                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                  <Skeleton
                    variant="rectangular"
                    height="125px"
                    width="100%"
                    sx={{ mt: 3 }}
                  />
                </>
              ) : (
                <Stack spacing={{ xs: 2, md: 3 }}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...getFieldProps("firstName")}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={
                        touched.firstName && (errors.firstName as string)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...getFieldProps("lastName")}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={
                        touched.lastName && (errors.lastName as string)
                      }
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      disabled
                      label="Email Address"
                      {...getFieldProps("email")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="GST Number"
                      {...getFieldProps("gst")}
                      error={Boolean(errors.gst)}
                      type="text"
                      helperText={errors.gst as string}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...getFieldProps("phoneNumber")}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      type="number"
                      helperText={
                        touched && errors && (errors.phoneNumber as string)
                      }
                    />
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      placeholder="gender"
                      {...getFieldProps("gender")}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.gender && errors.gender)}
                      helperText={touched.gender && (errors.gender as string)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </TextField>
                  </Stack>
                  <TextField
                    {...getFieldProps("about")}
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={4}
                    label="About"
                    error={Boolean(touched.about && errors.about)}
                    helperText={touched.about && (errors.about as string)}
                  />
                </Stack>
              )}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" height={36} width={124} />
                ) : (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={updateLoading || avatarLoading || loadingUpload}
                  >
                    Save Changes
                  </LoadingButton>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
