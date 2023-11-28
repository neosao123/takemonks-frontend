import React, { useState } from "react";
import { useQuery } from "react-query";
import useTranslation from "next-translate/useTranslation";
// material
import { Container, Typography, Skeleton } from "@mui/material";
// components
import { Page } from "src/components";
import OrderDetails from "src/components/_main/orders/orderDetails";
import TableCard from "src/components/_main/orders/tableCard";
// api
import * as api from "src/services";
// utils

import { useRouter } from "next/router";

// redux
import { useDispatch } from "react-redux";
import { resetCart } from "src/redux/slices/product";

export default function OrderDetail() {
  const { t } = useTranslation("order");
  const router = useRouter();
  const dispatch = useDispatch();
  const { oid: id } = router.query;

  const { data: singleOrder, isLoading } = useQuery(
    ["order", id],
    () => api.getSingleOrder(id),
    {
      enabled: Boolean(id),
      retry: 2,
      onError: (error: any) => {
        if (!error.response.data.success) {
          router.push("/404");
        }
      },
    }
  );

  const data = singleOrder?.data.data;
  React.useEffect(() => {
    dispatch(resetCart());
  }, []);

  return (
    <Page title={`Order created | ${process.env.DOMAIN_NAME}`}>
      <Container>
        <Typography variant="h3" mt={5} mb={2}>
          {isLoading ? (
            <Skeleton variant="text" width={170} />
          ) : (
            t("order-created")
          )}
        </Typography>
        <OrderDetails
          data={data}
          isLoading={isLoading}
          currency={data?.currency}
        />
        <TableCard data={data} isLoading={isLoading} />
      </Container>
    </Page>
  );
}
