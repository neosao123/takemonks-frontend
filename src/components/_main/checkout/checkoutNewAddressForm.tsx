import React from "react";
import * as Yup from "yup";
import { uniqueId } from "lodash";
import { useFormik, Form, FormikProvider } from "formik";
import useTranslation from "next-translate/useTranslation";
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import countries from "./countries.json";
import { useMutation } from "react-query";
import * as api from "src/services";

import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function CheckoutNewAddressForm({ ...props }) {
  const { open, onClose, onNextStep, onCreateBilling, apicall } = props;
  const { t } = useTranslation("checkout");
  const { user } = useSelector(({ user }: { user: any }) => user);
  const [loading, setLoading] = React.useState(false);

  const { mutate } = useMutation(["create"], api.createAddress, {
    onSuccess: () => {
      setLoading(false);
      toast.success(t("Address Added Successfully!"));
      formik.resetForm();
      apicall((prev: any) => !prev);
      onClose();
      onNextStep();
    },
  });
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const NewAddressSchema = Yup.object().shape({
    address: Yup.string()
      .matches(/^[A-Za-z ,0-9]+$/, "Shipping Address must contain only letters")
      .min(5, "Address must be at least 5 letters")
      .max(150, "Address must not be more than 150 letters")
      .required("Shipping Address is required"),
    city: Yup.string()
      .matches(/^[A-Za-z ]+$/, "City must contain only letters")
      .required("City is required")
      .min(2, "City must be at least 2 letters")
      .max(25, "City must not be more than 25 letters"),
    state: Yup.string()
      .matches(/^[A-Za-z ]+$/, "State must contain only letters")
      .required("State is required")
      .min(2, "State must be at least 2 letters")
      .max(25, "State must not be more than 25 letters"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required(t("Phone is required"))
      .min(10, "Phone number is not valid")
      .max(10, "Phone number is not valid"),
    country: Yup.string().required("Country is required"),
    zip: Yup.string()
      .matches(/^\d+$/, "Pin Code must contain only digits")
      .required("Pin Code is required")
      .min(6, "Pin Code is not valid")
      .max(6, "Pin Code is not valid"),
  });

  const BillingAddressSchema = Yup.object().shape({
    billingAddressField: Yup.string()
      .matches(/^[A-Za-z ,0-9]+$/, "Billing Address must contain only letters")
      .min(5, "Address must be at least 5 letters")
      .max(150, "Address must not be more than 150 letters")
      .required("Billing Address is required"),
    billingCity: Yup.string()
      .matches(/^[A-Za-z ]+$/, "City must contain only letters")
      .required("City is required")
      .min(2, "City must be at least 2 letters")
      .max(25, "City must not be more than 25 letters"),
    billingState: Yup.string()
      .matches(/^[A-Za-z ]+$/, "State must contain only letters")
      .required("State is required")
      .min(2, "State must be at least 2 letters")
      .max(25, "State must not be more than 25 letters"),
    billingZip: Yup.string()
      .matches(/^\d+$/, "Pin Code must contain only digits")
      .required("Pin Code is required")
      .min(6, "Pin Code is not valid")
      .max(6, "Pin Code is not valid"),
    billingCountry: Yup.string().required("Country is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: "",
      city: "",
      state: "",
      country: countries[0].label,
      zip: "",
      phone: "",
      active: false,
      billingAddress: false,
      billingAddressField: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
      billingCountry: countries[0].label,
    },
    validationSchema: Yup.object().shape({
      ...NewAddressSchema.fields,
      billingAddress: Yup.boolean(),
      ...BillingAddressSchema.fields,
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const id = uniqueId();
        onCreateBilling({
          _id: id,
          receiver: user?.name,
          phone: values.phone || user?.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          zip: values.zip,
          billingAddressField: values.billingAddressField || values.address,
          billingCity: values.billingCity || values.city,
          billingState: values.billingState || values.state,
          billingZip: values.billingZip || values.zip,
          billingCountry: values.billingCountry || values.country,
        });
        handleCreate(id);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  const handleCreate = async (id: any) => {
    const data = {
      ...values,
      _id: id,
      id: user?._id,
    };
    await mutate(data);
  };

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 3 }} p={3}>
            <Typography variant="subtitle1">{t("Shipping-Address")}</Typography>
            <TextField
              fullWidth
              label={t("Address")}
              {...getFieldProps("address")}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label={t("Phone")}
                {...getFieldProps("phone")}
                type="number"
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
              />

              <TextField
                fullWidth
                label={t("City")}
                {...getFieldProps("city")}
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city && errors.city}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label={t("State")}
                {...getFieldProps("state")}
                error={Boolean(touched.state && errors.state)}
                helperText={touched.state && errors.state}
              />
              <TextField
                fullWidth
                label={t("Pin Code")}
                type="number"
                {...getFieldProps("zip")}
                error={Boolean(touched.zip && errors.zip)}
                helperText={touched.zip && errors.zip}
              />
            </Stack>

            <TextField
              select
              fullWidth
              label={t("Country")}
              placeholder={t("country")}
              {...getFieldProps("country")}
              SelectProps={{ native: true }}
              error={Boolean(touched.country && errors.country)}
              helperText={touched.country && errors.country}
            >
              {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.billingAddress}
                  {...getFieldProps("billingAddress")}
                  color="primary"
                  onChange={(event) => {
                    const newValue = event.target.checked;
                    setFieldValue("billingAddress", newValue);

                    if (newValue) {
                      setFieldValue("billingAddressField", values.address);
                      setFieldValue("billingCity", values.city);
                      setFieldValue("billingState", values.state);
                      setFieldValue("billingZip", values.zip);
                      setFieldValue("billingCountry", values.country);
                    } else {
                      setFieldValue("billingAddressField", "");
                      setFieldValue("billingCity", "");
                      setFieldValue("billingState", "");
                      setFieldValue("billingZip", "");
                      setFieldValue("billingCountry", "");
                    }
                  }}
                />
              }
              label={t(
                "Clicking this checkbox will copy the shipping address to the billing address"
              )}
              sx={{ mt: 3 }}
            />
            {/* Billing Address Fields */}
            {1 && (
              <>
                <Typography variant="subtitle1">
                  {t("Billing-Address")}
                </Typography>
                <TextField
                  fullWidth
                  label={t("Address")}
                  {...getFieldProps("billingAddressField")}
                  error={Boolean(
                    touched.billingAddressField && errors.billingAddressField
                  )}
                  helperText={
                    touched.billingAddressField && errors.billingAddressField
                  }
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label={t("City")}
                    {...getFieldProps("billingCity")}
                    error={Boolean(touched.billingCity && errors.billingCity)}
                    helperText={touched.billingCity && errors.billingCity}
                  />

                  <TextField
                    fullWidth
                    label={t("State")}
                    {...getFieldProps("billingState")}
                    error={Boolean(touched.billingState && errors.billingState)}
                    helperText={touched.billingState && errors.billingState}
                  />

                  <TextField
                    fullWidth
                    label={t("Pin Code")}
                    {...getFieldProps("billingZip")}
                    type="number"
                    error={Boolean(touched.billingZip && errors.billingZip)}
                    helperText={touched.billingZip && errors.billingZip}
                  />
                </Stack>
                <TextField
                  select
                  fullWidth
                  // label={t("billing-country")}
                  // placeholder={t("billing-country")}S
                  {...getFieldProps("billingCountry")}
                  SelectProps={{ native: true }}
                  error={Boolean(
                    touched.billingCountry && errors.billingCountry
                  )}
                  helperText={touched.billingCountry && errors.billingCountry}
                >
                  {countries.map((option) => (
                    <option key={option.code} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.active}
                  {...getFieldProps("active")}
                />
              }
              label={t("address-as-default")}
              sx={{ mt: 3 }}
            />
            {/* <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
            >
              {t("deliver-address")}
            </LoadingButton> */}
          </Stack>
          <Divider />
          <DialogActions>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {t("deliver-address")}
            </LoadingButton>
            <Button
              type="button"
              color="inherit"
              variant="outlined"
              onClick={onClose}
            >
              {t("cancel")}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
