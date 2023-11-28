import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { isString } from "lodash";
import Products from "models/Products";
import dbConnect from "lib/dbConnect";
import useTranslation from "next-translate/useTranslation";
// material
import { Box, Stack, Drawer } from "@mui/material";
import { useMediaQuery, IconButton, Typography, Skeleton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

// components
import { Page } from "src/components";

// api
import * as api from "src/services";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import Filter from "src/components/_main/products/filter";
const Pagination = dynamic(() => import("src/components/pagination"));
const ProductList = dynamic(
  () => import("src/components/_main/products/productList")
);

const sortData = [
  { title: "top-rated", key: "top", value: -1 },
  { title: "asceding", key: "name", value: 1 },
  { title: "desceding", key: "name", value: -1 },
  { title: "Price-low-high", key: "price", value: 1 },
  { title: "Price-high-low", key: "price", value: -1 },
  { title: "oldest", key: "date", value: 1 },
  { title: "newest", key: "date", value: -1 },
];

function Listing({ ...props }) {
  const filteres = props;
  const { t } = useTranslation("listing");
  const router = useRouter();
  const { unitRate } = useSelector(
    ({ settings }: { settings: any }) => settings
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [sort, setSort] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("12");

  const { data, isLoading } = useQuery(["product", router.query], () =>
    api.getProducts(
      Object.keys(router.query).length === 0
        ? ""
        : `?${router.asPath.split("?")[1]}&unit=${unitRate}`
    )
  );

  const handleChange = (event: any) => {
    const filtered: any = sortData.find(
      (item) => item.title === event.target.value
    );

    if (sort) {
      const sortedData = sortData.find((item) => item.title === sort);
      const key: string | undefined = sortedData?.key;
      const updatedQuery = _.omit(router.query, key || "");
      router.push({
        query: { ...updatedQuery, ...{ [filtered.key]: filtered.value } },
      });
      setSort(filtered.title);
    } else {
      router.push({
        query: { ...router.query, [filtered.key]: filtered.value },
      });
      setSort(filtered.title);
    }
  };

  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const { limit } = router.query;

    setItemsPerPage(isString(limit) ? limit : "12");
    setSort(
      router.query.top === "-1"
        ? "top-rated"
        : router.query.name === "1"
        ? "asceding"
        : router.query.name === "-1"
        ? "desceding"
        : router.query.date === "1"
        ? "oldest"
        : router.query.date === "-1"
        ? "newest"
        : router.query.price === "1"
        ? "Price-low-high"
        : router.query.price === "-1"
        ? "Price-high-low"
        : "top-rated"
    );
  }, [router.query.name || router.query.date || router.query.price]);

  return (
    <Page
      title="Products | Commercehope"
      description="COMMERCEHOPE is a leading open source reactjs ecommerce script software based on Nextjs and Mongodb that can be used to sell your products online. We are a team of developers and designers who are passionate about creating a great user experience for your customers."
      canonical="products"
    >
      <Box sx={{ bgcolor: "background.default" }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid
              item
              md={3}
              xs={0}
              sx={{
                ...(isMobile && {
                  display: "none",
                }),
              }}
            >
              <Filter filteres={filteres} t={t} />
            </Grid>
            <Grid item md={9} xs={12}>
              <Stack
                pt={2}
                alignItems="center"
                justifyContent={"space-between"}
                sx={{
                  flexDirection: { md: "row", xs: "column-reverse" },
                  button: {
                    mr: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    "&.active": {
                      border: (theme) =>
                        `1px solid ${theme.palette.primary.main}`,
                      svg: {
                        color: "primary.main",
                      },
                    },
                  },
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mt: { md: 0, xs: 1.5 },
                    fontSize: {
                      sm: "1rem",
                      xs: "12px",
                    },
                  }}
                >
                  {isLoading ? (
                    <Skeleton variant="text" width={200} />
                  ) : (
                    data?.total !== 0 && (
                      <>
                        {t("showing")}{" "}
                        {router?.query.page
                          ? `${
                              (Number(router?.query.page) - 1) *
                                Number(itemsPerPage) +
                              1
                            }`
                          : 1}
                        -
                        {data?.total <
                        Number(itemsPerPage) * (Number(router?.query.page) || 1)
                          ? data?.total
                          : Number(itemsPerPage) *
                            (Number(router?.query.page) || 1)}{" "}
                        {t("of")} {data?.total} {t("items")}
                      </>
                    )
                  )}
                </Typography>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ display: { md: "flex", xs: "none" } }}
                    mr={1}
                  >
                    {t("sort")}:
                  </Typography>

                  <IconButton
                    onClick={() => setOpenDrawer(true)}
                    sx={{ display: { md: "none", xs: "flex" } }}
                  >
                    <TuneRoundedIcon />
                  </IconButton>
                  <FormControl size="small" fullWidth sx={{ minWidth: 150 }}>
                    {!sort ? (
                      <Skeleton variant="rounded" width={150} height={40} />
                    ) : (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        onChange={handleChange}
                      >
                        {sortData.map((item) => (
                          <MenuItem key={Math.random()} value={item.title}>
                            {t(item.title)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                  <FormControl size="small" fullWidth sx={{ maxWidth: 150 }}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        router.push({
                          query: { ...router.query, limit: e.target.value },
                        });
                      }}
                    >
                      {["12", "18", "24", "30"].map((item) => (
                        <MenuItem key={Math.random()} value={item}>
                          {t("show")}: {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <ProductList
                data={data}
                isLoading={isLoading}
                isMobile={isMobile}
              />
              {!isLoading && data?.length !== 0 && <Pagination data={data} />}
            </Grid>
          </Grid>
        </Container>
        <Drawer
          anchor={"right"}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Filter
            filteres={filteres}
            isMobile
            onClose={() => setOpenDrawer(false)}
          />
        </Drawer>
      </Box>
    </Page>
  );
}

export const getStaticProps = async () => {
  await dbConnect();

  const totalProducts = await Products.find({
    status: { $ne: "disabled" },
  }).select(["colors", "sizes", "price", "gender"]);
  const mappedColors = totalProducts.map((v) => v.colors);
  const total: any = totalProducts.map((item) => item.gender);

  function onlyUnique(value: string, index: number, array: string[]) {
    return array.indexOf(value) === index;
  }
  const mappedSizes = totalProducts.map((v) => v.sizes);
  const mappedPrices = totalProducts.map((v) => v.price);
  const min = Math.min(...mappedPrices);
  const max = Math.max(...mappedPrices);

  return {
    props: {
      colors: JSON.parse(JSON.stringify(_.union(...mappedColors))),
      sizes: JSON.parse(JSON.stringify(_.union(...mappedSizes))),
      prices: JSON.parse(JSON.stringify([min, max])),
      genders: JSON.parse(JSON.stringify(total.filter(onlyUnique))),
    },
    revalidate: 60,
  };
};

export default Listing;
