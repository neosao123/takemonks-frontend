import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { Container, Typography, Skeleton } from "@mui/material";
import { useDispatch } from "react-redux";
import OrderDetails from "src/components/_main/orders/orderDetails";
import TableCard from "src/components/_main/orders/tableCard";
import * as api from "src/services";

export default function OrderIndex({ ...props }) {
  const { id } = props;
  const { t } = useTranslation("order");
  const router = useRouter();
  const dispatch = useDispatch();
  const [singleOrder, setSingleOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getSingleOrder(id);
        setSingleOrder(response.data.data);
        setIsLoading(false);
      } catch (error) {
        if (!error.response || error.response.status === 404) {
          router.push("/404");
        }
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup logic if needed
    };
  }, [id, dispatch, router]);
  const data = singleOrder;

  return (
    <Container>
      <Typography variant="h3" mt={5} mb={2}>
        {isLoading ? (
          <Skeleton variant="text" width={170} />
        ) : (
          <h6>Order Details</h6>
        )}
      </Typography>
      <OrderDetails data={data} isLoading={isLoading} currency={data} />
      <TableCard data={singleOrder} isLoading={isLoading} />
    </Container>
  );
}
