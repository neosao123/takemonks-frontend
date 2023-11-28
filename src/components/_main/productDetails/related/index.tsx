// material
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { Typography } from "@mui/material";

import useTranslation from "next-translate/useTranslation";

const RelatedProducts = dynamic(
  () => import("src/components/carousels/productsCarousel/productsCarousel")
);

// ----------------------------------------------------------------------

const RootStyles = styled("div")(({ theme }) => ({
  "& .heading": {
    textAlign: "center",
    marginTop: theme.spacing(5),
  },
  "& .description": {
    marginTop: theme.spacing(1),
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
}));

export default function EcommerceProductDetails({ ...props }) {
  const { product, relatedProducts } = props;
  const { t } = useTranslation("details");

  return (
    <RootStyles>
      <Typography variant="h2" color="text.primary" className="heading">
        {t("related-products")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        className="description"
      >
        {t("lorem-ipsum")}
      </Typography>
      <RelatedProducts
        data={relatedProducts}
        isLoading={!relatedProducts}
        id={product?._id}
      />
    </RootStyles>
  );
}
