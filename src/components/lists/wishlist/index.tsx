import React, { useState } from "react";
import { paramCase } from "change-case";
import RouterLink from "src/utils/link";
// material
import {
  Box,
  List,
  Badge,
  Stack,
  ListItem,
  Skeleton,
  Divider,
  Typography,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
// components
import product, { addCart } from "src/redux/slices/product";
import useCurrency from "src/hooks/useCurrency";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
// api
import * as api from "src/services";
// notification
import { setWishlist } from "src/redux/slices/wishlist";
import { useDispatch } from "src/redux/store";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import RootStyled from "./styled";

const SkeletonComponent = () => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography variant="body2" color="text.primary">
                <Skeleton variant="text" />
              </Typography>

              <Stack direction="row" alignItems="center">
                <Skeleton variant="circular" height={14} width={14} />
                <Typography variant="body2" color="text.secondary">
                  <Skeleton variant="text" width={140} />
                </Typography>
              </Stack>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default function ListItems({ ...props }) {
  const { item, t, isLast, isUser } = props;
  const router = useRouter();
  // const { checkout } = useSelector((state: any) => state.product);
  const dispatch = useDispatch();
  const linkTo = `/products/${paramCase(item.name)}`;
  const [isLoading, setLoading] = useState(false);
  const { checkout } = useSelector(({ product }: { product: any }) => product);

  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      setLoading(false);
      toast.success(t("common:removed-from-wishlist"));

      dispatch(setWishlist(data.data));
    },
    onError: (err: any) => {
      setLoading(false);
      toast.error(t(err.message));
    },
  });

  const onRemove = () => {
    setLoading(true);
    mutate({
      pid: item._id,
    });
  };

  const isMaxQuantity =
    !isLoading &&
    checkout.cart
      .filter((product: any) => product.id === item?._id)
      .map((product: any) => product.quantity)[0] >= item?.available;

  const onAddToCart = () => {
    const productData = {
      available: item.available,
      color: (item.colors && item.colors[0]) || "any",
      cover: item.cover,
      id: item._id,
      name: item.name,
      price: item.price,
      priceSale: item?.priceSale !== 0 ? item?.priceSale : item?.price,
      quantity: item.available < 1 ? 0 : 1,
      size: (item.sizes && item.sizes[0]) || "any",
    };
    toast.success(t("common:added-to-cart"));
    dispatch(
      addCart({
        ...productData,
        subTotal: item.priceSale * item.quantity,
      })
    );
  };

  return (
    <RootStyled>
      <List disablePadding>
        <ListItem>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
            className="main-stack"
          >
            <Stack
              direction="row"
              alignItems="center"
              className={isUser && "inner-stack"}
            >
              <ListItemAvatar>
                <Avatar
                  onClick={() => router.push(linkTo)}
                  alt={item.name}
                  src={item.cover}
                  className="list-item-avatar"
                />
              </ListItemAvatar>
              <ListItemText
                onClick={() => router.push(linkTo)}
                className="list-item-text"
              >
                <Typography
                  onClick={() => router.push("/")}
                  variant="subtitle1"
                  color="text.primary"
                  noWrap
                >
                  {item.name.slice(0, 20)}
                </Typography>
                <Typography
                  noWrap
                  className="list-item-text-p"
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {item.category}
                </Typography>
                <br></br>
                <Typography
                  className="list-item-text-span"
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {t("header.in-stock")}: {item.available} {t("header.items")}
                </Typography>
              </ListItemText>
            </Stack>
            <Stack justifyContent={"space-around"}>
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
                className="currency-heading"
              >
                {useCurrency(item.salePrice || item.price)}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={item.available == 0 || isMaxQuantity}
                  className="list-btn"
                  onClick={onAddToCart}
                >
                  {t("header.add-to-cart")}
                </Button>
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width={32}
                    height={32}
                    className="list-skeleton"
                  />
                ) : (
                  <IconButton
                    size="small"
                    className="list-icon-btn"
                    onClick={onRemove}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Stack>
        </ListItem>
        {!isLast && <Divider component="li" sx={{ mx: 1 }} />}
        {(isLoading ? Array.from(new Array(7)) : []).map((v) => (
          <SkeletonComponent key={Math.random()} />
        ))}
      </List>
    </RootStyled>
  );
}
