import React from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Checkbox from "@mui/material/Checkbox";

// material
import {
  Stack,
  Button,
  Box,
  TextField,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
//
import countries from "./countries.json";
import { useSelector, useDispatch } from "react-redux";

import { onBackStep } from "src/redux/slices/product";
import { setLogin } from "src/redux/slices/user";
import useTranslation from "next-translate/useTranslation";
import { uniqueId } from "lodash";
// ----------------------------------------------------------------------

export default function CheckoutGuestForm({ ...props }) {
  const { onNextStep, onCreateBilling, handleStepBack } = props;
  const { t } = useTranslation("checkout");
  const { checkout } = useSelector(({ product }: { product: any }) => product);
  const { user } = useSelector(({ user }: { user: any }) => user);
  console.log(user, " User Details ");
  console.log("I am checking the checkOut of there datails ", checkout);
  const { billing } = checkout;
  const [loading, setloading] = React.useState(false);
  const dispatch = useDispatch();

  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("State is required"),
    zip: Yup.string().required("Postal code is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: billing?.firstName || "",
      lastName: billing?.lastName || "",
      phone: billing?.phone || "",
      gstNo: billing?.gstNo || "",
      email: billing?.email || "",
      address: billing?.address || "",
      city: billing?.city || "",
      state: billing?.state || "",
      country: billing?.country || countries[0].label,
      zip: billing?.zip || "",
      billingAddress: false,
      billingAddressField: billing?.address || "",
      billingCity: billing?.city || "",
      billingState: billing?.state || "",
      billingZip: billing?.zip || "",
      billingCountry: billing?.country || countries[0].label,
    },
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
      try {
        setloading(true);
        const id = uniqueId();

        if (values.country == values.billingCountry) {
        }
        onCreateBilling({
          _id: id,
          firstName: values.firstName,
          lastName: values.lastName,
          fullName: values.firstName + " " + values.lastName,
          phone: values.phone,
          gstNo: values.gstNo,
          email: values.email,
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

        setloading(false);
        onNextStep();
      } catch (error) {
        console.error(error);
        setloading(false);
      }
    },
  });

  const handleBackStep = () => {
    dispatch(onBackStep());
    handleStepBack();
  };

  const {
    errors,
    values,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <div>
      {/* Your existing content */}
      <a href="/auth/login">
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Login to Complete Order
        </LoadingButton>
      </a>
      <Box mt={2}>
        <Button
          onClick={handleBackStep}
          type="button"
          color="inherit"
          size="small"
          startIcon={<ArrowBackRoundedIcon />}
        >
          {t("back")}
        </Button>
      </Box>
    </div>
  );
}
//  <FormikProvider value={formik}>
//    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
//      <Card>
//        <CardHeader
//          title={<Typography variant="h4">Guest Information</Typography>}
//        />
//        <Stack spacing={{ xs: 2, sm: 3 }} p={3} mt={1}>
//          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//            <TextField
//              fullWidth
//              label="First Name"
//              {...getFieldProps("firstName")}
//              error={Boolean(touched.firstName && errors.firstName)}
//              helperText={touched.firstName && (errors.firstName as string)}
//              type="text"
//            />
//            <TextField
//              fullWidth
//              label="Last Name"
//              {...getFieldProps("lastName")}
//              error={Boolean(touched.lastName && errors.lastName)}
//              helperText={touched.lastName && (errors.lastName as string)}
//              type="text"
//            />
//          </Stack>
//          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//            <TextField
//              fullWidth
//              label="Email"
//              {...getFieldProps("email")}
//              error={Boolean(touched.email && errors.email)}
//              helperText={touched.email && (errors.email as string)}
//            />

//            <TextField
//              fullWidth
//              label="Phone"
//              {...getFieldProps("phone")}
//              error={Boolean(touched.phone && errors.phone)}
//              helperText={touched.phone && (errors.phone as string)}
//              type="number"
//            />
//            <TextField
//              fullWidth
//              label="GstNo"
//              {...getFieldProps("gstNo")}
//              type="text"
//            />
//          </Stack>
//          <Typography variant="body1">Billing Address</Typography>
//          <TextField
//            fullWidth
//            label={t("address")}
//            {...getFieldProps("billingAddressField")}
//            error={Boolean(
//              touched.billingAddressField && errors.billingAddressField
//            )}
//            helperText={
//              touched.billingAddressField &&
//              (errors.billingAddressField as string)
//            }
//          />
//          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//            <TextField
//              fullWidth
//              label={t("Town-City")}
//              {...getFieldProps("billingCity")}
//              error={Boolean(touched.billingCity && errors.billingCity)}
//              helperText={touched.billingCity && (errors.billingCity as string)}
//            />

//            <TextField
//              fullWidth
//              label={t("state")}
//              {...getFieldProps("billingState")}
//              error={Boolean(touched.billingState && errors.billingState)}
//              helperText={
//                touched.billingState && (errors.billingState as string)
//              }
//            />

//            <TextField
//              fullWidth
//              label={t("zip-postal-code")}
//              {...getFieldProps("billingZip")}
//              error={Boolean(touched.billingZip && errors.billingZip)}
//              helperText={touched.billingZip && (errors.billingZip as string)}
//              type="number"
//            />
//          </Stack>
//          <TextField
//            select
//            fullWidth
//            label={t("country")}
//            placeholder={t("country")}
//            {...getFieldProps("billingCountry")}
//            SelectProps={{ native: true }}
//            error={Boolean(touched.billingCountry && errors.billingCountry)}
//            helperText={
//              touched.billingCountry && (errors.billingCountry as string)
//            }
//          >
//            {countries.map((option) => (
//              <option key={option.code} value={option.label}>
//                {option.label}
//              </option>
//            ))}
//          </TextField>

//          <Stack
//            direction="row" // To place the checkbox and shipping address side by side
//            justifyContent="flex-start" // To align items to the start (left side)
//            alignItems="center" // To align items vertically in the center
//            p={3}
//            mt={1}
//          >
//            {/* Billing Address Checkbox */}
//            <Checkbox
//              {...getFieldProps("billingAddress")}
//              color="primary" // You can adjust the color as needed
//              checked={values.billingAddress === true}
//              onChange={(event) => {
//                const newValue = event.target.checked;
//                setFieldValue("billingAddress", newValue);

//                if (newValue) {
//                  // If the checkbox is checked, set shipping address fields to billing address values
//                  setFieldValue("address", values.billingAddressField);
//                  setFieldValue("city", values.billingCity);
//                  setFieldValue("state", values.billingState);
//                  setFieldValue("zip", values.billingZip);
//                  setFieldValue("country", values.billingCountry);
//                } else {
//                  // If the checkbox is unchecked, clear the shipping address fields
//                  setFieldValue("address", "");
//                  setFieldValue("city", "");
//                  setFieldValue("state", "");
//                  setFieldValue("zip", "");
//                  // setFieldValue("country", "");
//                }
//              }}
//            />
//            <Typography variant="body1">Shipping Address</Typography>
//            <Typography variant="body2">
//              ( Clicking this checkbox will copy the shipping address to the
//              billing address.)
//            </Typography>
//          </Stack>
//          {/* Billing Address Fields */}
//          {1 && (
//            <>
//              <TextField
//                fullWidth
//                label={t("address")}
//                {...getFieldProps("address")}
//                error={Boolean(touched.address && errors.address)}
//                helperText={touched.address && (errors.address as string)}
//              />
//              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                <TextField
//                  fullWidth
//                  label={t("Town-City")}
//                  {...getFieldProps("city")}
//                  error={Boolean(touched.city && errors.city)}
//                  helperText={touched.city && (errors.city as string)}
//                />

//                <TextField
//                  fullWidth
//                  label={t("state")}
//                  {...getFieldProps("state")}
//                  error={Boolean(touched.state && errors.state)}
//                  helperText={touched.state && (errors.state as string)}
//                />

//                <TextField
//                  fullWidth
//                  label={t("zip-postal-code")}
//                  {...getFieldProps("zip")}
//                  error={Boolean(touched.zip && errors.zip)}
//                  helperText={touched.zip && (errors.zip as string)}
//                  type="number"
//                />
//              </Stack>
//              <TextField
//                select
//                fullWidth
//                label={t("country")}
//                placeholder={t("country")}
//                {...getFieldProps("country")}
//                SelectProps={{ native: true }}
//                error={Boolean(touched.country && errors.country)}
//                helperText={touched.country && (errors.country as string)}
//              >
//                {countries.map((option) => (
//                  <option key={option.code} value={option.label}>
//                    {option.label}
//                  </option>
//                ))}
//              </TextField>
//            </>
//          )}
//          <LoadingButton
//            type="submit"
//            variant="contained"
//            size="large"
//            loading={loading}
//          >
//            {t("deliver-address")}
//          </LoadingButton>
//        </Stack>
//      </Card>
//      <Box mt={2}>
//        <Button
//          onClick={handleBackStep}
//          type="button"
//          color="inherit"
//          size="small"
//          startIcon={<ArrowBackRoundedIcon />}
//        >
//          {t("back")}
//        </Button>
//      </Box>
//    </Form>
//  </FormikProvider>;
