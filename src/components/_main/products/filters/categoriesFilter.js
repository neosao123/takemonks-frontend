import React from "react";
import { useRouter } from "next/router";
import _ from "lodash";

// material
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Skeleton,
  Box,
  Typography,
  Button,
  Zoom,
} from "@mui/material";

// api
import { useQuery } from "react-query";
import * as api from "src/services";

// utils
import { paramCase } from "change-case";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
export default function CategoriesFilter() {
  const { query, push } = useRouter();
  const { category } = query;
  const { data, isLoading } = useQuery("categories", () => api.getCategories());
  const categories = data?.data;

  const [state, setstate] = React.useState({
    categories: [],
  });
  const handleChange = (props, e) => {
    var data = state.categories;
    if (e.target.checked) {
      data = [...data, props];
      setstate({
        ...state,
        categories: [...state.categories, paramCase(props)],
      });
      push({
        query: {
          ...query,
          category: [...state.categories, paramCase(props)].join("_"),
        },
      });
    } else {
      const index = data.indexOf(paramCase(props));
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.categories.filter(
          (cate) => cate !== paramCase(props)
        );
        setstate({ ...state, categories: filtered });
        push({
          query: { ...query, category: filtered.join("_") },
        });
      } else {
        const updatedQuery = _.omit(query, "category");
        push({
          query: updatedQuery,
        });
      }
    }
  };
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("category")) {
      let category = params.get("category");
      setstate({
        ...state,
        categories: [...state.categories, ...category.split("_")],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, mb: 1 }}
        color="text.primary"
      >
        Category {category && "(" + category?.split("_").length + ")"}
        <Zoom in={Boolean(category)}>
          <Button
            onClick={() => {
              const updatedQuery = _.omit(query, "category");
              setstate({ ...state, categories: [] });
              push({
                query: updatedQuery,
              });
            }}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ float: "right", mt: "-3px" }}
          >
            reset
          </Button>
        </Zoom>
      </Typography>

      <Grid container>
        {(isLoading ? Array.from(new Array(2)) : categories)?.map((v) =>
          !isLoading ? (
            <Grid key={Math.random()} item xs={12}>
              <FormGroup>
                <FormControlLabel
                  sx={{ textTransform: "capitalize" }}
                  name="category"
                  checked={state.categories.includes(paramCase(v.name))}
                  onChange={(e) => handleChange(v.name, e)}
                  control={<Checkbox {...label} />}
                  label={v.name}
                />
              </FormGroup>
            </Grid>
          ) : (
            <Grid key={Math.random()} item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", height: 36 }}>
                <Skeleton
                  variant="rectangular"
                  sx={{ height: 24, width: 24, mr: 1, borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="90%"
                  sx={{ height: 10 }}
                />
              </Box>
            </Grid>
          )
        )}
      </Grid>
    </>
  );
}
