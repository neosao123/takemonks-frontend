import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import * as api from "src/services";
const Table = dynamic(() => import("src/components/table/table"));
const OrderRow = dynamic(
  () => import("src/components/table/tableRows/orderRow")
);
const OrderCard = dynamic(() => import("src/components/cards/orderCard"));

const TABLE_HEAD = [
  { id: "name", label: "Product", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
  { id: "total", label: "Total", alignRight: false, sort: true },
  { id: "inventoryType", label: "Status", alignRight: false, sort: true },
  { id: "createdAt", label: "Date & Time", alignRight: true, sort: true },
  { id: "", label: "Action", alignRight: true, sort: true },
];

export default function InvoiceHistory() {
  const router = useRouter();
  const pageParam = router.query.page;
  const { data, isLoading } = useQuery(
    ["user-details", pageParam],
    () => api.getUserProfile(`?page=${pageParam || 1}`),
    {
      retry: false,
      onError: (error: any) => {
        if (!error.response.data.success) {
          router.push("/404");
        }
      },
    }
  );
  const orders = (function () {
    if (isLoading) {
      return null;
    } else {
      const { orders } = data?.data;
      return orders;
    }
  })();
  const tableData = { data: orders, count: data?.data.count };

  return (
    <Box width={1}>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={OrderRow}
        mobileRow={OrderCard}
      />
    </Box>
  );
}
