// react
import React, { useState } from "react";

// material
import { Typography, Grid, Box, Button, Zoom, Stack } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

// styles
import RootStyled from "./styled";

// components
import CategoryCard from "src/components/cards/category";
import { NoDataFound } from "src/components";

export default function Categories({ ...props }) {
  const { categories, t } = props;
  const isLoading = !categories;
  const [state, setState] = useState<null | number>(null);

  return (
    <RootStyled>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        className="stack"
      >
        <Zoom in={state !== null}>
          <Button
            className="back-button"
            variant="text"
            color="primary"
            startIcon={<ArrowBackIosRoundedIcon fontSize="small" />}
            onClick={() => setState(null)}
          >
            {t("back")}
          </Button>
        </Zoom>
        <Typography variant="h2" color="text.primary" className="heading">
          {t("categories")}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        className="description"
      >
        {t("lorem-ipsum")}
      </Typography>

      {!isLoading && categories?.length < 1 && <NoDataFound />}
      <Box>
        {state !== null && (
          <Grid container spacing={2}>
            {(isLoading ? Array.from(new Array(1)) : categories[state]).map(
              (inner: any) => (
                <React.Fragment key={Math.random()}>
                  <Grid item lg={3} md={3} sm={4} xs={6}>
                    <CategoryCard
                      state={state}
                      onClickCard={() => setState(null)}
                      isLoading={isLoading as any}
                      category={inner as any}
                    />
                  </Grid>
                </React.Fragment>
              )
            )}
          </Grid>
        )}
      </Box>
      <Box>
        {state === null && (
          <Grid container spacing={2}>
            {(isLoading ? Array.from(new Array(1)) : categories).map(
              (inner: any, i: number) => (
                <React.Fragment key={Math.random()}>
                  <Grid item lg={3} md={3} sm={4} xs={6}>
                    <CategoryCard
                      totalItems={inner?.length}
                      state={state}
                      onClickCard={() => setState(i)}
                      isLoading={isLoading}
                      category={inner[0]}
                    />
                  </Grid>
                </React.Fragment>
              )
            )}
          </Grid>
        )}
      </Box>
    </RootStyled>
  );
}
