import React, { useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import * as api from "src/services";
import useTranslation from "next-translate/useTranslation";
import { useMutation } from "react-query";
import { fDateTime } from "src/utils/formatTime";

const renderTableRows = (amcsData: any, handleApply: any) => {
  if (!Array.isArray(amcsData) || amcsData.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={9} align="center">
          {Array.isArray(amcsData)
            ? "No data available."
            : "Data is loading data."}
        </TableCell>
      </TableRow>
    );
  }

  return amcsData.map((amc: any, index: any) => (
    <TableRow key={index}>
      <TableCell>{amc.orderId}</TableCell>
      <TableCell>{fDateTime(amc?.orderDate)}</TableCell>
      <TableCell>{amc.ProductName}</TableCell>
      <TableCell>{amc.amcsTitel}</TableCell>
      <TableCell>{amc.duration}</TableCell>
      <TableCell>{amc.serialkey}</TableCell>
      <TableCell>{fDateTime(amc?.expryDate ? amc?.expryDate : null)}</TableCell>
      <TableCell>{amc.status}</TableCell>
      <TableCell>
        {amc.status == "N/A" && (
          <Button variant="contained" onClick={() => handleApply(amc)}>
            Apply
          </Button>
        )}
      </TableCell>
    </TableRow>
  ));
};

export default function IterateAmcs(props: any) {
  const amcsData = props;
  const { t } = useTranslation("profile");
  const router = useRouter();
  const pageParam = router.query.page;

  const [open, setOpen] = useState(false);
  const [serialNo, setSerialKey] = useState("");
  const [selectedAmc, setSelectedAmc] = useState(null);

  const handleOpen = (amc: any) => {
    setSelectedAmc(amc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAmc(null);
    setSerialKey("");
  };

  const mutation = useMutation(api.updateAmcs, {
    onSuccess: () => {
      handleClose();
    },
  });

  const handleApply = (serialNo: String, amc: any) => {
    const data = { serialNo: serialNo, amc: amc };
    mutation.mutate(data);
  };
  const {
    data: amcsData1,
    isLoading,
    isError,
  } = useQuery(
    ["user-details", pageParam],
    () => api.getAmcsDetails(`?page=${pageParam || 1}`),
    {
      retry: false,
      onError: (error: any) => {
        console.error("Error fetching data:", error);
      },
    }
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <h1>Apply Amcs</h1>
      <Table>
        <TableBody>
          <TableRow
            sx={{
              background: (theme) => theme.palette.primary.main,
            }}
          >
            <TableCell width="200px" sx={{ color: "common.white" }}>
              Orderid
            </TableCell>
            <TableCell sx={{ color: "common.white" }}>Date</TableCell>
            <TableCell sx={{ color: "common.white" }}>Product Name</TableCell>
            <TableCell sx={{ color: "common.white" }}>Amc Title</TableCell>
            <TableCell sx={{ color: "common.white" }}>Duration</TableCell>
            <TableCell sx={{ color: "common.white" }}>Serial Number</TableCell>
            <TableCell sx={{ color: "common.white" }}>Expiry Date</TableCell>
            <TableCell sx={{ color: "common.white" }}>Status</TableCell>
            <TableCell sx={{ color: "common.white" }}>Action</TableCell>
          </TableRow>
          {renderTableRows(amcsData?.data, handleOpen)}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 25, 50, 100]}
        component="div"
        count={amcsData?.data?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Apply Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Apply Amc</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Serial Key"
            fullWidth
            value={serialNo}
            onChange={(e) => setSerialKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleApply(serialNo, selectedAmc)}
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
