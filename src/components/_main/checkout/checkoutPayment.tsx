import React, { useState } from "react";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import { useFormik, Form, FormikProvider, FormikProps } from "formik";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// material
import { Grid, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// redux
import { useDispatch, useSelector } from "react-redux";
import { onGotoStep, onBackStep } from "src/redux/slices/product";
//

import countries from "./countries.json";
//
import { useMutation } from "react-query";
import * as api from "src/services";
import useTranslation from "next-translate/useTranslation";
import { OrderDetails } from "../orders";
import axios from "axios";
import { useRouter } from "next/router";

const CheckoutSummary = dynamic(() => import("./checkoutSummary"));
const CheckoutBillingInfo = dynamic(() => import("./checkoutBillingInfo"));
const CheckoutPaymentMethods = dynamic(
  () => import("./checkoutPaymentMethods")
);
import { toast } from "react-hot-toast";
// ----------------------------------------------------------------------
interface BillingProps {
  name: string;
  email: string;
  address: {
    city: string;
    line1: string;
    state: string;
    postal_code: string;
    country: string;
  };
}
interface MyValues {
  payment: string;
}
interface PaymentProps {
  value: string;
  title: string;
  icons: string[];
  description: string;
}
const PAYMENT_OPTIONS: PaymentProps[] = [
  // {
  //   value: "credit_card",
  //   title: "credit-card",
  //   description: "credit-description",
  //   icons: ["/icons/ic_mastercard.svg", "/icons/ic_visa.svg"],
  // },
  {
    value: "COD",
    title: "cash-on-delivery",
    description: "cash-description",
    icons: [],
  },
];

// ----------------------------------------------------------------------

export default function CheckoutPayment({ ...props }) {
  const { onChangeBackStep, onChangegoToStep } = props;
  const router = useRouter();
  const { t } = useTranslation("checkout");
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    ({ user }: { user: any }) => user
  );
  const { symbol, unitRate, currency } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  console.log("is Checking a isloding value ");

  // const { mutate, isLoading } = useMutation("order", api.placeOrder, {
  //   onSuccess: (data) => {
  //     console.log(data, " here getting a place a order");
  //     toast.success(t("common:order-placed"));
  //     for (let temp of data) {
  //       router.push(`/orders?oid=${temp}`);
  //     }

  //     // router.push(data);
  //   },
  // });

  const { mutate, isLoading } = useMutation("order", api.placeOrder, {
    onSuccess: async (data) => {
      toast.success(t("common:order-placed"));

      // const orderIds = data.map((temp) => temp.orderId);

      // console.log("All order IDs:", orderIds);
      // const allOrderData = [];

      // Loop through the data obtained from placing orders

      // Join the order IDs into a single string with comma separation
      // const orderIdsString = orderIds.join(",");

      // Push the order IDs to the /orders route as a query parameter
      router.push(`/orders?oid=${data.orderId}`);
    },
  });

  const { checkout } = useSelector(({ product }: { product: any }) => product);
  const { total, discount, subtotal, shipping, billing, cart } = checkout;

  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState<null | string>();

  const onSubmited = async ({ ...values }) => {
    setCheckoutError(null);

    const selected = countries.find(
      (v: any) => v.label.toLowerCase() === billing.country.toLowerCase()
    );

    const billingDetails: BillingProps = {
      name: user?.fullName || billing.firstName + " " + billing.lastName,
      email: user?.email || billing.email,
      address: {
        city: user?.city || billing.city,
        line1: user?.address || billing.address,
        state: user?.state || billing.state,
        postal_code: user?.zip || billing.zip,
        country: selected?.code.toLocaleLowerCase() || "us",
      },
    };

    setProcessingTo(true);

    try {
      const { data: clientSecret } = await axios.post("/api/payment_intents", {
        amount: Number(total * Number(unitRate)),
        currency: currency,
      });

      setProcessingTo(false);
      return mutate(values);
    } catch (err) {
      setCheckoutError(err.message);
      setProcessingTo(false);
    }
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
    onChangeBackStep();
  };

  const handleGotoStep = (step: number) => {
    dispatch(onGotoStep(step));
    onChangegoToStep(step);
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.mixed().required("Payment is required"),
  });

  const formik: FormikProps<MyValues> = useFormik<MyValues>({
    initialValues: {
      payment: "",
    },
    validationSchema: PaymentSchema,
    onSubmit: async ({ ...props }) => {
      const { setErrors }: any = props;
      try {
        placeOrder();
      } catch (error) {
        console.error(error);
        setErrors(error.message);
      }
    },
  });

  const getConversionRate = (val: number) => {
    const converted = (val * Number(unitRate)).toFixed(1);
    // const converted = (val).toFixed(1);
    return converted;
  };

  const { values, handleSubmit } = formik;
  const placeOrder = async () => {
    const filtered = cart.map(({ available, ...newobj }: any) => newobj);
    const convertedItems = filtered.map((val: any) => {
      return {
        ...val,
        price: getConversionRate(val.price),
        priceSale: getConversionRate(val.priceSale),
      };
    });

    const { _id, receiver, phone, ...newBilling } = billing;

    const data = {
      paymentMethod: values.payment,
      total: getConversionRate(total),
      shipping: getConversionRate(shipping),
      discount: getConversionRate(discount),
      subTotal: getConversionRate(subtotal),
      basePrice: total,
      currency: symbol,
      createdAt: Date.now(),
      items: convertedItems,
      user: !isAuthenticated
        ? {
            ...billing,
          }
        : {
            _id: user?._id,
            fullName: user?.fullName,
            email: user?.email,
            phone: billing?.phone,
            avatar: user?.avatar,
            ...newBilling,
          },
    };
    if (data.paymentMethod === "COD") {
      return mutate(data);
    } else {
      await onSubmited(data);
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutPaymentMethods
              formik={formik}
              paymentOptions={PAYMENT_OPTIONS}
              error={checkoutError}
            />
            <Button
              type="button"
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<ArrowBackRoundedIcon />}
            >
              {t("back")}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckoutBillingInfo onBackStep={handleBackStep} />
            <CheckoutSummary
              enableEdit
              total={total}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              onEdit={() => handleGotoStep(0)}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isLoading || isProcessing}
            >
              {t("complete-order")}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
