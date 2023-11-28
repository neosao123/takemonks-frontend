import React from "react";
import {
  Stack,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Image from "next/image";
import protectionImage from "../../../../assets/protection.png";
import { useDispatch, useSelector } from "react-redux";
import { addAmcCart } from "src/redux/slices/product";
import { useFormik, Form, FormikProvider } from "formik";
import toast from "react-hot-toast";

interface ProductAmcProps {
  productAmc: {
    _id: any;
    title: string;
    description: string;
    price: number;
    isLoading: any;
    cover: {
      url: string;
    };
  };
  product: {
    _id: any;
    name: string;
    cover: string;
    available: number;
    sku: string;
    price: number;
    priceSale: number;
    colors: string[];
    sizes: string[];
    isLoading: any;
  };
  symbol: string;
}

export default function ProductAmc({
  productAmc,
  product,
  symbol,
}: ProductAmcProps) {
  const { t } = useTranslation("details");
  const dispatch = useDispatch();
  console.log(productAmc, "Product ID ");
  const onAddCart = () => {
    toast.success(t("common:added-to-cart"));
    dispatch(addAmcCart(values));
  };
  console.log(productAmc, "product amcs ");
  const formik = useFormik({
    initialValues: {
      id: productAmc?._id,
      sku: productAmc.title,
      priceSale: productAmc.price,
      priceofAmcs: productAmc,
      quantity: 1, // Set the initial quantity to 1
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        onAddCart();
        setSubmitting(false);
      } catch (error) {
        console.error("Error:", error);
        setSubmitting(false);
      }
    },
  });

  const { values, handleSubmit } = formik;

  return (
    <Stack>
      <Card sx={{ border: "none" }}>
        <CardContent>
          <Box
            sx={{
              fontSize: "15px",
              borderBottom: "1px solid silver",
              padding: "15px 0",
              display: "flex",
            }}
            mb={3}
          >
            <VerifiedUserOutlinedIcon
              color="success"
              sx={{ marginRight: "10px" }}
            />
            <Typography sx={{ fontWeight: "bold", color: "#525356" }}>
              {t("Protect Product")}
            </Typography>
          </Box>
          <Grid container spacing={2} mb={1}>
            <Grid item xs={2}>
              <Box>
                <Image
                  src={productAmc?.cover?.url ?? protectionImage}
                  alt="Picture of the author"
                  style={{ width: "100%", height: "auto" }}
                  width={100}
                  height={100}
                />
              </Box>
            </Grid>
            <Grid item xs={10}>
              <Box mb={2}>
                <Typography sx={{ fontWeight: 600 }}>
                  {productAmc.title}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography sx={{ color: "#525452" }}>
                  {productAmc.description}
                </Typography>
              </Box>
              <Box
                mb={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontWeight: "500", fontSize: "1.1rem" }}>
                  {symbol} {productAmc.price}
                </Typography>
                <FormikProvider value={formik}>
                  <Form onSubmit={handleSubmit}>
                    <Button type="submit" variant="contained">
                      Add To Cart
                    </Button>
                  </Form>
                </FormikProvider>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
