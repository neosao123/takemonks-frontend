import React, { useState } from "react";
// material
import InvoicePDF from "src/components/table/tableRows/InvoicePDF";
import {
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Avatar,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Grid, Paper, Typography, Skeleton, Box, Stack } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Label from "src/components/label";
import { fDateShort } from "src/utils/formatTime";
import { capitalize } from "lodash";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import OrderIndex from "src/pages/orders/orderIndex";
import TrackingNumberIcon from "@mui/icons-material/LocalShipping";
const RootStyle = styled(Paper)(({ theme }) => ({
  padding: "10px 10px 10px 16px",
  marginBottom: "0.5rem",
  backgroundColor: theme.palette.background.paper,
  border: "1px solid " + theme.palette.divider,
  borderRadius: 4,
  "& .name": {
    fontWeight: 600,
    color: theme.palette.info.main,
  },
  "& .time svg": {
    width: 10,
    height: 10,
    "& path": {
      fill: theme.palette.text.primary,
    },
  },
  "& .date": {
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  "& .callander": {
    "& svg": {
      width: 10,
      height: 10,
    },
  },
  "& .time-slot": {
    fontWeight: 500,
    fontSize: "0.75rem",
  },
  "& .phone-container": {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: "0.5rem",
    "& .phone": {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      fontSize: 11,
    },
    "& .btn-phone": {
      fontSize: "1px",
    },
  },
}));

export default function AgendaCodeMobile({ ...props }) {
  const { item, isLoading } = props;
  const [showPdf, setShowPdf] = useState(false);
  const theme = useTheme();
  const [changeState, setChangeState] = useState(false);
  const handleTableRowClick = () => {
    setChangeState((preState) => !preState);
  };
  const [trackOrder, setTrackorder] = useState(false);
  const handleOrder = () => {
    setTrackorder(!trackOrder);
  };
  const handleDownloadButtonClick = (row: any) => {
    setShowPdf(!showPdf);
  };
  const trackingInfo = [
    "pending",
    "shipped",
    "in transit",
    "delivered",
    "return",
  ];
  return (
    <RootStyle
      onClick={handleTableRowClick}
      sx={{
        borderLeft: `6px solid ${
          isLoading
            ? theme.palette.divider
            : theme.palette[
                (item?.status === "delivered" && "success") ||
                  (item?.status === "in transit" && "warning") ||
                  (item?.status === "pending" && "info") ||
                  "error"
              ].main
        }`,
      }}
      key={Math.random()}
    >
      <Grid container alignItems="center">
        <Grid item md={8} sm={8} xs={8}>
          <Stack spacing={0.5}>
            <Typography variant="h6" color="primary.main" noWrap>
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                capitalize(item?.items[0]?.name || item?.amcsItems[0]?.name)
              )}
            </Typography>

            <Stack spacing={1} direction="row" alignItems="center">
              {isLoading ? (
                <Skeleton variant="circular" width={20} height={20} />
              ) : (
                <ShoppingCartRoundedIcon fontSize="small" />
              )}
              <Typography className="time-slot">
                {isLoading ? (
                  <Skeleton variant="text" width={50} />
                ) : (
                  item?.items?.length + item?.amcsItems?.length
                )}
              </Typography>
              {isLoading ? (
                <Skeleton variant="circular" width={20} height={20} />
              ) : (
                <DateRangeRoundedIcon fontSize="small" />
              )}
              <Typography className="date">
                {isLoading ? (
                  <Skeleton variant="text" width={50} />
                ) : (
                  fDateShort(item?.createdAt)
                )}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography sx={{ textAlign: "right", mb: 0.5 }} variant="body2">
            {/* type error */}
            {/* {isLoading ? (
              <Skeleton variant="text" width={50} sx={{ ml: "auto" }} />
            ) : (
              useCurrency(Number(item?.total)).slice(0, -3)
            )} */}
          </Typography>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Label
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={
                  (item?.status === "delivered" && "success") ||
                  (item?.status === "in transit" && "warning") ||
                  (item?.status === "pending" && "info") ||
                  "error"
                }
              >
                {capitalize(item?.status)}
              </Label>
            )}
          </Box>
        </Grid>
      </Grid>
      {item?.status === "shipped" || item?.status === "in transit" ? (
        <TableCell align="right">
          <Button
            startIcon={<TrackingNumberIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleOrder();
            }}
          >
            Track Order
          </Button>
        </TableCell>
      ) : null}
      {item?.status === "delivered" ? (
        <TableCell align="right">
          <Button
            startIcon={<CloudDownloadIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadButtonClick(item);
            }}
          >
            Invoice
          </Button>
        </TableCell>
      ) : null}
      <>
        <>
          {showPdf ? (
            <>
              <TableRow>
                <TableCell colSpan={6}>
                  <InvoicePDF row={item}></InvoicePDF>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </>
          ) : null}
        </>
        {changeState ? (
          <>
            <Typography>
              <OrderIndex id={item?._id}></OrderIndex>
            </Typography>
          </>
        ) : null}
      </>
      <>
        {trackOrder ? (
          <TableRow>
            <TableCell colSpan={6}>
              <div
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  background: "#fff",
                  fontFamily: "Arial, sans-serif",
                  overflowX: "auto", // Enable horizontal scrolling on small screens
                }}
              >
                <h2
                  style={{
                    color: "#2874f0",
                    fontSize: "18px", // Adjusted font size for the heading
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  Order Tracking
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {trackingInfo.map((status, index) => (
                    <div
                      key={index}
                      style={{ marginBottom: "10px", width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          padding: "12px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            color: status === item.status ? "#ff5722" : "#333",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ marginBottom: "8px" }}>
                            <b style={{ fontSize: "12px" }}>{status}</b>
                          </div>
                          {status === item.status && (
                            <div style={{ fontSize: "10px" }}>
                              Tracking No: {item.ordertrackingNumber}
                              <br />
                              Delivery Partner: {item.deliveryPartner}
                            </div>
                          )}
                        </span>
                        {status !== "return" && (
                          <ArrowForwardIcon
                            style={{
                              color: "#ff5722",
                              fontSize: "16px",
                              marginTop: "8px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : null}
      </>
    </RootStyle>
  );
}
