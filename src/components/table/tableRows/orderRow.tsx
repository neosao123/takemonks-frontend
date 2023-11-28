import React, { useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import { Document, Page, pdfjs } from "react-pdf";
import InvoicePDF from "./InvoicePDF";
import { useRouter } from "next/router";
// import { InvoicePdf } from "./InvoicePDF";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import jsPDF from "jspdf";
import OrderIndex from "src/pages/orders/orderIndex";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import TrackingNumberIcon from "@mui/icons-material/LocalShipping";
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  Table,
  Stack,
  TableHead,
  Avatar,
  Button,
} from "@mui/material";
const headData = [
  { id: "name", label: "Product", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
  { id: "total", label: "Total", alignRight: false, sort: true },
  { id: "inventoryType", label: "Status", alignRight: false, sort: true },
  { id: "createdAt", label: "Date", alignRight: true, sort: true },
];
// components
import Label from "src/components/label";
import { fDateTime } from "src/utils/formatTime";
import product from "src/redux/slices/product";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js`;

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 44,
  height: 44,
  minWidth: 44,
  objectFit: "cover",
  margin: theme.spacing(0, 1),
  borderRadius: "8px",
}));

export default function OrderRowas({ ...props }) {
  const router = useRouter();
  const { isLoading, row, productData, setCoverData } = props;
  let abcd = false;
  const [changeState, setChangeState] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [trackOrder, setTrackorder] = useState(false);

  const [showPdf, setShowPdf] = useState(false);
  const theme = useTheme();
  const handleTableRowClick = () => {
    setChangeState((preState) => !preState);
    abcd = true;
  };

  const handleDownloadButtonClick = (row: any) => {
    setShowPdf(!showPdf);
  };
  const handleOrder = () => {
    setTrackorder(!trackOrder);
  };
  const trackingInfo = [
    "pending",
    "shipped",
    "in transit",
    "delivered",
    "return",
  ];
  const TABLE_HEAD = [
    { id: "name", label: "Product", alignRight: false },
    { id: "quantity", label: "Quantity", alignRight: false },
    { id: "total", label: "Total", alignRight: false, sort: true },
    { id: "inventoryType", label: "Status", alignRight: false, sort: true },
    { id: "createdAt", label: "Date", alignRight: true, sort: true },
    {
      id: "createdAt",
      label: "Download Invoice",
      alignRight: true,
      sort: true,
    },
  ];

  return (
    <>
      <>
        <TableRow hover onClick={handleTableRowClick}>
          <TableCell component="th" padding="none">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                maxWidth: 300,
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width={44}
                  height={44}
                  sx={{
                    borderRadius: 1,
                    margin: (theme) => theme.spacing(0, 1),
                  }}
                />
              ) : row?.items.length > 0 ? (
                <ThumbImgStyle
                  alt={row?.items[0]?.fullName}
                  src={row?.items[0]?.cover}
                />
              ) : row?.amcsItems?.length > 0 ? (
                <ThumbImgStyle
                  alt={row?.amcsItems[0]?.name}
                  src={row?.amcsItems[0]?.cover?.url}
                />
              ) : (
                <Avatar>
                  {row?.items[0]?.name
                    ? row?.items[0]?.name
                    : row?.amcsItems[0]?.title}
                </Avatar>
              )}
              <Typography variant="subtitle2" noWrap>
                {isLoading ? (
                  <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                ) : row?.items.length > 0 ? (
                  row?.items[0]?.name
                ) : row?.amcsItems?.length > 0 ? (
                  row?.amcsItems[0]?.name
                ) : null}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            {" "}
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              row?.items.length +
              (row?.amcsItems[0]?.quantity ? row?.amcsItems[0]?.quantity : 0)
            )}
          </TableCell>
          <TableCell>
            {" "}
            {isLoading ? <Skeleton variant="text" /> : row?.total}
          </TableCell>
          <TableCell>
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              <Label
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={
                  (row?.status === "delivered" && "success") ||
                  (row?.status === "in transit" && "warning") ||
                  (row?.status === "pending" && "info") ||
                  "error"
                }
              >
                {row?.status}
              </Label>
            )}
          </TableCell>
          <TableCell align="right">
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              <>{fDateTime(row?.createdAt)}</>
            )}
          </TableCell>
          {row?.status === "delivered" ? (
            <TableCell align="right">
              <Button
                startIcon={<CloudDownloadIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadButtonClick(row);
                }}
              >
                Invoice
              </Button>
            </TableCell>
          ) : null}
          {row?.status === "shipped" || row?.status === "in transit" ? (
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
        </TableRow>
      </>
      <>
        {changeState ? (
          <>
            <TableRow>
              <TableCell colSpan={6}>
                <OrderIndex id={row?._id}></OrderIndex>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </>
        ) : null}
      </>
      <>
        {showPdf ? (
          <>
            <TableRow>
              <TableCell colSpan={6}>
                <InvoicePDF row={row}></InvoicePDF>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
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
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
                  background: "#fff",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <h2
                  style={{
                    color: "#2874f0",
                    fontSize: "20px", // Reduced font size for the heading
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Order Tracking
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {trackingInfo.map((status, index) => (
                    <div key={index} style={{ marginRight: "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          padding: "12px", // Reduced padding
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Softer shadow effect
                        }}
                      >
                        <span
                          style={{
                            color: status === row.status ? "#ff5722" : "#333",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ marginRight: "8px" }}>
                            <b style={{ fontSize: "14px" }}>{status}</b>{" "}
                            {/* Increased font size */}
                            {status === row.status && (
                              <div
                                style={{ marginTop: "8px", fontSize: "12px" }}
                              >
                                {" "}
                                {/* Increased font size */}
                                <div>
                                  Tracking No: {row.ordertrackingNumber}
                                </div>
                                <div>
                                  Delivery Partner: {row.deliveryPartner}
                                </div>
                              </div>
                            )}
                          </div>
                          {status !== "return" && (
                            <ArrowForwardIcon
                              style={{ color: "#ff5722", fontSize: "20px" }}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : null}
      </>
    </>
  );
}
