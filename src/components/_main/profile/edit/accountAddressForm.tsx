import React from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  DialogActions,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "react-query";
import * as api from "src/services";
import { useSelector } from "react-redux";
import countries from "src/components/_main/checkout/countries.json";
import { toast } from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";
import _ from "lodash";
//
// ----------------------------------------------------------------------

interface addressforDatashowing {
  address: any;
  city: any;
  state: any;
  country: any;
  zip: any;
  phone: any;
  active: false;
  billingAddress: false;
  billingAddressField: any;
  billingCity: any;
  billingState: any;
  billingZip: any;
  billingCountry: any;
}

export default function AccountAddressForm({ ...props }) {
  const { onClose, address, apicall } = props;
  console.log(address, "this is in the address edits ");
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("common");
  const { user } = useSelector(({ user }: { user: any }) => user);
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
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || countries[0].label,
      zip: address?.zip || "",
      phone: address?.phone || "",
      active: false,
      billingAddress: false,
      billingAddressField: address?.billingAddressField || "",
      billingCity: address?.billingCity || "",
      billingState: address?.billingState || "",
      billingZip: address?.billingZip || "",
      billingCountry: address?.billingCountry || countries[0].label,
    },
    validationSchema: NewAddressSchema,
    onSubmit: async () => {
      setloading(true);
      try {
        if (address) {
          handleUpdate();
        } else {
          handleCreate();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const { mutate } = useMutation(["update"], api.updateAddress, {
    onSuccess: (data) => {
      setloading(false);
      toast.success(t("Address Update Successfully!"));
      location.reload();
      apicall((prev: any) => ({ ...prev, apicall: !prev.apicall }));

      formik.resetForm();
      onClose();
    },
  });

  const { mutate: createMutate } = useMutation(["create"], api.createAddress, {
    onSuccess: () => {
      setloading(false);
      toast.success(t("Address Added Successfully!"));
      debugger;
      apicall((prev: any) => !prev);
      window.location.reload();
      formik.resetForm();
      onClose();
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

  // Function to clear billing address fields and associated errors
  const clearBillingAddress = () => {
    setFieldValue("billingAddressField", "");
    setFieldValue("billingCity", "");
    setFieldValue("billingState", "");
    setFieldValue("billingZip", "");
    setFieldValue("billingCountry", "");
  };

  const handleCreate = () => {
    const id = _.uniqueId();
    const data = {
      ...values,
      _id: id,
      id: user?._id,
    };
    createMutate(data);
  };

  const handleUpdate = () => {
    const data = {
      ...values,
      _id: address._id,
      id: user?._id,
    };
    mutate(data);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={{ xs: 2, sm: 3 }} sx={{ p: 3 }}>
          <Typography variant="subtitle1">{t("Shipping-Address")}</Typography>
          <TextField
            fullWidth
            label={t("Address")}
            {...getFieldProps("address")}
            error={Boolean(touched.address && errors.address)}
            helperText={
              touched.address && errors.address && (errors.address as string)
            }
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label={t("Phone")}
              {...getFieldProps("phone")}
              type="number"
              error={Boolean(touched.phone && errors.phone)}
              helperText={
                touched.phone && errors.phone && (errors.phone as string)
              }
            />

            <TextField
              fullWidth
              label={t("City")}
              {...getFieldProps("city")}
              error={Boolean(touched.city && errors.city)}
              helperText={
                touched.city && errors.city && (errors.city as string)
              }
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label={t("State")}
              {...getFieldProps("state")}
              error={Boolean(touched.state && errors.state)}
              helperText={
                touched.state && errors.state && (errors.state as string)
              }
            />
            <TextField
              fullWidth
              label={t("Pin Code")}
              type="number"
              {...getFieldProps("zip")}
              error={Boolean(touched.zip && errors.zip)}
              helperText={touched.zip && errors.zip && (errors.zip as string)}
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
            helperText={
              touched.country && errors.country && (errors.country as string)
            }
          >
            {countries.map((option) => (
              <option key={option.code} value={option.label}>
                {option.label}
              </option>
            ))}
          </TextField>{" "}
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
                    clearBillingAddress(); // Clear billing address fields
                  }
                }}
              />
            }
            label={t(
              "Clicking this checkbox will copy the shipping address to the billing address"
            )}
            sx={{ mt: 3 }}
          />
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
                  touched.billingAddressField &&
                  errors.billingAddressField &&
                  (errors.billingAddressField as string)
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label={t("City")}
                  {...getFieldProps("billingCity")}
                  error={Boolean(touched.billingCity && errors.billingCity)}
                  helperText={
                    touched.billingCity &&
                    errors.billingCity &&
                    (errors.billingCity as string)
                  }
                />

                <TextField
                  fullWidth
                  label={t("State")}
                  {...getFieldProps("billingState")}
                  error={Boolean(touched.billingState && errors.billingState)}
                  helperText={
                    touched.billingState &&
                    errors.billingState &&
                    (errors.billingState as string)
                  }
                />

                <TextField
                  fullWidth
                  label={t("Pin Code")}
                  {...getFieldProps("billingZip")}
                  type="number"
                  error={Boolean(touched.billingZip && errors.billingZip)}
                  helperText={
                    touched.billingZip &&
                    errors.billingZip &&
                    (errors.billingZip as string)
                  }
                />
              </Stack>
              <TextField
                select
                fullWidth
                label={t("billing-country")}
                placeholder={t("billing-country")}
                {...getFieldProps("billingCountry")}
                SelectProps={{ native: true }}
                error={Boolean(touched.billingCountry && errors.billingCountry)}
                helperText={
                  touched.address &&
                  errors.address &&
                  errors.billingCountry &&
                  (errors.billingCountry as string)
                }
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
              <Checkbox checked={values.active} {...getFieldProps("active")} />
            }
            label="Use this address as default."
            sx={{ mt: 3 }}
          />
        </Stack>
        <Divider />
        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Save Address
          </LoadingButton>
          <Button
            type="button"
            color="inherit"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
