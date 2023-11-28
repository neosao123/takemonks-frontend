import React from "react";
// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
// material
import { Typography, Card, Stack, Box, IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { styled } from "@mui/material/styles";
// components
const RootStyled = dynamic(() => import("./styled"));
const Incrementer = dynamic(() => import("src/components/incrementer"));

interface ProductProps {
  sku: string;
  name: string;
  size: string;
  priceSale: string;
  color: string;
  cover: string;
  quantity: number;
  available: string;
  priceofAmcs: any;
}

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 40,
  height: 40,
  minWidth: 40,
  objectFit: "cover",
  marginRight: theme.spacing(2),
  // borderRadius: theme.shape.borderRadiusSm,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
}));

const formatNumbers = (number: number, unitRate: number) => {
  // const converted = (number * Number(unitRate)).toLocaleString(undefined, {
  //   maximumFractionDigits: 2,
  // });
  const converted = number.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return converted;
};

export default function CheckoutCard({ ...props }) {
  const {
    formik,
    onDelete,
    onIncreaseQuantity,
    onDecreaseQuantity,
    symbol,
    unitRate,
    loaded,
  } = props;
  console.log("Props", props);
  const { products } = formik.values;
  const { t } = useTranslation("checkout");
  return (
    <RootStyled>
      {products.map((product: ProductProps) => {
        const {
          sku,
          name,
          size,
          priceSale,
          color,
          cover,
          quantity,
          available,
          priceofAmcs,
        } = product;

        return (
          <Card className="card-main" key={Math.random()}>
            <Stack direction="row" alignItems="center">
              <ThumbImgStyle
                alt="product image"
                src={cover ? cover : priceofAmcs?.cover?.url}
              />{" "}
              <Typography variant="h5" color="text.primary" noWrap>
                {name ? name : priceofAmcs?.title}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Box mt={1}>
                <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>{t("size")}:</b> {size}
                </Typography>

                <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>{t("color")}:</b> {color}
                  {name ? name : priceofAmcs?.discription}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {priceofAmcs?.durationCount} {priceofAmcs?.durationType}
                </Typography>
                {
                  <Typography variant="body2" color="text.primary" mb={0.5}>
                    <b>{t("price")}:</b> {loaded && symbol}{" "}
                    {loaded &&
                      formatNumbers(Number(priceSale), Number(unitRate))}
                  </Typography>
                }
                <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>{t("total")}:</b> {loaded && symbol}{" "}
                  {loaded &&
                    formatNumbers(
                      Number(priceSale) * quantity,
                      Number(unitRate)
                    )}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Incrementer
                  quantity={quantity}
                  available={available}
                  onDecrease={() => onDecreaseQuantity(sku)}
                  onIncrease={() => onIncreaseQuantity(sku)}
                />
                <IconButton color="primary" onClick={() => onDelete(sku)}>
                  <DeleteOutlineRoundedIcon className="delete-icon" />
                </IconButton>
              </Box>
            </Stack>
          </Card>
        );
      })}
    </RootStyled>
  );
}
