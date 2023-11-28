import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Button,
} from "@mui/material";
import NotFound from "src/components/illustrations/noDataFound/noDataFound";
import Pagination from "src/components/pagination";
import TableHead from "./tableHead";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import * as api from "src/services";
import useTranslation from "next-translate/useTranslation";
import { Date } from "mongoose";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

interface queryData {
  status: string;
  startDate: Date;
  endDate: Date;
  orderNumber: string;
}

export default function CustomTable({
  headData,
  row,
  mobileRow,
  ...props
}: any) {
  const router = useRouter();
  const { page: pageParam } = router.query;
  const [coverData, setCoverData] = useState({});
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [orderNumber, setOrdernumber] = useState("");

  const Component = row;
  const CardComponent = mobileRow;
  const removefilter = () => {
    setDeliveryStatus("");
    setEndDate("");
    setStartDate("");
    setOrdernumber("");
  };

  const { data, isLoading } = useQuery(
    [
      "user-details",
      pageParam,
      deliveryStatus,
      startDate,
      orderNumber,
      endDate,
    ],
    () =>
      api.getUserProfile(
        `?page=${
          pageParam || 1
        }&deliveryStatus=${deliveryStatus}&startDate=${startDate}&endDate=${endDate}&orderNumber=${orderNumber}`
      ),
    {
      retry: false,
      onError: (error) => {
        if (!error) {
          router.push("/404");
        }
      },
    }
  );

  useEffect(() => {}, [data]);

  const { t } = useTranslation("order");
  return (
    <>
      {!isLoading && data?.data?.length === 0 ? (
        <NotFound title="No Order Found" />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              marginBottom: "10px",
              flexDirection: "column",
              gap: 2,
              "@media (min-width: 600px)": {
                flexDirection: "row",
                flexWrap: "wrap",
              },
            }}
          >
            <TextField
              sx={{ flex: "1 1 15vh" }}
              label="Status"
              variant="outlined"
              fullWidth
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              select
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="returned">Return</MenuItem>
              <MenuItem value="in transit">In transit</MenuItem>
            </TextField>

            <TextField
              variant="outlined"
              fullWidth
              sx={{ flex: "1 1 15vh" }}
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ flex: "1 1 15vh" }}
              label="End Date"
              variant="outlined"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ flex: "1 1 15vh" }}
              label="Order ID"
              variant="outlined"
              value={orderNumber}
              onChange={(e) => setOrdernumber(e.target.value)}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                sx={{ flex: "1 1 15vh" }}
                variant="contained"
                onClick={removefilter}
              >
                clear filter
              </Button>
            </Box>
          </Box>

          <Container sx={{ display: { md: "block", xs: "none" } }}>
            <TableContainer>
              <Table>
                <TableHead headData={headData} />
                <TableBody>
                  {data?.data?.orders
                    ? isLoading
                      ? Array.from(new Array(6)).map((_, index) => "")
                      : data.data.orders.map((item: any) => (
                          <Component
                            key={item?.id}
                            row={item}
                            isLoading={isLoading}
                            setCoverData={setCoverData}
                            productData={item?.items || []}
                            {...props}
                          />
                        ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
          {mobileRow && (
            <Box sx={{ display: { md: "none", xs: "block" } }}>
              {(isLoading && data
                ? Array.from(new Array(6))
                : data?.data?.orders
              )?.map((item: any) => (
                <CardComponent
                  key={item?.id}
                  item={item}
                  isLoading={isLoading}
                  {...props}
                />
              ))}
            </Box>
          )}

          {!isLoading && (
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mt: 2, pr: 2 }}
            >
              <Pagination data={data?.data} />
            </Box>
          )}
        </>
      )}
    </>
  );
}
